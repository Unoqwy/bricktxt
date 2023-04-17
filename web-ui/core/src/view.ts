import { Document, BlockPlacement } from "bricktxt-backend-api";
import { BackendWrapper } from "./backend";

/**
 * A wrapper around a view ID that controls a backend view.
 */
export class BackendView {
  /**
   * Backend instance. Should be the same as {@link BackendWrapper.get}.
   */
  public readonly backend: BackendWrapper;
  /**
   * Wrapper around backend commands.
   */
  public readonly cmd: Commands;

  private _id: number;
  private reactStore: ReactStoreCompat;

  private pendingFocus: string | undefined;
  private _cachedContent: Document | undefined;

  public constructor(backend: BackendWrapper, viewId: number) {
    this.backend = backend;
    this.cmd = new Commands(backend, viewId);
    this._id = viewId;
    this.reactStore = new ReactStoreCompat();
  }

  public get id() {
    if (this._id === -1) {
      throw new Error("Illegal state: Attempting to use a deleted view");
    }
    return this._id;
  }

  public getContent(): Document {
    return this.backend.instance.view_get_content(this.id);
  }

  public getCachedContent(): Document {
    if (this._cachedContent === undefined) {
      this._cachedContent = this.getContent();
    }
    return this._cachedContent;
  }

  public handleUpdate() {
    this._cachedContent = undefined;
    this.reactStore.publishChange();
  }

  public handleFocusRequest(blockId: string) {
    this.pendingFocus = blockId;
  }

  public attemptConsumePendingFocus(blockId: string): boolean {
    if (this.pendingFocus === blockId) {
      this.pendingFocus = undefined;
      return true;
    }
    return false;
  }

  /**
   * Requests view deletion.
   */
  public free() {
    this.backend.instance.view_free(this.id);
  }

  public markAsDeleted() {
    this._id = -1;
  }

  /**
   * React store binding arguments to be used with `useSyncExternalStore`.
   */
  public asReactStore(): [StoreSubscribe, StoreGetSnapshot<Document>] {
    return [
      this.reactStore.subscribe.bind(this.reactStore),
      this.getCachedContent.bind(this),
    ];
  }
}

type StoreSubscribe = (onStoreChange: SubscriptionCallback) => () => void;
type StoreGetSnapshot<T> = () => T;
type SubscriptionCallback = () => void;

class ReactStoreCompat {
  private storeIdCounter: number = 0;
  private storeSubscribers: Map<number, SubscriptionCallback> = new Map();

  public subscribe(onStoreChange: SubscriptionCallback): () => void {
    const id = ++this.storeIdCounter;
    this.storeSubscribers.set(id, onStoreChange);
    return () => {
      this.storeSubscribers.delete(id);
    };
  }

  public publishChange() {
    for (const subscriber of this.storeSubscribers.values()) {
      subscriber();
    }
  }
}

class Commands {
  private backend: BackendWrapper;
  private viewId: number;

  public constructor(backend: BackendWrapper, viewId: number) {
    this.backend = backend;
    this.viewId = viewId;
  }

  /**
   * Creates a new block.
   *
   * @param type Block type.
   * @param placement Placement strategy to position the block.
   * @param controlFocus Whether the newly created block should be focused.
   */
  public createBlock(
    type: string,
    placement: BlockPlacement,
    controlFocus: boolean
  ) {
    this.backend.instance.cmd_block_create({
      type,
      placement,
      control_focus: controlFocus ? this.viewId : undefined,
    });
  }

  /**
   * Deletes a block.
   *
   * @param id ID of the block to delete.
   * @param controlFocus Whether focus should be moved to a near block after deletion.
   */
  public deleteBlock(id: string, controlFocus: boolean) {
    this.backend.instance.cmd_block_delete({
      block_id: id,
      control_focus: controlFocus ? this.viewId : undefined,
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
