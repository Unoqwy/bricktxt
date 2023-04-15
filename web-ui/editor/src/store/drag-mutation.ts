import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

export const Border = {
  Top: 1,
  Bottom: 2,
  Left: 3,
  Right: 4,
};

export type BorderId = (typeof Border)[keyof typeof Border];

export interface DraggingState {
  mutation?: DragMutation;
  setMutation: (mutation: DragMutation | undefined) => void;
}

export interface DragMutation {
  sourceId: string;
  targetId: string;
  targetBorder: BorderId;
}

export const useDragMutationStore = create<DraggingState>((set) => ({
  setMutation: (mutation) => set({ mutation }),
}));

if (import.meta.env.DEV) {
  mountStoreDevtool("DragMutation", useDragMutationStore);
}
