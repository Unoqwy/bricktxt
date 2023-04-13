import { Module } from "./module";

/**
 * Editor Platform.
 */
interface Platform {
  /**
   * Registers a module.
   * @param module Module to register
   */
  registerModule(module: Module): void;
}

export { Platform };
