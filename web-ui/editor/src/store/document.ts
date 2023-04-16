/**
 * Dev store for the document while experimenting with things
 * without the engine. This is not how documents will actually be handled.
 */

import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

import { Block } from "bricktxt-backend-api";

export interface DocumentStore {
  content: Block[];
  setContent: (content: Block[]) => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  content: [],
  setContent: (content) => set({ content }),
}));

if (import.meta.env.DEV) {
  mountStoreDevtool("DocumentStore", useDocumentStore);
}
