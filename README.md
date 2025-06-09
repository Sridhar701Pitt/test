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

3. Serve the `web` directory with a local HTTP server and open the page in your
   browser. One simple option is Python's built in server:

   ```sh
   python -m http.server -d web
   ```

   Then browse to `http://localhost:8000/`.

## Windows instructions

These commands work from PowerShell or the Command Prompt after installing
Rust with [rustup](https://rustup.rs/):

```powershell
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli

cargo build --release --target wasm32-unknown-unknown
wasm-bindgen --target web --out-dir web target\wasm32-unknown-unknown\release\game.wasm
```

Serve the `web` directory with a static file server after building. For
example, using Python's built in server:

```powershell
python -m http.server -d web
```

Then browse to `http://localhost:8000/`.
