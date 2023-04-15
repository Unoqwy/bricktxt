import { Block } from "~/store/document";

import { init } from "bricktxt-web-wasm";

var instance: Backend | undefined;

export interface Backend {
  get_content(): Block[];
}

export function initWebBackend() {
  instance = init();
}

export default function backend(): Backend {
  if (instance === undefined) {
    throw new Error(
      "Illegal state: Attempting to get backend but it wasn't initialized"
    );
  }
  return instance;
}
