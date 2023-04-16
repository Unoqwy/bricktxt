//! Data types passed from the UI to the engine.

use bricktxt_core::editor::placement::BlockPlacement;
use serde::Deserialize;

#[derive(Clone, Deserialize)]
pub struct BlockCreateCommand {
    #[serde(rename = "type")]
    pub ty: String,
    pub placement: BlockPlacement,
}

#[derive(Clone, Deserialize)]
pub struct BlockDeleteCommand {
    pub block_id: String,
}

#[derive(Clone, Deserialize)]
pub struct BlockRepositionCommand {
    pub block_id: String,
    pub placement: BlockPlacement,
}

#[derive(Clone, Deserialize)]
pub struct BlockUpdatePropertyCommand {
    pub block_id: String,
    pub property: String,
    pub value: toml::Value,
}
