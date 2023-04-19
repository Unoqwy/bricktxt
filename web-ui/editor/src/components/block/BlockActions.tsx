import {
  DragElement,
  useDraggableProps,
} from "~/context/DragContainerProvider";

import styles from "./BlockActions.module.css";
import classNames from "classnames";
import { useRef } from "react";

export interface BlockActionsProps {
  blockId: string;
  contentRef: React.RefObject<HTMLDivElement>;
}

export function BlockActions(props: BlockActionsProps) {
  const { onDragStart, onDragEnd, ...dragProps } = useDraggableProps(() => {
    return {
      id: props.blockId,
      displayElement: props.contentRef.current,
    } as DragElement;
  });
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      className={classNames(
        styles.block_actions,
        "mt-0.5 flex justify-end items-center"
      )}
    >
      <button className="text-slate-500 hover:text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
        >
          <path
            d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"
            fill="currentColor"
          ></path>
        </svg>
      </button>
      <button
        className="text-slate-500 hover:text-black"
        draggable={true}
        onDragStart={(event) => {
          onDragStart?.(event);
          containerRef.current!.classList.add("opacity-0");
        }}
        onDragEnd={(event) => {
          onDragEnd?.(event);
        }}
        {...dragProps}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="22"
          height="22"
        >
          <path
            d="M12 2L16.2426 6.24264L14.8284 7.65685L12 4.82843L9.17157 7.65685L7.75736 6.24264L12 2ZM2 12L6.24264 7.75736L7.65685 9.17157L4.82843 12L7.65685 14.8284L6.24264 16.2426L2 12ZM22 12L17.7574 16.2426L16.3431 14.8284L19.1716 12L16.3431 9.17157L17.7574 7.75736L22 12ZM12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14ZM12 22L7.75736 17.7574L9.17157 16.3431L12 19.1716L14.8284 16.3431L16.2426 17.7574L12 22Z"
            fill="currentColor"
          ></path>
        </svg>
      </button>
    </div>
  );
}
