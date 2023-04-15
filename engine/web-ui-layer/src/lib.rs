pub mod datatypes;

use bricktxt_core::engine::Engine;
use datatypes::{Block, RelativePosition, RepositionCommand, UpdateBlockPropertyCommand};

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
        let doc = self.engine.registry.all_documents().next().unwrap();
        doc.blocks(&self.engine.registry)
            .into_iter()
            .map(|block| Block {
                id: &block.id,
                ty: &block.ty,
                text: block
                    .properties
                    .get("text")
                    .and_then(|val| val.as_str())
                    .unwrap_or("No Text"),
            })
            .collect()
    }

    #[inline]
    pub fn cmd_reposition(&mut self, command: RepositionCommand) {
        let target_block = match self.engine.registry.get_block(&command.target_id) {
            Some(block) => block,
            None => return,
        };
        let target_parent_id = match &target_block._parent {
            Some(parent) => parent.clone(),
            None => return,
        };
        let target_id = target_block.id.clone();
        self.engine
            .reparent_block(&command.source_id, Some(&target_parent_id), |doc| {
                doc.content
                    .iter()
                    .position(|child| target_id.eq(child))
                    .map(|index| match command.position {
                        RelativePosition::Top => index,
                        RelativePosition::Bottom => index + 1,
                    })
            })
    }

    #[inline]
    pub fn cmd_update_block_property(&mut self, command: UpdateBlockPropertyCommand) {
        let block = match self.engine.registry.get_block_mut(&command.block_id) {
            Some(block) => block,
            None => return,
        };
        block.properties.insert(command.property, command.value);
    }
}
