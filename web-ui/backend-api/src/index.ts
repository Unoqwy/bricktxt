import { RepositionCommand, UpdateBlockPropertyCommand } from "./commands";
import { Block } from "./document";

export interface Backend {
  get_content(): Block[];

  cmd_reposition(command: RepositionCommand): void;

  cmd_update_block_property(command: UpdateBlockPropertyCommand): void;
}

export * from "./document";
export * from "./commands";
