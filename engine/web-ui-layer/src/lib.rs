pub mod datatypes;

use std::collections::HashMap;

use bricktxt_core::engine::Engine;
use bricktxt_core::rand::randid;
use datatypes::{
    Block, BlockCreateCommand, BlockDeleteCommand, BlockRepositionCommand,
    BlockUpdatePropertyCommand,
};

pub struct Backend {
    engine: Engine,
}

impl Backend {
    pub fn init() -> Self {
        let engine = Engine::init();
        Self { engine }
    }
}

impl Backend {
    #[inline]
    pub fn get_content(&mut self) -> Vec<Block> {
        let doc = self.engine.editor.registry.all_documents().next().unwrap();
        doc.blocks(&self.engine.editor.registry)
            .into_iter()
            .map(|block| Block {
                id: &block.id,
                ty: &block.ty,
                text: block
                    .properties
                    .get("text")
                    .and_then(|val| val.as_str())
                    .unwrap_or(""),
            })
            .collect()
    }

    #[inline]
    pub fn cmd_block_create(&mut self, command: BlockCreateCommand) {
        let id = randid();
        let block = bricktxt_core::engine::Block {
            id: id.clone(),
            ty: command.ty,
            properties: HashMap::default(),
            _parent: None,
            _dirty: false,
        };
        self.engine.editor.registry.add_block(block);
        self.engine.editor.move_block(&id, command.placement);
    }

    #[inline]
    pub fn cmd_block_delete(&mut self, command: BlockDeleteCommand) {
        self.engine.editor.delete_block(&command.block_id);
    }

    #[inline]
    pub fn cmd_block_reposition(&mut self, command: BlockRepositionCommand) {
        self.engine
            .editor
            .move_block(&command.block_id, command.placement);
    }

    #[inline]
    pub fn cmd_block_update_property(&mut self, command: BlockUpdatePropertyCommand) {
        let block = match self.engine.editor.registry.get_block_mut(&command.block_id) {
            Some(block) => block,
            None => return,
        };
        block.properties.insert(command.property, command.value);
    }
}
