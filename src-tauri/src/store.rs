extern crate directories;
use directories::ProjectDirs;
use serde::{Deserialize, Serialize};
use std::fs::DirBuilder;
use std::fs::File;
use std::io::ErrorKind;
use std::io::{Read, Write};

const APP: &str = "deplore";

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
  pub api_key: String,
  pub plan: String,
  pub target_language: String,
}

pub fn store(conf: Config) -> std::result::Result<bool, Box<dyn std::error::Error>> {
  prepare();
  if let Some(config_path) = ProjectDirs::from("", "", APP) {
    let config = Config {
      api_key: conf.api_key.to_string(),
      plan: conf.plan.to_string(),
      target_language: conf.target_language.to_string(),
    };
    let toml = toml::to_string(&config).unwrap();
    let mut buf = File::create(config_path.config_dir().join("config.toml"))?;
    buf.write(toml.as_bytes())?;
    Ok(true)
  } else {
    Err("Could not save config".into())
  }
}

pub fn get() -> std::result::Result<Config, Box<dyn std::error::Error>> {
  prepare();
  if let Some(config_path) = ProjectDirs::from("", "", APP) {
    let config_file = config_path.config_dir().join("config.toml");
    let mut file = File::open(config_file)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    let config = toml::from_str(&contents);
    let config = match config {
      Ok(config) => config,
      Err(_) => {
        dbg!("error on get conf");
        Config {
          api_key: "".to_string(),
          plan: "free".to_string(),
          target_language: "EN-US".to_string(),
        }
      }
    };
    Ok(config)
  } else {
    Err("Could not find config file".into())
  }
}

fn prepare() {
  if let Some(config_path) = ProjectDirs::from("", "", APP) {
    let filename = "config.toml";

    DirBuilder::new()
      .recursive(true)
      .create(config_path.config_dir())
      .unwrap();

    let f = File::open(config_path.config_dir().join(filename));
    let _f = match f {
      Ok(file) => file,
      Err(ref err) if err.kind() == ErrorKind::NotFound => {
        match File::create(config_path.config_dir().join(filename)) {
          Ok(create) => create,
          Err(e) => panic!("Problem creating the config file: {:?}", e),
        }
      }
      Err(error) => {
        panic!("Problem opening the config file: {:?}", error)
      }
    };
  };
}
