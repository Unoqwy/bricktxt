install:
	pnpm install

build-wasm:
	cd engine/web-wasm && wasm-pack build
	pnpm install --filter bricktxt-web-wasm
