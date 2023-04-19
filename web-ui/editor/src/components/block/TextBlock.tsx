import styles from "./TextBlock.module.css";
import { useEffect, useRef } from "react";
import ContentEditable from "react-contenteditable";
import useActiveView, { useActiveViewOverlay } from "~/hooks/useActiveView";
import SlashActions from "./SlashActions";

export interface TextBlockProps {
  blockId: string;
  text: string;
}

function focusEnd(el: HTMLElement) {
  const textNode = document.createTextNode("");
  el.appendChild(textNode);
  if (textNode !== null && textNode.nodeValue !== null) {
    const selection = window.getSelection();
    if (selection !== null) {
      const range = document.createRange();
      range.setStart(textNode, textNode.nodeValue.length);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  // even if text node creation failed, still focus but it will be at the front
  el.focus();
}

export default function TextBlock(props: TextBlockProps) {
  const content = useRef(props.text);
  const contentInnerRef = useRef<HTMLDivElement>(null);

  const view = useActiveView();
  const overlay = useActiveViewOverlay();
  useEffect(() => {
    if (
      contentInnerRef.current &&
      view.attemptConsumePendingFocus(props.blockId)
    ) {
      focusEnd(contentInnerRef.current);
    }
  });

  return (
    <>
      <ContentEditable
        className={styles.content}
        data-empty-placeholder="Press '/' for commands"
        innerRef={contentInnerRef}
        html={content.current}
        onChange={(event) => {
          content.current = event.target.value;
          view.cmd.updateBlockProperty(props.blockId, "text", content.current);
        }}
        onBlur={() => overlay.setFloatingNode(undefined)}
        onKeyDown={(event) => {
          if (event.key === "/") {
            if (event.ctrlKey) {
              event.preventDefault();
            }
            if (contentInnerRef.current) {
              const selection = document.getSelection();
              const range = selection?.getRangeAt(0);
              if (range === undefined) {
                return;
              }
              const carretX = range.getBoundingClientRect().x;
              const elRect = contentInnerRef.current.getBoundingClientRect();
              overlay.setFloatingNode(
                <SlashActions
                  posX={carretX > 0 ? carretX : elRect.x}
                  posY={elRect.y + elRect.height}
                />
              );
            }
          } else if (event.key === "Enter") {
            event.preventDefault();
            view.cmd.createBlock(
              "default",
              {
                rel_block_id: props.blockId,
                position: "Bottom",
              },
              true
            );
            overlay.setFloatingNode(undefined);
          } else if (
            event.key === "Backspace" &&
            content.current.length === 0
          ) {
            event.preventDefault();
            view.cmd.deleteBlock(props.blockId, true);
            overlay.setFloatingNode(undefined);
          }
        }}
      />
    </>
  );
}
