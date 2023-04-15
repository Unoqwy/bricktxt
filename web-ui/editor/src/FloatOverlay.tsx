import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface OverlayPortalProps {
  onOutsideClick: () => void;
  children: React.ReactNode;
}

const OverlayPortal = (props: OverlayPortalProps) => {
  return createPortal(
    <div>
      <div
        className="fixed top-0 bottom-0 left-0 right-0 z-40"
        onClick={props.onOutsideClick}
      ></div>
      {props.children}
    </div>,
    document.getElementById("root")!
  );
};

interface OverlayOptions {
  halfCover?: boolean;
}

export interface FloatOverlayProps extends OverlayOptions {
  relTo: HTMLDivElement | null;
  close: () => void;
  children: React.ReactNode;
}

export default function FloatOverlay(props: FloatOverlayProps) {
  const [position, setPosition] = useState<React.CSSProperties>(() => ({
    top: "500vh",
  }));
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current || !props.relTo) {
      setPosition({
        top: "500vh",
      });
      return;
    }
    const onResize = () => {
      setPosition(calcPosition(containerRef.current!, props.relTo!, props));
    };
    onResize();
    window.addEventListener("resize", onResize);
    let resizeObserver: ResizeObserver;
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      window.removeEventListener("resize", onResize);
      resizeObserver?.disconnect();
    };
  }, [containerRef, props.relTo]);
  return (
    <OverlayPortal onOutsideClick={() => props.close()}>
      <div ref={containerRef} className="fixed" style={position}>
        {props.children}
      </div>
    </OverlayPortal>
  );
}

function calcPosition(
  container: HTMLDivElement,
  relTo: HTMLDivElement,
  opts: OverlayOptions
): React.CSSProperties {
  const winHeight = document.body.clientHeight;
  const winWidth = document.body.clientWidth;
  const relBounds = relTo.getBoundingClientRect();
  const bounds = container.getBoundingClientRect();

  const right = bounds.width < winWidth - relBounds.right;
  const startX = right ? relBounds.left : relBounds.right - bounds.width;

  const halfCoverY = opts.halfCover ? relBounds.height / 2 : 0;
  const down = bounds.height + halfCoverY < winHeight - relBounds.bottom;
  const startY = down
    ? relBounds.bottom - halfCoverY
    : relBounds.top + halfCoverY - bounds.height;

  const x = Math.max(0, Math.min(winWidth - bounds.width, startX));
  const y = Math.max(0, startY);
  return {
    top: `${y}px`,
    left: `${x}px`,
  };
}
