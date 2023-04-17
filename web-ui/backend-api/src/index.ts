import { Document } from "./document";
import {
  BlockCreateCommand,
  BlockDeleteCommand,
  BlockRepositionCommand,
  BlockUpdatePropertyCommand,
} from "./commands";

export interface Backend {
  view_create(initial_doc_id: string): number;

  view_free(view_id: number): void;

  view_get_content(view_id: number): Document;

  cmd_block_create(command: BlockCreateCommand): void;

  cmd_block_delete(command: BlockDeleteCommand): void;

  cmd_block_reposition(command: BlockRepositionCommand): void;

  cmd_block_update_property(command: BlockUpdatePropertyCommand): void;
}

export * from "./document";
export * from "./commands";
