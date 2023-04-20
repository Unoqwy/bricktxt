use std::collections::hash_map::Values;
use std::collections::HashMap;

use crate::editor::Editor;
use crate::rand::randid;
use crate::view::{View, ViewId};

pub type ExposedId = String;

// TODO : convert string id to int for better performance
pub type InternalId = String;
pub type InternalTypeId = String;

pub struct Source {}

/// A document element.
pub struct Document {
    /// Unique ID.
    pub id: InternalId,
    /// Title. May be empty.
    pub title: String,
    /// Content blocks.
    pub content: Vec<InternalId>,
    /// Metadata.
    pub metadata: HashMap<String, toml::Value>,

    /// Whether the document needs to be saved.
    pub _dirty: bool,
}

/// A block element.
pub struct Block {
    /// Unique ID.
    pub id: InternalId,
    /// Block type.
    pub ty: InternalTypeId,
    /// Properties.
    pub properties: HashMap<String, toml::Value>,

    /// Optional parent.
    pub _parent: Option<InternalId>,
    /// Whether the block needs to be saved.
    pub _dirty: bool,
}

pub struct Engine {
    pub views: Vec<View>,
    pub view_id_counter: ViewId,

    pub editor: Editor,
}

impl Engine {
    pub fn init() -> Self {
        let mut registry = Registry::new();

        let doc_id = "test-doc".to_owned();
        let mut doc_content = Vec::new();
        for i in 0..100 {
            let id = randid();
            if i % 10 == 0 {
                doc_content.push(id.clone());
            }

            let mut ty = "paragraph".to_owned();
            if i % 60 == 0 {
                ty = "heading-1".to_owned();
            }
            let mut properties = HashMap::default();
            properties.insert(
                "text".to_owned(),
                toml::Value::String(format!("Hi {} ({})", id, &ty)),
            );
            registry.add_block(Block {
                id,
                ty,
                properties,
                _parent: Some(doc_id.clone()),
                _dirty: false,
            });
        }

        let doc = Document {
            id: doc_id,
            title: "A document".to_owned(),
            content: doc_content,
            metadata: HashMap::default(),
            _dirty: false,
        };
        registry.add_document(doc);

        Engine {
            views: Vec::new(),
            view_id_counter: 0,
            editor: Editor::new(registry),
        }
    }

    pub fn get_view(&self, id: ViewId) -> Option<&View> {
        self.views.iter().find(|view| view.id == id)
    }
}

impl Document {
    pub fn blocks<'reg>(&self, registry: &'reg Registry) -> Vec<&'reg Block> {
        let mut blocks = Vec::with_capacity(self.content.len());
        for id in &self.content {
            if let Some(block) = registry.blocks.get(id) {
                blocks.push(block);
            }
        }
        blocks
    }

    pub fn child_pos(&self, block_id: &InternalId) -> Option<usize> {
        self.content.iter().position(|child| block_id.eq(child))
    }
}

pub struct Registry {
    pub documents: HashMap<InternalId, Document>,
    pub blocks: HashMap<InternalId, Block>,
}

impl Registry {
    pub fn new() -> Self {
        Self {
            documents: Default::default(),
            blocks: Default::default(),
        }
    }

    pub fn add_document(&mut self, document: Document) {
        self.documents.insert(document.id.clone(), document);
    }

    pub fn add_block(&mut self, block: Block) {
        self.blocks.insert(block.id.clone(), block);
    }

    pub fn get_document(&self, id: &InternalId) -> Option<&Document> {
        self.documents.get(id)
    }

    pub fn all_documents(&self) -> Values<InternalId, Document> {
        self.documents.values()
    }

    pub fn get_block(&self, id: &InternalId) -> Option<&Block> {
        self.blocks.get(id)
    }

    pub fn get_block_mut(&mut self, id: &InternalId) -> Option<&mut Block> {
        self.blocks.get_mut(id)
    }
}
