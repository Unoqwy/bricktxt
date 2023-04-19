import { BackendView } from "bricktxt-core";

import { createContext, useContext } from "react";

export const ActiveViewContext = createContext<BackendView | undefined>(
  undefined
);

export default function useActiveView(): BackendView {
  const view = useContext(ActiveViewContext);
  if (view === undefined) {
    throw new Error(
      "Illegal state: useActiveView needs a ActiveViewContext.Provider in tree"
    );
  }
  return view;
}

export interface ActiveViewOverlay {
  setFloatingNode(node: React.ReactNode): void;
}

export const ActiveViewOverlayContext = createContext<
  ActiveViewOverlay | undefined
>(undefined);

export function useActiveViewOverlay(): ActiveViewOverlay {
  const viewOverlay = useContext(ActiveViewOverlayContext);
  if (viewOverlay === undefined) {
    throw new Error(
      "Illegal state: useActiveViewOverlay needs a ActiveViewOverlayContext.Provider in tree"
    );
  }
  return viewOverlay;
}
