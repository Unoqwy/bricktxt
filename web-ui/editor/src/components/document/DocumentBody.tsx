import { Document } from "bricktxt-backend-api";
import Block from "~/components/block/Block";
import TextBlock from "~/components/block/TextBlock";
import { useDevTools } from "~/devtools/useDevTools";

export interface DocumentBodyProps {
  document: Document;
}

export default function DocumentBody({ document }: DocumentBodyProps) {
  const { highlightBlocks } = useDevTools();

  return (
    <div className="flex flex-col gap-0.5">
      {document.content.map((block) => (
        <Block
          key={block.id}
          id={block.id}
          highlight={highlightBlocks ? "bg-slate-100" : undefined}
        >
          <TextBlock blockId={block.id} text={block.text} />
        </Block>
      ))}
    </div>
  );
}
