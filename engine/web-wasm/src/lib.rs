use bricktxt_core::upstream::EventEmitter;
use bricktxt_core::view::ViewId;
use bricktxt_web_ui_layer::Backend;
use serde::Serialize;
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

#[wasm_bindgen(module = "bricktxt-core")]
extern "C" {
    fn recv_event(event_name: &str, payload: JsValue);
}

#[wasm_bindgen]
pub fn init() -> WebAssemblyBackend {
    #[cfg(feature = "panic_hook")]
    console_error_panic_hook::set_once();

    log("WASM backend init");
    WebAssemblyBackend(Backend::init(WebAssemblyEventEmitter))
}

#[wasm_bindgen]
pub struct WebAssemblyBackend(Backend<WebAssemblyEventEmitter>);

#[wasm_bindgen]
impl WebAssemblyBackend {
    pub fn view_create(&mut self, initial_doc_id: String) -> ViewId {
        self.0.view_create(initial_doc_id)
    }

    pub fn view_free(&mut self, view_id: ViewId) {
        self.0.view_free(view_id);
    }

    pub fn view_get_content(&mut self, view_id: ViewId) -> JsValue {
        let content = self.0.view_get_content(view_id);
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

pub struct WebAssemblyEventEmitter;

impl EventEmitter for WebAssemblyEventEmitter {
    fn emit<S, T>(&self, event_name: S, payload: T)
    where
        S: AsRef<str>,
        T: Serialize,
    {
        recv_event(
            event_name.as_ref(),
            serde_wasm_bindgen::to_value(&payload)
                .expect("Could not convert event payload to JsValue"),
        )
    }
}
