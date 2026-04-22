# mcp-gutendex

Gutendex MCP — wraps Gutendex API for Project Gutenberg books (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_books` | Search for books by title or author name. Returns book IDs, titles, authors, and download counts. |
| `get_book` | Get full details for a book by ID. Returns title, author, publication year, language, available formats, and download count. |
| `popular_books` | Get the most downloaded books ranked by popularity. Returns titles, authors, IDs, and download statistics. |
| `books_by_topic` | Browse books by subject or topic (e.g., \'science fiction\', \'philosophy\'). Returns matching titles, authors, and IDs. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "gutendex": {
      "url": "https://gateway.pipeworx.io/gutendex/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Gutendex data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
