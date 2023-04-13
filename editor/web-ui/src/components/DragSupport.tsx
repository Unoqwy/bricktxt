import { useEffect } from "react";
import DragContainerProvider from "../context/DragContainerProvider";
import { BorderName, useDragMutationStore } from "../store/drag-mutation";

type BorderId = 1 | 2 | 3 | 4;

const BORDER_TOP: BorderId = 1;
const BORDER_BOTTOM: BorderId = 2;
const BORDER_LEFT: BorderId = 3;
const BORDER_RIGHT: BorderId = 4;

function convertBorder(id: BorderId): BorderName {
  switch (id) {
    case BORDER_TOP:
      return "top";
    case BORDER_BOTTOM:
      return "bottom";
    case BORDER_LEFT:
      return "left";
    case BORDER_RIGHT:
      return "right";
  }
  throw new Error("Illegal argument: unexpected border ID");
}

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
    const points = [];
    for (var i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const rect = block.getBoundingClientRect();
      points.push({
        x: rect.right - rect.width / 2,
        y: rect.top,
        border: BORDER_TOP,
        block,
      });
      points.push({
        x: rect.right - rect.width / 2,
        y: rect.bottom,
        border: BORDER_BOTTOM,
        block,
      });
    }
    var curDist = -1,
      curNearest;
    for (var i = 0; i < points.length; i++) {
      const point = points[i];
      const dist = Math.abs(posX - point.x) + Math.abs(posY - point.y);
      if (curDist === -1 || dist < curDist) {
        curNearest = point;
        curDist = dist;
      }
    }
    if (!curNearest) {
      return;
    }
    const targetId = curNearest.block.getAttribute("data-block-id")!;
    setMutation({
      sourceId,
      targetId,
      targetBorder: convertBorder(curNearest.border),
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
