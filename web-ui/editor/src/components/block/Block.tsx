import { DragPlaceholder } from "~/components/drag/DragPlaceholder";
import { useEffect, useMemo, useRef, useState } from "react";
import { BlockActions } from "./BlockActions";
import classNames from "classnames";

export interface BlockProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

export default function Block(props: BlockProps) {
  const [showActions, setShowActions] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const content = useMemo(
    () => (
      <div ref={contentRef} className="w-full">
        {props.children}
      </div>
    ),
    [props.children]
  );

  useEffect(() => {
    contentRef.current?.focus();
  });

  return (
    <div
      className={classNames(
        "relative px-px py-0.5 rounded-sm",
        props.className
      )}
      data-block-id={props.id}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="absolute left-[-50px] w-[50px] h-full pr-1">
        {showActions && (
          <BlockActions blockId={props.id} contentRef={contentRef} />
        )}
      </div>
      {content}
      <DragPlaceholder blockId={props.id} />
    </div>
  );
}
