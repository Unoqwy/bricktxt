import { Block } from "~/store/document";

import { init } from "bricktxt-web-wasm";

interface RepositionCommand {
  source_id: string;
  target_id: string;
  position: string;
}

interface UpdateBlockPropertyCommand {
  block_id: string;
  property: string;
  value: any;
}

export interface Backend {
  get_content(): Block[];

  cmd_reposition(command: RepositionCommand): void;

  cmd_update_block_property(command: UpdateBlockPropertyCommand): void;
}

export class BackendWrapper {
  private _instance: Backend | undefined;

  public init() {
    if (this._instance !== undefined) {
      return;
    }
    this._instance = init();
  }

  public get instance(): Backend {
    if (this._instance === undefined) {
      throw new Error(
        "Illegal state: Attempting to get backend but it wasn't initialized"
      );
    }
    return this._instance;
  }

  public updateBlockProperty(id: string, property: string, value: any) {
    this.instance.cmd_update_block_property({
      block_id: id,
      property,
      value,
    });
  }
}

const backend: BackendWrapper = new BackendWrapper();

export default backend;
