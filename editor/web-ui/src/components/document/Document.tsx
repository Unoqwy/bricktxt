import Block from "./Block";
import DragSupport from "~/components/drag/DragSupport";
import { useDocumentStore } from "~/store/document";

export default function Document() {
  const blocks = useDocumentStore((state) => state.content);

  return (
    <div data-doc-root className="mt-8 flex justify-center">
      <DragSupport>
        <div className="w-1/2 grid grid-cols-2">
          <div>
            {blocks
              .filter((block) => block.type === "paragraph")
              .map((block) => (
                <Block key={block.id} id={block.id}>
                  {block.text}
                </Block>
              ))}
          </div>
          <div>
            {blocks
              .filter((block) => block.type === "paragraph-2")
              .map((block) => (
                <Block key={block.id} id={block.id}>
                  {block.text}
                </Block>
              ))}
          </div>
        </div>
      </DragSupport>
    </div>
  );
}
