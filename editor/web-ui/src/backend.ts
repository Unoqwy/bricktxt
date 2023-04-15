import { Block } from "~/store/document";

import { init } from "bricktxt-web-wasm";

interface RepositionCommand {
  source_id: string;
  target_id: string;
  position: string;
}

var instance: Backend | undefined;

export interface Backend {
  get_content(): Block[];

  cmd_reposition(command: RepositionCommand): void;
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
