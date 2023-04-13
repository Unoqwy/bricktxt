import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

export type BorderName = "top" | "bottom" | "left" | "right";

export interface DraggingState {
  mutation?: DragMutation;
  setMutation: (mutation: DragMutation | undefined) => void;
}

export interface DragMutation {
  sourceId: string;
  targetId: string;
  targetBorder: BorderName;
}

export const useDragMutationStore = create<DraggingState>((set) => ({
  setMutation: (mutation) => set({ mutation }),
}));

if (import.meta.env.DEV) {
  mountStoreDevtool("DragMutation", useDragMutationStore);
}
