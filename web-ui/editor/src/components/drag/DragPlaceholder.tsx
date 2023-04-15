import { CSSProperties } from "react";
import { Border, BorderId, useDragMutationStore } from "~/store/drag-mutation";

export interface DragPlaceholderProps {
  blockId: string;
}

export function DragPlaceholder(props: DragPlaceholderProps) {
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

function getRectStyle(border: BorderId): CSSProperties {
  switch (border) {
    case Border.Top:
      return {
        width: "100%",
        height: "3px",
        top: "-2px",
      };
    case Border.Bottom:
      return {
        width: "100%",
        height: "3px",
        bottom: "-2px",
      };
    case Border.Left:
      return {
        height: "100%",
        width: "3px",
        left: "-2px",
      };
    case Border.Right:
      return {
        height: "100%",
        width: "3px",
        right: "-2px",
      };
  }
  throw new Error("Illegal argument: 'border' is an unknown ID");
}
