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
