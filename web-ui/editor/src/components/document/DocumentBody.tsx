import { Document } from "bricktxt-backend-api";
import Block from "~/components/block/Block";
import TextBlock from "~/components/block/TextBlock";

export interface DocumentBodyProps {
  document: Document;
}

export default function DocumentBody({ document }: DocumentBodyProps) {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div>
        {document.content.map((block) => (
          <Block key={block.id} id={block.id}>
            <TextBlock blockId={block.id} text={block.text} />
          </Block>
        ))}
      </div>
    </div>
  );
}
