//! Data types passed from the engine to the UI.

use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct Block {
    pub id: String,
    #[serde(rename = "type")]
    pub ty: String,
    pub text: String,
}
