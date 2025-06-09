# Rust WebAssembly Clicker Game

This repository contains a minimal clicker game written in Rust and compiled to WebAssembly.

## Building

1. Install the WebAssembly target and `wasm-bindgen-cli`:

```sh
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli
```

2. Build the project and generate JS bindings:

```sh
cargo build --release --target wasm32-unknown-unknown
wasm-bindgen --target web --out-dir web target/wasm32-unknown-unknown/release/game.wasm
```

3. Open `web/index.html` in a browser to play the game.

## Windows instructions

These commands work from PowerShell or the Command Prompt after installing
Rust with [rustup](https://rustup.rs/):

```powershell
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli

cargo build --release --target wasm32-unknown-unknown
wasm-bindgen --target web --out-dir web target\wasm32-unknown-unknown\release\game.wasm
```

You can open `web\index.html` directly in your browser or serve the `web`
directory with a static file server such as:

```powershell
python -m http.server -d web
```

Then browse to `http://localhost:8000/`.
