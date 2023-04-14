# bricktxt

Block-based document editor using TOML files as storage.

Built with React (UI) and Rust (engine).

## Motivation

Block-based text editing is very powerful and has proven its demand with the influx of tools like Notion.
However, if you care about privacy and want to do your editing locally while still maintaining text files that can be version-controlled and are future-proof, well, nothing offered you that.

## What It Is

bricktxt itself is a library written in Rust, that is used like a backend would on a web service: it links bricks together, provide search abilities, write changes to files, etc.

## Q&A

### Why use TOML?

Before landing on TOML, there were other considerations:

- HTML: This would have been a great option for future-proofing if blocks remained basics. Blocks are not all simple though. Considering the needs to have dynamic evaluation, several documents within the same file, a clean way to store arbitrary data, and as little parsing overhead as possible, HTML doesn't work at all for this use case.
- YAML: The format supports several documents in the same file, is (relatively) user-friendly and is space-efficient. So, what's wrong? It wouldn't have been a bad choice, but after experimenting with how files would look and comparing TOML to YAML, TOML was the clear winner. Although users shouldn't need to edit files manually, it leads to nicer diff with version control. Using TOML also has some techincal benefits for the engine to use.
