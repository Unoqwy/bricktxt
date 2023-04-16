import { Backend, BlockPlacement } from "bricktxt-backend-api";

class BackendWrapper {
  /**
   * Access wrapper methods around backend commands, that
   * follow Javascript naming conventions.
   */
  public readonly cmd: BackendWrapperCommands;

  private _instance: Backend | undefined;

  public constructor() {
    this.cmd = new BackendWrapperCommands(this);
    this._instance = undefined;
  }

  public init(instance: Backend) {
    if (this._instance !== undefined) {
      throw new Error(
        "Illegal state: Attempting to initialize the backend a second time!"
      );
    }
    this._instance = instance;
  }

  /**
   * Get the actual {@link Backend} intance.
   * If the backend was not initialized yet, this will throw an error.
   */
  public get instance(): Backend {
    if (this._instance === undefined) {
      throw new Error(
        "Illegal state: Attempting to get backend but it wasn't initialized"
      );
    }
    return this._instance;
  }
}

class BackendWrapperCommands {
  private backend: BackendWrapper;

  public constructor(backend: BackendWrapper) {
    this.backend = backend;
  }

  public createBlock(type: string, placement: BlockPlacement) {
    this.backend.instance.cmd_block_create({
      type,
      placement,
    });
  }

  public deleteBlock(id: string) {
    this.backend.instance.cmd_block_delete({
      block_id: id,
    });
  }

  public repositionBlock(id: string, placement: BlockPlacement) {
    this.backend.instance.cmd_block_reposition({
      block_id: id,
      placement,
    });
  }

  public updateBlockProperty(id: string, property: string, value: any) {
    this.backend.instance.cmd_block_update_property({
      block_id: id,
      property,
      value,
    });
  }
}

const backend = new BackendWrapper();

export default backend;
