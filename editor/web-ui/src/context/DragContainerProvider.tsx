import { DOMAttributes, createContext, useContext } from "react";

export interface DragElement {
  id: string;
  displayElement?: HTMLElement;
}

export type DragElementSupplier<T = any> = (
  event: React.DragEvent<T>
) => DragElement;

export interface DragContainerOptions<T = any> {
  onDragStart?: (
    event: React.DragEvent<T>,
    elementSupplier?: DragElementSupplier<T>
  ) => void;
  onDragUpdate?: React.DragEventHandler<T>;
  onDragEnd?: React.DragEventHandler<T>;
}

export const DragContainerContext = createContext<
  DragContainerOptions | undefined
>(undefined);

export function useDragContainer(): DragContainerOptions {
  const opt = useContext(DragContainerContext);
  if (opt === undefined) {
    throw new Error("Illegal state: using useDragContext without providers");
  }
  return opt;
}

export function useDraggableProps<T extends Element>(
  elementSupplier?: DragElementSupplier
): DOMAttributes<T> {
  const opt = useDragContainer();
  return {
    onDragStart:
      opt.onDragStart !== undefined
        ? (event) => opt.onDragStart!(event, elementSupplier)
        : undefined,
    onDrag: opt.onDragUpdate,
    onDragEnd: opt.onDragEnd,
  };
}
