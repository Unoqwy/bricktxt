import { BackendView } from "bricktxt-core";
import DragSupport from "~/components/drag/DragSupport";
import {
  ActiveViewContext,
  ActiveViewOverlayContext,
} from "~/hooks/useActiveView";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import DocumentBody from "./DocumentBody";
import { createPortal } from "react-dom";

export interface DocumentWrapperProps {
  backendView: BackendView;
}

export default function DocumentWrapper(props: DocumentWrapperProps) {
  const document = useSyncExternalStore(...props.backendView.asReactStore());

  return (
    <ActiveViewContext.Provider value={props.backendView}>
      <ViewOverlay>
        <DragSupport>
          <div data-doc-root>
            <DocumentBody document={document} />
          </div>
        </DragSupport>
      </ViewOverlay>
    </ActiveViewContext.Provider>
  );
}

interface ViewOverlayProps {
  children: React.ReactNode;
}

function ViewOverlay(props: ViewOverlayProps) {
  const [floatingNode, setFloatingNode] = useState<React.ReactNode>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setFloatingNode(undefined);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [ref]);

  return (
    <ActiveViewOverlayContext.Provider
      value={{
        setFloatingNode: (node) => setFloatingNode(node),
      }}
    >
      {props.children}
      {floatingNode &&
        createPortal(
          <div
            ref={ref}
            className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none"
          >
            <div className="z-40 pointer-events-auto">{floatingNode}</div>
          </div>,
          document.getElementById("root")!
        )}
    </ActiveViewOverlayContext.Provider>
  );
}
