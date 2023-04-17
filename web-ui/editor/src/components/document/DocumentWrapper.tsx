import { BackendView } from "bricktxt-core";
import DragSupport from "~/components/drag/DragSupport";
import { ActiveViewContext } from "~/hooks/useActiveView";
import { useSyncExternalStore } from "react";
import DocumentBody from "./DocumentBody";

export interface DocumentWrapperProps {
  backendView: BackendView;
}

export default function DocumentWrapper({ backendView }: DocumentWrapperProps) {
  const document = useSyncExternalStore(...backendView.asReactStore());
  return (
    <ActiveViewContext.Provider value={backendView}>
      <DragSupport>
        <div data-doc-root>
          <DocumentBody document={document} />
        </div>
      </DragSupport>
    </ActiveViewContext.Provider>
  );
}
