mod engine_to_ui;
mod ui_to_engine;

use bricktxt_core::rand::randid;
pub use engine_to_ui::*;
pub use ui_to_engine::*;

use bricktxt_core::engine::Engine;
use bricktxt_core::init_engine;

pub struct Backend {
    engine: Engine,
}

impl Backend {
    pub fn get_content(&mut self) -> Vec<Block> {
        let mut ui_blocks = Vec::new();
        ui_blocks.push(Block {
            id: randid(),
            ty: "paragraph".to_owned(),
            text: "Test".to_owned(),
        });
        ui_blocks
    }
}

pub fn init_backend() -> Backend {
    let engine = init_engine();
    Backend { engine }
}
