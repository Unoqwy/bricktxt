import { useDraggableProps } from "../context/DragContainerProvider";
import { DragHint } from "./DragHint";

export interface BlockProps {
  id: string;
  children: React.ReactNode;
}

export default function Block(props: BlockProps) {
  const dragProps = useDraggableProps();
  return (
    <div
      className="flex ml-1 gap-1 relative"
      data-block-id={props.id}
      draggable={true}
      {...dragProps}
    >
      <button>+</button>
      <button>[H]</button>
      <div className="ml-2 outline-none">{props.children}</div>
      <DragHint blockId={props.id} />
    </div>
  );
}
