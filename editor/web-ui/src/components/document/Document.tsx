import Block from "./Block";
import DragSupport from "~/components/drag/DragSupport";
import { useDocumentStore } from "~/store/document";
import TextBlock from "../block/TextBlock";

export default function Document() {
  const blocks = useDocumentStore((state) => state.content);

  return (
    <div data-doc-root className="mt-8 flex justify-center">
      <DragSupport>
        <div className="w-1/2 grid grid-cols-2">
          <div>
            {blocks.map((block) => (
              <Block key={block.id} id={block.id}>
                <TextBlock blockId={block.id} text={block.text} />
              </Block>
            ))}
          </div>
        </div>
      </DragSupport>
    </div>
  );
}
