install:
	pnpm install

build-wasm:
	cd engine/web-wasm && wasm-pack build
