#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde_json::{Result, Value};
use tauri::Manager;
mod menu;
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
      window.listen("translate-request", move |event| match &event.payload() {
        Some(s) => {
          let v: Result<Value> = serde_json::from_str(&s);
          if let Ok(v) = v {
            let handle = Handle::current();
            let (tx, rx) = std::sync::mpsc::channel();
            std::thread::spawn(move || {
              handle.block_on(async {
                let config = store::get().unwrap();
                let resp = translate::handle_translate_request((&v).to_string(), config).await;
                tx.send(resp).unwrap();
              });
            });
            let recv = rx.recv().unwrap();
            let _ = window_.emit("translate-callback", serde_json::to_string(&recv).unwrap());
          }
        }
        None => todo!(),
      });
      let window_2 = window.clone();
      window.listen("get-setting", move |_| {
        let conf = store::get().unwrap();
        let _ = window_2.emit(
          "get-setting-callback",
          serde_json::to_string(&conf).unwrap(),
        );
      });
      window.listen("set-setting", move |event| match &event.payload() {
        Some(s) => {
          let c: Config = serde_json::from_str(&s).unwrap();
          let _ = store::store(c);
        }
        None => todo!(),
      });
      Ok(())
    })
    .menu(menu::default())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
