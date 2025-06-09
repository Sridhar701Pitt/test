use wasm_bindgen::prelude::*;

/// A minimal clicker game exported to WebAssembly.
#[wasm_bindgen]
pub struct Game {
    score: u32,
}

#[wasm_bindgen]
impl Game {
    /// Create a new game instance with score set to zero.
    #[wasm_bindgen(constructor)]
    pub fn new() -> Game {
        Game { score: 0 }
    }

    /// Increment the game score and return the new value.
    pub fn click(&mut self) -> u32 {
        self.score += 1;
        self.score
    }

    /// Reset the game score back to zero.
    pub fn reset(&mut self) {
        self.score = 0;
    }
}
