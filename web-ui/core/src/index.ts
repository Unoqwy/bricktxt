import { BackendWrapper } from "./backend";
import { BackendView } from "./view";

/**
 * Fowards an event to the {@link BackendWrapper} instance.
 * Used to bind with WASM.
 *
 * @param name Event name.
 * @param payload Event payload.
 */
export function recv_event(name: string, payload: any) {
  BackendWrapper.get.handleEvent(name, payload);
}

export { BackendWrapper, BackendView };
