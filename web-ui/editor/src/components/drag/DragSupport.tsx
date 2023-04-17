import { useEffect, useState } from "react";
import {
  DragContainerContext,
  DragContainerOptions,
  DragElement,
  DragElementSupplier,
} from "~/context/DragContainerProvider";
import { Border, useDragMutationStore } from "~/store/drag-mutation";
import useActiveView from "~/hooks/useActiveView";

interface DragState {
  element: DragElement;
  pageRoot: HTMLDivElement;
}

export interface DragSupportProps {
  children: React.ReactNode;
}

export default function DragSupport(props: DragSupportProps) {
  const [dragState, setDragState] = useState<DragState | undefined>(undefined);
  const { mutation, setMutation } = useDragMutationStore();

  const view = useActiveView();

  useEffect(() => {
    return () => {
      setMutation(undefined);
    };
  }, []);

  function handleDragStart(
    event: React.DragEvent<HTMLDivElement>,
    elementSupplier?: DragElementSupplier<HTMLDivElement>
  ) {
    const pageRoot = (event.target as HTMLDivElement).closest<HTMLDivElement>(
      "div[data-doc-root]"
    );
    if (!pageRoot) {
      event.preventDefault();
      return;
    }
    const element = elementSupplier?.(event);
    const sourceId = element?.id;
    if (!sourceId) {
      event.preventDefault();
      return;
    }
    if (element.displayElement) {
      event.dataTransfer.setDragImage(element.displayElement, 0, 0);
    }
    setDragState({
      element,
      pageRoot,
    });
  }

  function handleDragUpdate(event: React.DragEvent<HTMLDivElement>) {
    if (!dragState) {
      return;
    }
    const blocks = dragState.pageRoot.querySelectorAll("div[data-block-id]");
    if (!blocks) {
      return;
    }
    const posX = event.pageX,
      posY = event.pageY;
    if (posX === 0 && posY === 0) {
      return;
    }
    const points = [];
    for (var i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const rect = block.getBoundingClientRect();
      points.push({
        x: rect.right - rect.width / 2,
        y: rect.top,
        border: Border.Top,
        block,
      });
      points.push({
        x: rect.right - rect.width / 2,
        y: rect.bottom,
        border: Border.Bottom,
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
      sourceId: dragState.element.id,
      targetId,
      targetBorder: curNearest.border,
    });
  }

  function handleDragEnd() {
    setMutation(undefined);
    if (
      mutation === undefined ||
      (mutation.targetBorder !== Border.Top &&
        mutation.targetBorder !== Border.Bottom)
    ) {
      return;
    }
    view.cmd.repositionBlock(mutation.sourceId, {
      rel_block_id: mutation.targetId,
      position: mutation.targetBorder === Border.Top ? "Top" : "Bottom",
    });
  }

  const dragOptions: DragContainerOptions<HTMLDivElement> = {
    onDragStart: handleDragStart,
    onDragUpdate: handleDragUpdate,
    onDragEnd: handleDragEnd,
  };
  return (
    <DragContainerContext.Provider value={dragOptions}>
      {props.children}
    </DragContainerContext.Provider>
  );
}
