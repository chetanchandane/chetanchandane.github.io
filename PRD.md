# PRD — Digital Twin Tab (AI Chat Agent)

**Owner:** Chetan Chandane  
**Feature Name:** Digital Twin (Portfolio Chat)  
**Target Surface:** Portfolio website (React SPA on Vercel)  
**Last Updated:** 2026-02-12

---

## 1) Problem Statement

Visitors (recruiters, engineers, managers) often want quick answers about:
- Chetan’s background (education, roles, tech stack)
- Agentic AI / GenAI work (what problems, what architecture, what tools)
- Projects and impact (what he built, why it matters)

Today, they must skim the page and infer details. This feature adds a **high-performance AI chat** that answers using a curated, repo-backed knowledge base (no guessing).

---

## 2) Goals and Success Criteria

### Goals
1. Add a new navigation “tab”/section called **Digital Twin**.
2. Provide a chat experience that:
   - is **stateful** (the frontend sends full chat history; persisted in sessionStorage),
   - is **fast** (low latency; prompt caching friendly),
   - is **truthful** (no hallucinations—strict fallback when KB lacks the answer).
3. Keep styling consistent with the existing portfolio theme.

### Non-goals
- No vector database, embeddings, or external crawling.
- No persistent database storage of chats (session-only).
- No tool calling / actions (send emails, run code, etc).

### Success Criteria (initial)
- 95% of chat responses return within acceptable UX time (depends on model + network).
- Digital Twin answers are consistent with the Knowledge Base, with **no fabricated claims**.
- Conversation persists across in-site navigation until browser is closed.

---

## 3) User Stories

1. **Recruiter:** “What have you worked on recently?” → gets a concise summary + projects.
2. **Hiring manager:** “Tell me your experience with agentic systems.” → gets project-based answer.
3. **Engineer:** “Which stack did you use at Excellus?” → gets what’s in KB, otherwise fallback.
4. **Visitor:** switches tabs (scroll sections) → chat history remains available.

---

## 4) Functional Requirements

### Frontend (ChatTab)
- New section id: `digital-twin`, visible in navigation.
- UI elements:
  - Messages list (user/assistant bubbles)
  - Input box + Send button
  - **Typing…** animation while awaiting response
  - 3 **Quick Question** buttons (click to send)
- State:
  - Keep `messages[]` in React state
  - Persist to `sessionStorage` under a versioned key
  - Restore on mount; clear automatically when browser closes (sessionStorage behavior)
- Networking:
  - POST to `/api/chat` with `{ messages: [...] }`
  - Render assistant response

### Backend (Vercel Function)
- Route: `POST /api/chat`
- Input: JSON `{ messages: [{role, content}, ...] }`
- Output: JSON `{ message: { role: "assistant", content: string } }`
- Model settings:
  - Temperature **0.2**
  - Model controlled by `OPENAI_MODEL` env var (default in code)
- Prompting:
  - A stable “Digital Twin” instruction prefix
  - Append the Knowledge Base as context
  - Guardrail: If not in KB → return the exact fallback message (no hallucination)

---

## 5) Non-Functional Requirements

### Performance
- Keep the prompt prefix stable to maximize **OpenAI Prompt Caching** opportunities:
  - Place static instructions + Knowledge Base first
  - User messages come after the static prefix  
  (Prompt caching is based on exact prefix matches and works automatically when prompts are sufficiently long.)

### Reliability
- The API must validate:
  - roles are only `user` or `assistant`
  - message count capped (prevent cost blow-up)
  - message size capped

### Security / Cost Control
- API key must be server-only (`OPENAI_API_KEY`).
- Add lightweight protections (implemented now):
  - cap history length and per-message size
- Recommended next hardening (not required for v1):
  - Bot protection (Vercel BotID) / rate limiting
  - Add an allowlist for origins, if needed
  - Add abuse monitoring (spikes in requests)

