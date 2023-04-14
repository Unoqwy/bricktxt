import { BlockActions } from "./BlockActions";
import { DragPlaceholder } from "~/components/drag/DragPlaceholder";
import { useMemo, useRef, useState } from "react";

export interface BlockProps {
  id: string;
  children: React.ReactNode;
}

export default function Block(props: BlockProps) {
  const [showActions, setShowActions] = useState(false);

  const ref = useRef(null);
  const content = useMemo(
    () => (
      <div ref={ref} className="ml-2 outline-none" contentEditable={true}>
        {props.children}
      </div>
    ),
    [props.children]
  );

  return (
    <div
      className="flex ml-1 gap-1 relative"
      data-block-id={props.id}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="absolute left-[-50px] w-[50px] h-full">
        {showActions && <BlockActions blockId={props.id} contentRef={ref} />}
      </div>
      {content}
      <DragPlaceholder blockId={props.id} />
    </div>
  );
}
