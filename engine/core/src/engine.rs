use std::collections::hash_map::Values;
use std::collections::HashMap;

use crate::rand::randid;

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
    _dirty: bool,
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
    _dirty: bool,
}

pub struct Engine {
    pub registry: Registry,
}

impl Engine {
    pub fn init() -> Self {
        let mut registry = Registry::new();

        let doc_id = randid();
        let mut doc_content = Vec::new();
        for i in 0..100 {
            let id = randid();
            if i % 10 == 0 {
                doc_content.push(id.clone());
            }

            let ty = "test".to_owned();
            let mut properties = HashMap::default();
            properties.insert("text".to_owned(), toml::Value::String(format!("Hi {}", id)));
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

        Engine { registry }
    }
}

impl Engine {
    /// Safely edit a block and its parent.
    pub fn edit_block_and_parent<F>(&mut self, id: &InternalId, f: F) -> bool
    where
        F: FnOnce(&mut Block, Option<&mut Document>) -> (bool, bool),
    {
        match self.registry.blocks.get_mut(id) {
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
    pub fn reparent_block<F>(
        &mut self,
        block_id: &InternalId,
        new_parent: Option<&InternalId>,
        f: F,
    ) where
        F: FnOnce(&Document) -> Option<usize>,
    {
        let block = match self.registry.blocks.get_mut(block_id) {
            Some(block) => block,
            None => return,
        };
        let parent = block
            ._parent
            .as_ref()
            .and_then(|doc_id| self.registry.documents.get_mut(doc_id));
        if let Some(parent) = parent {
            let index = parent.content.iter().position(|child| block.id.eq(child));
            if let Some(index) = index {
                parent.content.remove(index);
                parent._dirty = true;
            }
        }
        let new_parent = new_parent.and_then(|doc_id| self.registry.documents.get_mut(doc_id));
        block._parent = new_parent.as_ref().map(|doc| doc.id.clone());
        block._dirty = true;
        if let Some(new_parent) = new_parent {
            let index = f(new_parent).filter(|&index| index < new_parent.content.len());
            match index {
                Some(index) => new_parent.content.insert(index, block_id.clone()),
                None => new_parent.content.push(block_id.clone()),
            }
            new_parent._dirty = true;
        }
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
}

pub struct Registry {
    documents: HashMap<InternalId, Document>,
    blocks: HashMap<InternalId, Block>,
}

impl Registry {
    pub fn new() -> Self {
        Self {
            documents: Default::default(),
            blocks: Default::default(),
        }
    }

    fn add_document(&mut self, document: Document) {
        self.documents.insert(document.id.clone(), document);
    }

    fn add_block(&mut self, block: Block) {
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
