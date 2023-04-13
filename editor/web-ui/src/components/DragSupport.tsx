import { useEffect } from "react";
import DragContainerProvider from "../context/DragContainerProvider";
import { useDragMutationStore } from "../store/drag-mutation";

export interface DragSupportProps {
  children: React.ReactNode;
}

export default function DragSupport(props: DragSupportProps) {
  const { mutation, setMutation } = useDragMutationStore();

  useEffect(() => {
    document.addEventListener("dragover", handleGlobalDragOver);
    return () => {
      document.removeEventListener("dragover", handleGlobalDragOver);
      setMutation(undefined);
    };
  }, []);

  function handleDragStart(event: React.DragEvent<HTMLDivElement>) {
    const pageRoot = (event.target as HTMLDivElement).closest(
      "div[data-doc-root]"
    );
    if (!pageRoot) {
      event.preventDefault();
    }
  }

  function handleDragUpdate(event: React.DragEvent<HTMLDivElement>) {
    const target = event.target as HTMLDivElement;
    const sourceId = target.getAttribute("data-block-id");
    if (sourceId == null) {
      return;
    }
    const pageRoot = target.closest("div[data-doc-root]");
    if (!pageRoot) {
      return;
    }
    const blocks = pageRoot.querySelectorAll("div[data-block-id]");
    if (!blocks) {
      return;
    }
    const posX = event.pageX,
      posY = event.pageY;
    var curDist = -1,
      curNearest;
    for (var i = 0; i < blocks.length; i++) {
      const rect = blocks[i].getBoundingClientRect();
      const distToBottom = Math.abs(posY - rect.bottom);
      if (curDist === -1 || distToBottom < curDist) {
        curNearest = blocks[i];
        curDist = distToBottom;
      }
    }
    if (!curNearest) {
      return;
    }
    const targetId = curNearest.getAttribute("data-block-id")!;
    setMutation({
      sourceId,
      targetId,
      targetCorner: "bottom",
    });
  }

  function handleDragEnd() {
    console.log(mutation);
    setMutation(undefined);
  }

  return (
    <DragContainerProvider
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
      onDragEnd={handleDragEnd}
    >
      {props.children}
    </DragContainerProvider>
  );
}

// hack to avoid getting a (0,0) reset DragUpdate just before end
function handleGlobalDragOver(event: DragEvent) {
  event?.preventDefault();
}
