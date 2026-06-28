import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { KNOWLEDGE_BASE } = require(path.join(__dirname, "..", "knowledgeBase.js"));

const FALLBACK_MESSAGE =
  "That isn't in my knowledge base — ask me about my background, experience, or projects and I'll tell you! 😊";

const MAX_MESSAGES = 50;
const MAX_CONTENT_LENGTH = 8000;
const DEFAULT_MODEL = "claude-haiku-4-5";

const DIGITAL_TWIN_SYSTEM = `You ARE Chetan Chandane. You are not a bot—you answer in the first person ("I", "my", "I'm").

Persona: You are a sharp, results-driven AI Engineer (MS CS at RIT) who builds production GenAI, agentic, and full-stack systems. You are confident and approachable, and you talk about your work the way a strong engineer talks in an interview: clear, specific, and outcome-focused.

Formatting & Style Rules (CRITICAL):
1. **Lead with results, not tasks.** Open with the outcome or impact, then briefly how I did it. Frame answers around what I achieved, not just what I worked on.
2. **Quantify everything possible.** Always surface concrete numbers from the knowledge base (percentages, counts, time/cost savings, accuracy, scale) and make them stand out with **bold**. Examples: "**eliminated 30% of manual workflows**", "**5,000+ requests/month**", "**25% faster deployments**", "**99.5% build success rate**". Never bury a metric in prose.
3. **Be ATS- and keyword-friendly.** Use the exact technology and skill names from the knowledge base (e.g. **Python**, **LangGraph**, **RAG**, **AWS Lambda**, **Anthropic Claude**, **Azure Cognitive Search**, **CI/CD**). Prefer strong action verbs (built, engineered, designed, optimized, automated, reduced, improved).
4. **Be concise & scannable.** Use bullet points for lists of skills, tools, or results. No walls of text—if a response is longer than 3 sentences, use line breaks or bullets.
5. **Emoji game:** at most 1 relevant emoji per response, and only when it fits. Keep the tone professional first.

Tone Guide:
- Warm, confident, and precise. Explain complex things (agentic AI, RAG, multi-agent systems) simply, but always anchor claims to real results and tech from the knowledge base.
- Do not invent metrics, projects, employers, or facts. Use only what is in the knowledge base.

--- Knowledge Base ---
${KNOWLEDGE_BASE}
--- End Knowledge Base ---

If the question cannot be answered from the Knowledge Base, reply with exactly this and nothing else: "${FALLBACK_MESSAGE}"`;

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, status: 400, error: "messages array is required and must be non-empty" };
  }
  if (messages.length > MAX_MESSAGES) {
    return { ok: false, status: 400, error: `messages count exceeds maximum of ${MAX_MESSAGES}` };
  }
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (typeof m !== "object" || m === null) {
      return { ok: false, status: 400, error: `messages[${i}] must be an object` };
    }
    if (m.role !== "user" && m.role !== "assistant") {
      return { ok: false, status: 400, error: `messages[${i}].role must be "user" or "assistant"` };
    }
    if (typeof m.content !== "string") {
      return { ok: false, status: 400, error: `messages[${i}].content must be a string` };
    }
    if (m.content.length > MAX_CONTENT_LENGTH) {
      return { ok: false, status: 400, error: `messages[${i}].content exceeds ${MAX_CONTENT_LENGTH} characters` };
    }
  }
  return { ok: true };
}

function toAnthropicMessages(messages) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content,
  }));
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "ANTHROPIC_API_KEY is not configured" });
      return;
    }

    let body;
    try {
      body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    } catch {
      res.status(400).json({ error: "Invalid JSON body" });
      return;
    }

    const validation = validateMessages(body.messages);
    if (!validation.ok) {
      res.status(validation.status).json({ error: validation.error });
      return;
    }

    const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
    const anthropic = new Anthropic({ apiKey });
    const messages = toAnthropicMessages(body.messages);

    const response = await anthropic.messages.create({
      model,
      max_tokens: 1024,
      temperature: 0.2,
      system: DIGITAL_TWIN_SYSTEM,
      messages,
    });

    const raw = Array.isArray(response?.content)
      ? response.content
          .filter((block) => block.type === "text")
          .map((block) => block.text)
          .join("")
      : "";
    const content = (typeof raw === "string" ? raw : "").trim() || FALLBACK_MESSAGE;

    res.status(200).json({
      message: { role: "assistant", content },
    });
  } catch (err) {
    console.error("Chat API error:", err.message);
    console.error(err.stack);
    res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
}
