use crate::engine::InternalId;

pub type ViewId = u32;

pub struct View {
    pub id: ViewId,
    pub active_document: InternalId,
}
