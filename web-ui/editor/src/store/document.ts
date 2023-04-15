/**
 * Dev store for the document while experimenting with things
 * without the engine. This is not how documents will actually be handled.
 */

import { backend } from "bricktxt-core";

import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { Border, DragMutation } from "./drag-mutation";

import { Block } from "bricktxt-backend-api";

export interface DocumentStore {
  content: Block[];
  setContent: (content: Block[]) => void;
  applyDragMutation: (mutation: DragMutation) => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  content: [],
  setContent: (content) => set({ content }),

  applyDragMutation: (mutation) => {
    if (
      mutation.targetBorder !== Border.Top &&
      mutation.targetBorder !== Border.Bottom
    ) {
      return;
    }
    const command = {
      source_id: mutation.sourceId,
      target_id: mutation.targetId,
      position: mutation.targetBorder === Border.Top ? "Top" : "Bottom",
    };
    backend.instance.cmd_reposition(command);
    set({ content: backend.instance.get_content() });
  },
}));

if (import.meta.env.DEV) {
  mountStoreDevtool("DocumentStore", useDocumentStore);
}
