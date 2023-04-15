# Storage Specifications

This document describes how TOML files are structured for storage.

IMPORTANT NOTE: Work In Progress

## Top-level elements

Everything in bricktxt is represented in three categories:

- **Documents**<br/>
  A document (aka. page) is a set of blocks -with metadata- intended to be viewed fully, whether on its own or embedded.
- **Blocks**<br/>
  A block is the main element that can represent any kind of visual data.
  Blocks can have any number of properties that can be used to alter their display, or act as a primitive data storage.
- **Databases**<br/>
  A database is a set of records that is used as an advanced data storage. Each database can define its own schema, that records follow.

TODO : TOML representation
