use reqwest::header::HeaderMap;
// use reqwest::Response;
use serde::{Deserialize, Serialize};
use serde_json::Result;
// use std::collections::HashMap;
// use std::error::Error;
// use tokio::runtime::Handle;
// use tokio::runtime::Runtime;

use crate::store::Config;

#[derive(Serialize, Deserialize, Debug)]
pub struct TranslateRequest {
  original_text: String,
  original_text_language: String,
  translated_text_language: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct TranslateResponse {
  original_text: String,
  original_text_language: String,
  translated_text: String,
  translated_text_language: String,
}

#[derive(Deserialize, Debug)]
pub struct DeeplTranslation {
  pub detected_source_language: String,
  pub text: String,
}
#[derive(Deserialize, Debug)]
pub struct DeeplResponse {
  pub translations: Vec<DeeplTranslation>,
}

pub async fn handle_translate_request(message_json: String, config: Config) -> DeeplResponse {
  let plan = config.plan.as_str();
  let host = match plan {
    "free" => "https://api-free.deepl.com/v2/translate",
    "pro" => "https://api.deepl.com/v2/translate",
    _ => todo!(),
  };
  let client = reqwest::Client::new();
  let translate_request = parse(message_json).unwrap();
  let mut headers = HeaderMap::new();
  headers.insert(
    "Content-Type",
    "application/x-www-form-urlencoded".parse().unwrap(),
  );
  headers.insert("User-Agent", "deplore".parse().unwrap());
  let resp = client
    .post(host)
    .headers(headers)
    .body(format!(
      "auth_key={}&text={}&target_lang={}",
      config.api_key, translate_request.original_text, translate_request.translated_text_language
    ))
    .send()
    .await
    .unwrap();
  let parse = resp.json::<DeeplResponse>().await.unwrap();

  return parse;
}
pub fn parse(json: String) -> Result<TranslateRequest> {
  let t: TranslateRequest = serde_json::from_str(&json)?;
  Ok(t)
}
