/**
 * Dev store for the document while experimenting with things
 * without the engine. This is not how documents will actually be handled.
 */

import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { Border, DragMutation } from "./drag-mutation";

export interface Block {
  id: string;
  type: string;
  text: string;
}

export interface DocumentStore {
  content: Block[];
  setContent: (content: Block[]) => void;
  applyDragMutation: (mutation: DragMutation) => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  content: [],
  setContent: (content) => set({ content }),

  applyDragMutation: (mutation) => {
    const blocks = [...get().content];
    var targetIdx = blocks.findIndex((block) => block.id === mutation.targetId);
    const sourceIdx = blocks.findIndex(
      (block) => block.id === mutation.sourceId
    );
    if (sourceIdx < 0 || targetIdx < 0) {
      return;
    }
    const sourceBlock = blocks.splice(sourceIdx, 1)[0];
    targetIdx = blocks.findIndex((block) => block.id === mutation.targetId);
    const target = blocks[targetIdx];
    sourceBlock.type = target.type;
    switch (mutation.targetBorder) {
      case Border.Top:
        blocks.splice(targetIdx, 0, sourceBlock);
        break;
      case Border.Bottom:
        blocks.splice(targetIdx + 1, 0, sourceBlock);
        break;
    }

    set({ content: blocks });
  },
}));

if (import.meta.env.DEV) {
  mountStoreDevtool("DocumentStore", useDocumentStore);
}
