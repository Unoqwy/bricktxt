import FloatOverlay from "~/FloatOverlay";
import styles from "./TextBlock.module.css";
import { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import useActiveView from "~/hooks/useActiveView";

export interface TextBlockProps {
  blockId: string;
  text: string;
}

export default function TextBlock(props: TextBlockProps) {
  const content = useRef(props.text);
  const contentInnerRef = useRef<HTMLDivElement>(null);

  const [slashActions, setSlashActions] = useState(false);
  const view = useActiveView();

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
        onKeyDown={(event) => {
          if (event.key === "/") {
            event.preventDefault();
            setSlashActions(true);
          } else if (event.key === "Enter") {
            event.preventDefault();
            view.cmd.createBlock("default", {
              rel_block_id: props.blockId,
              position: "Bottom",
            });
          } else if (
            event.key === "Backspace" &&
            content.current.length === 0
          ) {
            event.preventDefault();
            view.cmd.deleteBlock(props.blockId);
          }
        }}
      />
      {slashActions && (
        <FloatOverlay
          relTo={contentInnerRef.current}
          close={() => setSlashActions(false)}
        >
          <div className="bg-neutral-200 p-1 rounded-sm flex flex-col gap-1">
            <button className="bg-neutral-100 px-2 py-1">Action</button>
            <button className="bg-neutral-100 px-2 py-1">Test</button>
          </div>
        </FloatOverlay>
      )}
    </>
  );
}
