pub mod datatypes;

use std::collections::HashMap;

use bricktxt_core::engine::Engine;
use bricktxt_core::rand::randid;
use bricktxt_core::upstream::{EventEmitter, UpstreamController};
use bricktxt_core::view::{View, ViewId};
use datatypes::{
    Block, BlockCreateCommand, BlockDeleteCommand, BlockRepositionCommand,
    BlockUpdatePropertyCommand, Document, FocusRequest,
};

pub struct Backend<E>
where
    E: EventEmitter,
{
    engine: Engine,

    // FIXME figure out architecture to have this in engine
    upstream_controller: UpstreamController<E>,
}

impl<E: EventEmitter> Backend<E> {
    pub fn init(event_emitter: E) -> Self {
        let engine = Engine::init();
        let upstream_controller = UpstreamController::new(event_emitter);
        Self {
            engine,
            upstream_controller,
        }
    }

    fn post_command(&mut self) {
        for view in self.engine.views.iter() {
            self.upstream_controller.update_view(view.id);
        }
    }
}

impl<E: EventEmitter> Backend<E> {
    #[inline]
    pub fn view_create(&mut self, initial_doc_id: String) -> ViewId {
        self.engine.view_id_counter += 1;
        let id = self.engine.view_id_counter;
        self.engine.views.push(View {
            id,
            active_document: initial_doc_id,
        });
        id
    }

    #[inline]
    pub fn view_free(&mut self, view_id: ViewId) {
        self.engine.views.retain(|view| view.id == view_id);
    }

    #[inline]
    pub fn view_get_content(&mut self, view_id: u32) -> Document {
        let document = self
            .engine
            .get_view(view_id)
            .map(|view| &view.active_document)
            .and_then(|doc_id| self.engine.editor.registry.get_document(doc_id))
            .expect("View bound to inexisting document");
        let blocks = document
            .blocks(&self.engine.editor.registry)
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
            .collect();
        Document {
            id: &document.id,
            title: &document.title,
            content: blocks,
        }
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
        if let Some(view) = command.control_focus {
            self.upstream_controller
                .emit_event("focus", FocusRequest { view, block_id: id });
        }
        self.post_command();
    }

    #[inline]
    pub fn cmd_block_delete(&mut self, command: BlockDeleteCommand) {
        let focus_request = command.control_focus.and_then(|view| {
            self.engine
                .editor
                .query_block_and_parent(
                    &command.block_id,
                    |block, parent| {
                        parent.and_then(|doc| {
                            doc.child_pos(&block.id)
                                .filter(|pos| *pos > 0)
                                .map(|pos| doc.content[pos - 1].clone())
                        })
                    },
                    None,
                )
                .map(|focus_block_id| FocusRequest {
                    view,
                    block_id: focus_block_id,
                })
        });
        self.engine.editor.delete_block(&command.block_id);
        if let Some(focus_request) = focus_request {
            self.upstream_controller.emit_event("focus", focus_request);
        }
        self.post_command();
    }

    #[inline]
    pub fn cmd_block_reposition(&mut self, command: BlockRepositionCommand) {
        self.engine
            .editor
            .move_block(&command.block_id, command.placement);
        self.post_command();
    }

    #[inline]
    pub fn cmd_block_update_property(&mut self, command: BlockUpdatePropertyCommand) {
        let block = match self.engine.editor.registry.get_block_mut(&command.block_id) {
            Some(block) => block,
            None => return,
        };
        block.properties.insert(command.property, command.value);
        self.post_command();
    }
}
