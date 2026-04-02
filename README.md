# mcp-gutendex

MCP server for Project Gutenberg books via the [Gutendex API](https://gutendex.com/). No authentication required.

## Tools

| Tool | Description |
|------|-------------|
| `search_books` | Search books by title or author |
| `get_book` | Get a specific book by ID |
| `popular_books` | Get the most popular books on Project Gutenberg |
| `books_by_topic` | Browse books by topic or subject |

## Quickstart (Pipeworx Gateway)

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "gutendex_search_books",
      "arguments": { "query": "Shakespeare" }
    },
    "id": 1
  }'
```

## License

MIT
