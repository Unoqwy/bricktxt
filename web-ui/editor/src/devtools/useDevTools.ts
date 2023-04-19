import { create } from "zustand";

export interface DevToolsStore {
  highlightBlocks: boolean;

  set(state: Partial<DevToolsStore>): void;
}

export const useDevTools = create<DevToolsStore>((set) => ({
  highlightBlocks: false,

  set: (state) => set(state),
}));
