//! Data types passed from the engine to the UI.
//!
//! ## Lifetime
//!
//! Because these types are all meant to be temporary, to be serialized
//! and sent to the UI, avoid allocations as much as possible.
//!
//! For example, [`String`] can usually be replaced with a [`&str`].
//! In that case, a lifetime `'ui` is used to say the data should only live
//! until it's serialized to the UI within the same synchronous call.

use serde::Serialize;

#[derive(Clone, Serialize)]
pub struct Document<'ui> {
    pub id: &'ui str,
    pub title: &'ui str,
    pub content: Vec<Block<'ui>>,
}

#[derive(Clone, Serialize)]
pub struct Block<'ui> {
    pub id: &'ui str,
    #[serde(rename = "type")]
    pub ty: &'ui str,
    pub text: &'ui str,
}
