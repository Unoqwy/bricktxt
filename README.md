# bricktxt

Block-based text editing tool using YAML files as storage.

## Motivation

Block-based text editing is very powerful and has proven its demand with the influx of tools like Notion.
However, if you care about privacy and want to do your editing locally while still maintaining text files that can be version-controlled and are future-proof, well, nothing offered you that.

## Q&A

### Why store as YAML, and not HTML?

It's easy to think that with HTML, files could be opened directly decades later without the need to use convert the format first.
The truth is, while you could very well represent block-based text files using a markup language, any remotely complex block that needs to be evaluated dynamically would not display all the content. This is obviously a deal-breaker for things like databases.
With this shortcomings in mind, any file format can be used. YAML was picked because it's (relatively) user-friendly and can represent a lot of data in a concise manner.
