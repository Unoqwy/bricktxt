use bricktxt::random_doc;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn init() {
    log("Engine init");
}

#[wasm_bindgen]
pub fn get_content() -> JsValue {
    let blocks = random_doc();
    serde_wasm_bindgen::to_value(&blocks).unwrap()
}
