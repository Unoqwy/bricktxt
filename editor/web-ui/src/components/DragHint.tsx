import { CSSProperties } from "react";
import { BorderName, useDragMutationStore } from "../store/drag-mutation";

export interface DragHintProps {
  blockId: string;
}

export function DragHint(props: DragHintProps) {
  const { mutation } = useDragMutationStore();

  if (mutation?.targetId !== props.blockId) {
    return null;
  }

  return (
    <div
      data-drag-placeholder
      style={{
        position: "absolute",
        backgroundColor: "rgba(0, 50, 120, 0.4)",
        ...getRectStyle(mutation.targetBorder),
      }}
    ></div>
  );
}

function getRectStyle(border: BorderName): CSSProperties {
  switch (border) {
    case "top":
      return {
        width: "100%",
        height: "3px",
        top: "-2px",
      };
    case "bottom":
      return {
        width: "100%",
        height: "3px",
        bottom: "-2px",
      };
    case "left":
      return {
        height: "100%",
        width: "3px",
        left: "-2px",
      };
    case "right":
      return {
        height: "100%",
        width: "3px",
        right: "-2px",
      };
  }
}
