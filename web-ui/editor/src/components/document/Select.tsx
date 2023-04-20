import { useEffect, useState } from "react";

export interface SelectProps {
  setSelected(selected: string[]): void;
}

export function Select(props: SelectProps) {
  const [selectRect, setSelectRect] = useState<DOMRect | undefined>(undefined);

  useEffect(() => {
    let selectRoot: HTMLDivElement | null;
    let startPoint: { x: number; y: number } | undefined;

    function handleMouseDown(event: MouseEvent) {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }
      props.setSelected([]);
      const blockRoot =
        event.target.closest<HTMLDivElement>("div[data-block-id]");
      if (blockRoot !== null) {
        return;
      }
      selectRoot = event.target.closest<HTMLDivElement>(
        "div[data-select-root]"
      );
      if (!selectRoot) {
        return;
      }

      event.preventDefault();
      window.getSelection()?.removeAllRanges();
      startPoint = { x: event.pageX, y: event.pageY };
      console.log(startPoint);
    }

    function handleMouseMove(event: MouseEvent) {
      if (!selectRoot || !startPoint) {
        return;
      }

      const rect = new DOMRect(
        Math.min(startPoint.x, event.pageX),
        Math.min(startPoint.y, event.pageY),
        Math.abs(startPoint.x - event.pageX),
        Math.abs(startPoint.y - event.pageY)
      );
      setSelectRect(rect);

      const blocks = selectRoot.querySelectorAll("div[data-block-id]");
      if (!blocks) {
        return;
      }
      const selected = [];
      for (const block of blocks) {
        if (intersectRect(rect, block.getBoundingClientRect())) {
          selected.push(block.getAttribute("data-block-id")!);
        }
      }
      props.setSelected(selected);
    }

    function handleMouseUp(_event: MouseEvent) {
      if (!selectRoot) {
        return;
      }
      selectRoot = null;
      startPoint = undefined;
      setSelectRect(undefined);
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      props.setSelected([]);
    };
  }, []);

  if (selectRect === undefined) {
    return null;
  }

  return (
    <div
      className="absolute z-50 pointer-events-none bg-blue-600 border-blue-600/5 border bg-opacity-10"
      style={{
        top: selectRect.top,
        left: selectRect.left,
        width: selectRect.width,
        height: selectRect.height,
      }}
    ></div>
  );
}

function intersectRect(a: DOMRect, b: DOMRect) {
  return !(
    b.left > a.right ||
    b.right < a.left ||
    b.top > a.bottom ||
    b.bottom < a.top
  );
}
