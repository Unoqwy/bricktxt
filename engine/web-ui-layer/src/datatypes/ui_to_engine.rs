//! Data types passed from the UI to the engine.

use serde::Deserialize;

/// A request to reposition a block (source) relative to
/// another one (target).
#[derive(Clone, Deserialize)]
pub struct RepositionCommand {
    /// Source block ID.
    pub source_id: String,
    /// Target block ID.
    pub target_id: String,
    /// Relative position to the target block.
    pub position: RelativePosition,
}

#[derive(Clone, Deserialize)]
pub enum RelativePosition {
    Top,
    Bottom,
}
