import { useDraggableProps } from "../context/DragContainerProvider";
import { useDragMutationStore } from "../store/drag-mutation";

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
      <div contentEditable={true} className="ml-2 outline-none">
        {props.children}
      </div>
      <DragHint blockId={props.id} />
    </div>
  );
}

interface DragHintProps {
  blockId: string;
}

function DragHint(props: DragHintProps) {
  const { mutation } = useDragMutationStore();

  if (mutation?.targetId !== props.blockId) {
    return null;
  }

  return (
    <div
      data-drag-placeholder
      style={{
        position: "absolute",
        width: "100%",
        height: "4px",
        bottom: "-4px",
        backgroundColor: "rgba(0, 50, 120, 0.4)",
      }}
    ></div>
  );
}
