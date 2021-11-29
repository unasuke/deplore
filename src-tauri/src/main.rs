#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde_json::{Result, Value};
use tauri::Manager;
mod store;
mod translate;
use store::Config;
use tokio::runtime::Handle;

#[tokio::main]
async fn main() {
  tauri::Builder::default()
    .setup(move |app| {
      let window = app.get_window("main").unwrap();
      let window_ = window.clone();
      window.listen("test", move |event| match &event.payload() {
        Some(s) => {
          let v: Result<Value> = serde_json::from_str(&s);
          if let Ok(v) = v {
            let handle = Handle::current();
            let (tx, rx) = std::sync::mpsc::channel();
            std::thread::spawn(move || {
              handle.block_on(async {
                let config = store::get().unwrap();
                let resp = translate::handle_translate_request((&v).to_string(), config).await;
                let mut sentence = "".to_string();
                for t in resp.translations.iter() {
                  sentence += &t.text;
                }
                tx.send(sentence).unwrap();
              });
            });
            let recv = rx.recv().unwrap();
            let _ = window_.emit("callback", recv.to_string());
          }
        }
        None => todo!(),
      });
      let window_2 = window.clone();
      window.listen("getconf", move |event| {
        let conf = store::get().unwrap();
        dbg!(&conf);
        let _ = window_2.emit("getconf-callback", serde_json::to_string(&conf).unwrap());
      });
      window.listen("setconf", move |event| match &event.payload() {
        Some(s) => {
          let c: Config = serde_json::from_str(&s).unwrap();

          dbg!(&c);
          store::store(c);
        }
        None => todo!(),
      });
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
