use serde::{Deserialize, Serialize};

use crate::engine::InternalId;

use super::Editor;

/// Block placement strategy.
#[derive(Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum BlockPlacement {
    Relative {
        rel_block_id: String,
        position: RelativePosition,
    },
}

/// Where a block should be placed relative to another.
#[derive(Clone, Serialize, Deserialize)]
pub enum RelativePosition {
    Top,
    Bottom,
}

impl Editor {
    /// Moves a block.
    ///
    /// ## Arguments
    ///
    /// * `block_id` - Block to move.
    /// * `placement` - Placement strategy to move it.
    pub fn move_block(&mut self, block_id: &InternalId, placement: BlockPlacement) {
        match placement {
            BlockPlacement::Relative {
                rel_block_id,
                position,
            } => {
                self.move_block_relative(block_id, rel_block_id, position);
            }
        }
    }

    #[inline]
    fn move_block_relative(
        &mut self,
        block_id: &InternalId,
        rel_block_id: String,
        position: RelativePosition,
    ) {
        let (rel_block_id, rel_parent_id) = match self.registry.get_block(&rel_block_id) {
            Some(block) if block._parent.is_some() => {
                (block.id.clone(), block._parent.clone().unwrap())
            }
            _ => return,
        };
        self.reparent_block(&block_id, Some(&rel_parent_id), |doc| {
            doc.content
                .iter()
                .position(|child| rel_block_id.eq(child))
                .map(|index| match position {
                    RelativePosition::Top => index,
                    RelativePosition::Bottom => index + 1,
                })
        });
    }
}
