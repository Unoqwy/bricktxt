use bricktxt_web_ui_layer::{init_backend, Backend, DragMutation};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn init() -> WebAssemblyBackend {
    log("WASM backend init");
    WebAssemblyBackend(init_backend())
}

#[wasm_bindgen]
pub struct WebAssemblyBackend(Backend);

#[wasm_bindgen]
impl WebAssemblyBackend {
    #[wasm_bindgen]
    pub fn get_content(&mut self) -> JsValue {
        let content = self.0.get_content();
        serde_wasm_bindgen::to_value(&content).unwrap()
    }

    #[wasm_bindgen]
    pub fn apply_drag_mutation(&mut self, mutation: JsValue) {
        let mutation: DragMutation = serde_wasm_bindgen::from_value(mutation).unwrap();
    }
}
