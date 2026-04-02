/**
 * Gutendex MCP — wraps Gutendex API for Project Gutenberg books (free, no auth)
 *
 * Tools:
 * - search_books: Search books by title or author
 * - get_book: Get a specific book by ID
 * - popular_books: Get the most popular books on Project Gutenberg
 * - books_by_topic: Browse books by topic or subject
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://gutendex.com';

type RawPerson = {
  name: string;
  birth_year: number | null;
  death_year: number | null;
};

type RawFormat = Record<string, string>;

type RawBook = {
  id: number;
  title: string;
  authors: RawPerson[];
  translators: RawPerson[];
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean | null;
  media_type: string;
  formats: RawFormat;
  download_count: number;
};

type RawListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawBook[];
};

function formatPerson(p: RawPerson) {
  return {
    name: p.name,
    birth_year: p.birth_year,
    death_year: p.death_year,
  };
}

function formatBook(b: RawBook) {
  return {
    id: b.id,
    title: b.title,
    authors: b.authors.map(formatPerson),
    languages: b.languages,
    subjects: b.subjects,
    download_count: b.download_count,
    formats: b.formats,
  };
}

const tools: McpToolExport['tools'] = [
  {
    name: 'search_books',
    description: 'Search Project Gutenberg books by title or author name.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Title or author name to search for.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_book',
    description: 'Get detailed information for a specific Project Gutenberg book by its numeric ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'The numeric Project Gutenberg book ID.',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'popular_books',
    description: 'Get the most downloaded / popular books on Project Gutenberg.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'books_by_topic',
    description: 'Browse Project Gutenberg books by topic or subject keyword.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Topic or subject keyword to filter books by (e.g. "science", "love", "history").',
        },
      },
      required: ['topic'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_books':
      return searchBooks(args.query as string);
    case 'get_book':
      return getBook(args.id as number);
    case 'popular_books':
      return popularBooks();
    case 'books_by_topic':
      return booksByTopic(args.topic as string);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function searchBooks(query: string) {
  const res = await fetch(`${BASE_URL}/books?search=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Gutendex API error: ${res.status}`);
  const data = (await res.json()) as RawListResponse;
  return {
    count: data.count,
    books: data.results.map(formatBook),
  };
}

async function getBook(id: number) {
  const res = await fetch(`${BASE_URL}/books/${id}`);
  if (!res.ok) throw new Error(`Gutendex API error: ${res.status}`);
  const data = (await res.json()) as RawBook;
  return formatBook(data);
}

async function popularBooks() {
  const res = await fetch(`${BASE_URL}/books?sort=popular&page=1`);
  if (!res.ok) throw new Error(`Gutendex API error: ${res.status}`);
  const data = (await res.json()) as RawListResponse;
  return {
    count: data.count,
    books: data.results.map(formatBook),
  };
}

async function booksByTopic(topic: string) {
  const res = await fetch(`${BASE_URL}/books?topic=${encodeURIComponent(topic)}`);
  if (!res.ok) throw new Error(`Gutendex API error: ${res.status}`);
  const data = (await res.json()) as RawListResponse;
  return {
    count: data.count,
    topic,
    books: data.results.map(formatBook),
  };
}

export default { tools, callTool } satisfies McpToolExport;
