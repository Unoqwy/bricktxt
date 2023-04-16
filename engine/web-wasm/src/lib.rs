use bricktxt_web_ui_layer::Backend;
use wasm_bindgen::prelude::*;

macro_rules! impl_cmd_mirror {
  ($backend:ty; $($cmd:ident),*) => {
    #[wasm_bindgen]
    impl $backend {
      $(
        pub fn $cmd(
          &mut self,
          command: JsValue
        ) -> Result<(), serde_wasm_bindgen::Error>
        {
          self.0.$cmd(serde_wasm_bindgen::from_value(command)?);
          Ok(())
        }
      )*
    }
  };
}

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
    pub fn get_content(&mut self) -> JsValue {
        let content = self.0.get_content();
        serde_wasm_bindgen::to_value(&content).unwrap()
    }
}

impl_cmd_mirror!(
    WebAssemblyBackend;
    cmd_block_create,
    cmd_block_delete,
    cmd_block_reposition,
    cmd_block_update_property
);
