import { useState } from "react";
import Block from "./Block";
import DragSupport from "./DragSupport";

export default function Document() {
  const [blocks, setBlocks] = useState(() => [
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
  ]);

  return (
    <div data-doc-root>
      <DragSupport>
        {blocks.map((blockId) => (
          <Block key={blockId} id={blockId}>
            Hello {blockId}
          </Block>
        ))}
      </DragSupport>
    </div>
  );
}
