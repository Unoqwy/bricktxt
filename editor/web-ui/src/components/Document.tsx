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
    "9th",
    "10th",
  ]);

  return (
    <div data-doc-root>
      <DragSupport>
        <div className="w-1/2 grid grid-cols-2">
          <div>
            {blocks.slice(0, 5).map((blockId) => (
              <Block key={blockId} id={blockId}>
                Hello {blockId}
              </Block>
            ))}
          </div>
          <div>
            {blocks.slice(5).map((blockId) => (
              <Block key={blockId} id={blockId}>
                Hello {blockId}
              </Block>
            ))}
          </div>
        </div>
      </DragSupport>
    </div>
  );
}
