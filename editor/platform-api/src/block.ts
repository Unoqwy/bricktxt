/**
 * A block. Used to build anything.
 */
interface Block {
  /** Free-form ID to uniquely identify a block across related files. */
  id: string;
  /** Human-readable type identifier. */
  type: string;
  /** Schema to be used for this block. Looked up from 'type'. */
  schema: BlockSchema | undefined;
}

/**
 * A schema definition for the block type.
 */
interface BlockSchema {
  /**
   * Human-readable identifier for this schema type.
   * In most cases, it should be equal to block 'type'.
   */
  slug: string;
  /**
   * Property paths that may contain values with content.
   * This is used for search purposes.
   */
  contentProperties: string[];
}

export { Block, BlockSchema };
