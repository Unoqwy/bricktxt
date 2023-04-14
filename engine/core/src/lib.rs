use rand::distributions::Alphanumeric;
use rand::rngs::SmallRng;
use rand::{Rng, SeedableRng};
use serde::{Deserialize, Serialize};

fn randid() -> String {
    let rng = SmallRng::from_entropy();
    rng.sample_iter(&Alphanumeric)
        .take(10)
        .map(char::from)
        .collect()
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Block {
    id: String,
    ty: String,
    text: String,
}

impl Block {
    fn new(text: &str) -> Self {
        Self {
            id: randid(),
            ty: "test".to_owned(),
            text: text.to_owned(),
        }
    }
}

pub fn random_doc() -> Vec<Block> {
    vec![
        Block::new("Hello"),
        Block::new("Second Value"),
        Block::new("Lorem"),
        Block::new("Ipsum"),
        Block::new("Another block"),
    ]
}
