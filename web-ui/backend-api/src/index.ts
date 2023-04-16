import {
  BlockCreateCommand,
  BlockDeleteCommand,
  BlockRepositionCommand,
  BlockUpdatePropertyCommand,
} from "./commands";
import { Block } from "./document";

export interface Backend {
  get_content(): Block[];

  cmd_block_create(command: BlockCreateCommand): void;

  cmd_block_delete(command: BlockDeleteCommand): void;

  cmd_block_reposition(command: BlockRepositionCommand): void;

  cmd_block_update_property(command: BlockUpdatePropertyCommand): void;
}

export * from "./document";
export * from "./commands";
