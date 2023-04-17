import { Backend } from "bricktxt-backend-api";
import { BackendView } from "./view";

export class BackendWrapper {
  static readonly get = new BackendWrapper();

  private _instance: Backend | undefined;

  private views: Map<number, BackendView>;

  private constructor() {
    this._instance = undefined;
    this.views = new Map();
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

  public createView(initialDocId: string): BackendView {
    const view_id = this.instance.view_create(initialDocId);
    const view = new BackendView(this, view_id);
    this.views.set(view.id, view);
    return view;
  }

  /**
   * Processes an event coming from the backend.
   *
   * @param name Event name.
   * @param payload Event payload.
   */
  public handleEvent(name: string, payload: any) {
    switch (name) {
      case "update_views":
        const viewIds = payload as number[];
        for (const viewId of viewIds) {
          this.views.get(viewId)?.handleUpdate();
        }
        break;
      case "delete_view":
        const viewId = payload as number;
        const view = this.views.get(viewId);
        view?.markAsDeleted();
        this.views.delete(viewId);
        break;
    }
  }
}
