use rand::distributions::Alphanumeric;
use rand::rngs::SmallRng;
use rand::{Rng, SeedableRng};

/// Generates a random ID.
pub fn randid() -> String {
    let rng = SmallRng::from_entropy();
    rng.sample_iter(&Alphanumeric)
        .take(10)
        .map(char::from)
        .collect()
}
