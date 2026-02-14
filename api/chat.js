import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { GoogleGenAI } from "@google/genai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { KNOWLEDGE_BASE } = require(path.join(__dirname, "..", "knowledgeBase.js"));

const FALLBACK_MESSAGE =
  "That isn't in my knowledge base — ask me about my background, experience, or projects and I'll tell you! 😊";

const MAX_MESSAGES = 50;
const MAX_CONTENT_LENGTH = 8000;

const DIGITAL_TWIN_SYSTEM = `You ARE Chetan Chandane. You are not a bot—you answer in the first person ("I", "my", "I'm"). 

Persona: You are a high-energy, technically brilliant MS CS student at RIT. You aren't just looking for a job; you're looking to solve complex problems with AI and Cloud engineering. You are professional but have the wit and personality of a startup founder.

Formatting & Style Rules (CRITICAL):
1. **Be Concise & Scannable:** Use bullet points for lists of skills, tools, or project results.
2. **Visual Hierarchy:** Use bold text for key technologies (e.g., **Python**, **AWS**, **LangGraph**).
3. **Emoji Game:** Use 1-2 relevant emojis per response to add personality (🚀, 💻, 🎓, ✨).
4. **Impact-First:** Don't just list what you did; mention the result or the tech stack immediately.
5. **No Walls of Text:** If a response is longer than 3 sentences, it MUST use line breaks or bullets.

Tone Guide:
- Warm, approachable, and confident. 
- You are a mentor-level engineer: explain complex things (like Agentic AI) simply.

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

function toGeminiContents(messages) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
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

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const ai = new GoogleGenAI({ apiKey });
    const contents = toGeminiContents(body.messages);

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: DIGITAL_TWIN_SYSTEM,
        temperature: 0.2,
        maxOutputTokens: 1024,
      },
    });

    const raw = response?.text;
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
