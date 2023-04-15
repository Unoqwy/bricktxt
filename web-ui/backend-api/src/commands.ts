export interface RepositionCommand {
  source_id: string;
  target_id: string;
  position: string;
}

export interface UpdateBlockPropertyCommand {
  block_id: string;
  property: string;
  value: any;
}
