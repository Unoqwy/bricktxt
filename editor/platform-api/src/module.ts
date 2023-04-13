/**
 * A module to register features into the platform.
 */
interface Module {
  /** Human-readable identifier for this module. */
  slug: string;

  /**
   * Called at loading stage. Use to register block types, etc.
   */
  load(): void;

  /**
   * Called at unloading stage.
   * Block types should unregister themselves automatically, this is
   * made available for extensibility purposes.
   */
  unload(): void;
}

export { Module };
