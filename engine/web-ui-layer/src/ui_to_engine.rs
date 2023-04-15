//! Data types passed from the UI to the engine.

use serde::{Deserialize, Serialize};

/// A request to reposition a block (source) relative to
/// another one (target).
#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DragMutation {
    /// Source block ID.
    pub source_id: String,
    /// Target block ID.
    pub target_id: String,
    /// Target block border.
    ///
    /// ## Values
    ///
    /// 1 = Top, 2 = Bottom, 3 = Left, 4 = Right
    pub target_border: u8,
}
