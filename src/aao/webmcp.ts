/**
 * WebMCP tools: let browser agents act on this site through declared tools
 * instead of scraping the UI. https://developer.chrome.com/docs/ai/webmcp
 *
 * The API is experimental (Chrome 146+ behind a flag). It lives at
 * document.modelContext in current Chrome builds and navigator.modelContext in
 * the original proposal, so both are checked. When neither exists this is a no-op.
 *
 * Facts come from /agent.json, which scripts/aao/build-aao.js generates from
 * aao/facts.js at build time, so tools and page never disagree.
 */

type ToolResult = { content: { type: 'text'; text: string }[] };

type ModelContext = {
  registerTool: (
    tool: {
      name: string;
      description: string;
      inputSchema: object;
      annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
      execute: (input: any) => Promise<ToolResult>;
    },
    options?: { signal?: AbortSignal }
  ) => unknown;
};

const text = (value: unknown): ToolResult => ({
  content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }],
});

let factsPromise: Promise<any> | null = null;
function loadFacts(): Promise<any> {
  if (!factsPromise) {
    factsPromise = fetch('/agent.json')
      .then((r) => {
        if (!r.ok) throw new Error(`agent.json ${r.status}`);
        return r.json();
      })
      .catch((err) => {
        factsPromise = null;
        throw err;
      });
  }
  return factsPromise;
}

async function askChetan(question: string): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: question.slice(0, 8000) }] }),
  });
  if (!res.ok) throw new Error(`Ask Chetan is unavailable right now (HTTP ${res.status}).`);
  const data = await res.json();
  return data?.message?.content ?? 'No answer returned.';
}

export function registerWebMcpTools(): void {
  if (typeof window === 'undefined') return;
  const mc: ModelContext | undefined =
    (document as any).modelContext ?? (navigator as any).modelContext;
  if (!mc || typeof mc.registerTool !== 'function') return;

  const readOnly = { readOnlyHint: true };

  try {
    mc.registerTool({
      name: 'get_profile',
      description:
        "Get Chetan Chandane's professional profile: role, summary, location, what roles he is open to, education, experience, certifications, and skills.",
      inputSchema: { type: 'object', properties: {} },
      annotations: readOnly,
      async execute() {
        const { person } = await loadFacts();
        return text(person);
      },
    });

    mc.registerTool({
      name: 'list_projects',
      description:
        "List Chetan Chandane's portfolio projects with descriptions, tech stack, and links. Optionally filter by a technology keyword such as 'RAG', 'Kafka', or 'LangGraph'.",
      inputSchema: {
        type: 'object',
        properties: {
          tech: { type: 'string', description: 'Optional keyword to filter projects by technology or topic.' },
        },
      },
      annotations: readOnly,
      async execute({ tech }: { tech?: string }) {
        const { projects } = await loadFacts();
        const q = (tech || '').trim().toLowerCase();
        const matches = q
          ? projects.filter((p: any) =>
              [p.name, p.description, ...(p.tech || [])].join(' ').toLowerCase().includes(q)
            )
          : projects;
        return text(matches);
      },
    });

    mc.registerTool({
      name: 'get_contact',
      description: 'Get how to contact Chetan Chandane: email, resume link, and profile links (GitHub, LinkedIn, Medium, X).',
      inputSchema: { type: 'object', properties: {} },
      annotations: readOnly,
      async execute() {
        const { person } = await loadFacts();
        return text({ email: person.email, resume: person.resumeUrl, profiles: person.sameAs });
      },
    });

    mc.registerTool({
      name: 'ask_chetan',
      description:
        "Ask Chetan Chandane's AI digital twin a question about his background, experience, projects, or skills. Answers are grounded only in his published knowledge base.",
      inputSchema: {
        type: 'object',
        properties: {
          question: { type: 'string', description: 'The question to ask, in plain language.' },
        },
        required: ['question'],
      },
      // The answer is model-generated, so flag it for the calling agent.
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      async execute({ question }: { question: string }) {
        if (!question || !question.trim()) return text('Please provide a question.');
        return text(await askChetan(question));
      },
    });
  } catch (err) {
    // Experimental API: never let it break the page.
    console.warn('[webmcp] tool registration failed', err);
  }
}
