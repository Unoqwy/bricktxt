use serde::Serialize;

use crate::view::ViewId;

/// An [`EventEmitter`] is used to send messages to the UI.
pub trait EventEmitter: Sized {
    fn emit<S, T>(&self, event_name: S, payload: T)
    where
        S: AsRef<str>,
        T: Serialize;
}

/// An [`UpstreamController`] is tasked with reflecting changes
/// that happen in the engine to the UI.
pub struct UpstreamController<E>
where
    E: EventEmitter,
{
    event_emitter: E,
}

impl<E: EventEmitter> UpstreamController<E> {
    pub fn new(event_emitter: E) -> Self {
        Self { event_emitter }
    }
}

impl<E: EventEmitter> UpstreamController<E> {
    pub fn update_view(&self, view_id: ViewId) {
        self.event_emitter.emit("update_views", vec![view_id]);
    }
}
