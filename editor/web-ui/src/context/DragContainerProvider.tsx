import { DOMAttributes, createContext, useContext } from "react";

export interface DragContainerOptions {
  onDragStart?: React.DragEventHandler;
  onDragUpdate?: React.DragEventHandler;
  onDragEnd?: React.DragEventHandler;
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

export function useDraggableProps(): DOMAttributes<unknown> {
  const opt = useDragContainer();
  return {
    onDragStart: opt.onDragStart,
    onDrag: opt.onDragUpdate,
    onDragEnd: opt.onDragEnd,
  };
}

export interface DragContainerProviderProps extends DragContainerOptions {
  children: React.ReactNode;
}

export default function DragContainerProvider({
  children,
  ...state
}: DragContainerProviderProps) {
  return (
    <DragContainerContext.Provider value={state}>
      {children}
    </DragContainerContext.Provider>
  );
}
