use bricktxt_web_ui_layer::Backend;
use serde_wasm_bindgen::from_value as from_js;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn init() -> WebAssemblyBackend {
    #[cfg(feature = "panic_hook")]
    console_error_panic_hook::set_once();

    log("WASM backend init");
    WebAssemblyBackend(Backend::init())
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
    pub fn cmd_reposition(&mut self, command: JsValue) -> Result<(), serde_wasm_bindgen::Error> {
        self.0.cmd_reposition(from_js(command)?);
        Ok(())
    }

    #[wasm_bindgen]
    pub fn cmd_update_block_property(
        &mut self,
        command: JsValue,
    ) -> Result<(), serde_wasm_bindgen::Error> {
        self.0.cmd_update_block_property(from_js(command)?);
        Ok(())
    }
}