### Privacy
- No chat data is persisted server-side.
- Users should assume their prompts are sent to OpenAI for processing.

---

## 6) Architecture

### Components
1. **Knowledge Base** (`/knowledgeBase.js`)
   - Single source of truth.
   - Markdown string used for context injection.
2. **Backend** (`/api/chat.js`)
   - Vercel serverless function that:
     - receives `messages[]`
     - injects system/developer prompt + KB
     - calls OpenAI with temperature 0.2
3. **Frontend** (`/src/components/ChatTab.tsx`)
   - Chat UI + sessionStorage memory
   - Calls `/api/chat`
4. **Navigation integration**
   - Add “Digital Twin” entry to nav items
   - Render the section in `App.tsx`

### Request Flow
1. User types question
2. Frontend appends to `messages[]`
3. Frontend POSTs full `messages[]` to `/api/chat`
4. API injects:
   - digital twin instructions
   - KB content
   - user-provided chat history
5. OpenAI returns assistant answer
6. Frontend renders and persists to sessionStorage

### Hosting
- **Vercel Functions** handle `/api/*` server-side code.
- SPA routing is handled by `vercel.json` rewrite rules.

---

## 7) Architectural Decisions Record (ADR)

### ADR-001: Choose “RAG-Lite” (Context Injection) instead of full RAG
**Decision:** Use a static Knowledge Base injected into the prompt each request (no vector DB).

**Why:**
- The content scope is small (resume + portfolio projects), so retrieval infrastructure is unnecessary.
- Lowest latency: no embedding step + no vector search + no extra network hops.
- Simpler reliability: fewer moving parts for a public-facing portfolio.

**How this leverages Prompt Caching:**
- OpenAI Prompt Caching benefits from **stable prompt prefixes**. Putting the system instructions + KB at the top increases cache hit probability, reducing latency and cost.

**Tradeoffs:**
- If KB grows too large, responses may slow down and costs rise.
- No semantic retrieval over large corpora.

**Future upgrade path (if needed):**
- Add embeddings + vector search (RAG) when KB becomes large or multi-document.
- Keep the same API contract; replace “context injection” with retrieval results.

---

## 8) Implementation Plan (Files + Diffs)

### A) New / Updated Files
1. `knowledgeBase.js`
2. `api/chat.js`
3. `src/components/ChatTab.tsx`
4. `src/assets/styles/ChatTab.scss`
5. `src/components/index.js`
6. `src/App.tsx`
7. `src/components/Navigation.tsx`
8. `vercel.json`

### B) Package Updates
- `package.json`: add dependency `openai`.

### C) Environment Variables
- `OPENAI_API_KEY` (required)
- `OPENAI_MODEL` (optional; default is in code)

---

## 9) Testing & Validation

### Local UI Tests
1. Chat renders and shows initial greeting.
2. Quick question buttons send messages correctly.
3. Switching between sections doesn’t clear messages.
4. Refresh page: messages should restore from sessionStorage.
5. Close browser tab/window and reopen: messages should be cleared (sessionStorage).

### API Tests
- Valid request returns `{ message: { role: "assistant", content } }`
- Missing messages array → 400
- Invalid role → 400
- Missing `OPENAI_API_KEY` → 500

### Guardrail Test (No hallucination)
Ask something not in KB:
- Expected: exact fallback message.

---

## 10) Operational Notes
- Monitor OpenAI usage in OpenAI dashboard.
- If traffic spikes:
  - Reduce max messages
  - Add rate limiting / bot protection
  - Consider switching to a cheaper model via `OPENAI_MODEL`

---

## 11) Open Questions (Optional)
- Do we want a small banner indicating “This agent answers only from my Knowledge Base”?
- Do we want a “Clear chat” button (manual reset) for the user?


## 12) TO-DOs
- Error response to be properly sent to UI
- maybe a simple error response will do
- backend setup on vercel
- update knowledge base(needs to be detailed)
