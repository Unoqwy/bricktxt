export type BlockPlacement = RelativePlacement;

export type RelativePosition = "Top" | "Bottom";

export interface RelativePlacement {
  rel_block_id: string;
  position: RelativePosition;
}

export interface BlockCreateCommand {
  type: string;
  placement: BlockPlacement;
}

export interface BlockDeleteCommand {
  block_id: string;
}

export interface BlockRepositionCommand {
  block_id: string;
  placement: BlockPlacement;
}

export interface BlockUpdatePropertyCommand {
  block_id: string;
  property: string;
  value: any;
}
