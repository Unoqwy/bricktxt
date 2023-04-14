install:
	pnpm install

build-web:
	cd engine/web-wasm && wasm-pack build
