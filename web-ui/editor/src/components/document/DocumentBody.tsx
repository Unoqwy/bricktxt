import { Block as BackendBlock, Document } from "bricktxt-backend-api";
import classNames from "classnames";
import { useMemo, useState } from "react";
import Block from "~/components/block/Block";
import TextBlock from "~/components/block/TextBlock";
import { useDevTools } from "~/devtools/useDevTools";
import { Select } from "./Select";

export interface DocumentBodyProps {
  document: Document;
}

export default function DocumentBody(props: DocumentBodyProps) {
  const { highlightBlocks } = useDevTools();

  const blocktypes = useMemo(() => {
    let map = new Map();
    map.set("paragraph", {
      render: (block: BackendBlock) => (
        <TextBlock blockId={block.id} text={block.text} />
      ),
    });
    map.set("heading-1", {
      layout: "mt-2",
      render: (block: BackendBlock) => (
        <TextBlock className="text-xl" blockId={block.id} text={block.text} />
      ),
    });
    return map;
  }, []);

  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-0.5">
      <Select setSelected={setSelected} />
      {props.document.content.map((block) => {
        const blocktype = blocktypes.get(block.type);
        return (
          <Block
            key={block.id}
            id={block.id}
            className={classNames(blocktype.layout, {
              "bg-slate-100": highlightBlocks,
              "bg-blue-100": selected.includes(block.id),
            })}
          >
            {blocktype.render(block)}
          </Block>
        );
      })}
    </div>
  );
}
