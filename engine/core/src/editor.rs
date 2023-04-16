use std::collections::HashMap;

use crate::engine::{Block, Document, InternalId, Registry};

pub mod placement;

/// An [`Editor`] is responsible for updating the state of elements,
/// and letting the engine know when they need saving.
pub struct Editor {
    // FIMXE : Rethink the registry and move it out of editor
    pub registry: Registry,
}

impl Editor {
    pub fn new(registry: Registry) -> Self {
        Self { registry }
    }
}

impl Editor {
    /// Edit a block and its parent.
    ///
    /// ## Arguments
    ///
    /// * `block_id` - Block to edit.
    /// * `f` - Closure that takes a mutable reference to the block and its parent.
    ///
    /// ## Returns
    ///
    /// Whether a block with this ID exists and `f` was called.
    pub fn edit_block_and_parent<F>(&mut self, block_id: &InternalId, f: F) -> bool
    where
        F: FnOnce(&mut Block, Option<&mut Document>) -> (bool, bool),
    {
        match self.registry.blocks.get_mut(block_id) {
            Some(block) => {
                let mut parent = block
                    ._parent
                    .as_ref()
                    .and_then(|doc_id| self.registry.documents.get_mut(doc_id));
                let (block_edited, parent_edited) = f(block, parent.as_deref_mut());
                if block_edited {
                    block._dirty = true;
                }
                match parent {
                    Some(doc) if parent_edited => {
                        doc._dirty = true;
                    }
                    _ => {}
                }
                true
            }
            None => false,
        }
    }

    /// Changes a block's parent, removing it from previous one and adding it to the new one (if any).
    ///
    /// ## Arguments
    ///
    /// * `block_id` - Block to reparent.
    /// * `new_parent` - New parent. If `None`, the block will be orphaned.
    /// * `position_fn` - Closure that returns the position at
    ///                   which to insert the child for the parent document.
    ///
    /// ## Returns
    ///
    /// Whether a block with this ID exists and it was reparented.
    pub fn reparent_block<F>(
        &mut self,
        block_id: &InternalId,
        new_parent: Option<&InternalId>,
        position_fn: F,
    ) -> bool
    where
        F: FnOnce(&Document) -> Option<usize>,
    {
        let block = match self.registry.blocks.get_mut(block_id) {
            Some(block) => block,
            None => return false,
        };
        orphan_block(block, &mut self.registry.documents);
        let new_parent = new_parent.and_then(|doc_id| self.registry.documents.get_mut(doc_id));
        block._parent = new_parent.as_ref().map(|doc| doc.id.clone());
        block._dirty = true;
        if let Some(new_parent) = new_parent {
            let index = position_fn(new_parent).filter(|&index| index < new_parent.content.len());
            match index {
                Some(index) => new_parent.content.insert(index, block_id.clone()),
                None => new_parent.content.push(block_id.clone()),
            }
            new_parent._dirty = true;
        }
        true
    }

    /// Deletes a block and the references to it.
    ///
    /// ## Returns
    ///
    /// Whether a block with this ID existed and was deleted.
    pub fn delete_block(&mut self, block_id: &InternalId) -> bool {
        let block = match self.registry.blocks.remove(block_id) {
            Some(block) => block,
            None => return false,
        };
        orphan_block(&block, &mut self.registry.documents);
        true
    }
}

#[inline]
fn orphan_block(block: &Block, reg_documents: &mut HashMap<InternalId, Document>) {
    let parent = block
        ._parent
        .as_ref()
        .and_then(|doc_id| reg_documents.get_mut(doc_id));
    if let Some(parent) = parent {
        let index = parent.content.iter().position(|child| block.id.eq(child));
        if let Some(index) = index {
            parent.content.remove(index);
            parent._dirty = true;
        }
    }
}
