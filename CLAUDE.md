# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal portfolio site (Create React App + TypeScript) for Chetan Chandane, whose standout feature is **"Ask Chetan"** — an AI "digital twin" chat that answers visitor questions in the first person, grounded only in a hand-written knowledge base. Production is hosted on Vercel (`chetanchandane.vercel.app`).

## Commands

```bash
npm install            # install deps

# Frontend (CRA dev server on :3000, proxies /api -> :3001)
npm start

# Chat backend (local Express server on :3001; needs ANTHROPIC_API_KEY)
npm run api

npm run build          # production build into ./build
npm test               # react-scripts test (Jest, watch mode)
CI=true npm test       # run tests once, no watch
npm test -- src/App.test.tsx          # run a single test file
npm test -- -t "renders learn react"  # run tests matching a name pattern

# Direct backend smoke test (no UI), expects a reply mentioning "RIT"
ANTHROPIC_API_KEY=your_key node test-chat-api.js

# Production-like run (frontend + serverless /api in one process)
vercel dev
```

To develop the chat locally you need **two terminals**: `npm run api`, then `npm start`. The CRA dev server proxies `/api/chat` to `localhost:3001` via the `"proxy"` field in `package.json` — if you start `npm start` *before* the API, restart it so the proxy attaches.

## Environment

- `ANTHROPIC_API_KEY` (required) — Anthropic Console key. Set via shell `export` or a `.env` file in the project root (gitignored). On Vercel, set it in project env vars.
- `ANTHROPIC_MODEL` (optional) — defaults to `claude-haiku-4-5`.
- `API_PORT` (optional) — local API port, defaults to `3001`.

## Architecture

### Frontend
Standard CRA single-page app. `src/App.tsx` renders a fixed section order inside a `FadeIn` wrapper: `Main → ChatTab → Expertise → Timeline → Project → Contact`, with `Navigation` and `Footer` outside it. Dark/light mode is a single `useState` in `App.tsx` toggled to the `dark-mode`/`light-mode` class on the root container. Components live in `src/components/` (re-exported from `src/components/index.js`); per-component SCSS lives separately in `src/assets/styles/`.

### Chat (the non-obvious part)
The chat is a small client/server pipeline with **one handler shared across two runtimes**:

- **`src/components/ChatTab.tsx`** — chat UI. Keeps the full message array in React state, persists it to `sessionStorage` (`digital-twin-chat-v1`), and `POST`s the whole array to `/api/chat`. Assistant replies render as Markdown via `react-markdown`. On any backend error it shows a friendly canned message rather than surfacing the error. Has a mobile-expanded mode below the 768px breakpoint.
- **`api/chat.js`** — the actual chat handler (a Vercel serverless function, default export `handler(req, res)`). Validates the request (≤50 messages, ≤8000 chars each, roles `user`/`assistant`), passes `user`/`assistant` messages straight through, and calls `@anthropic-ai/sdk` `messages.create` (model `claude-haiku-4-5`) with `temperature: 0.2`. The persona + formatting rules + injected knowledge base form the `system` prompt. If the model can't answer from the knowledge base, it is instructed to return an exact `FALLBACK_MESSAGE`.
- **`api-server.js`** — local dev wrapper. Dynamically `import()`s the *same* `api/chat.js` and mounts it at `POST /api/chat` on Express. This is why local and production behavior stay in sync: **edit the handler once.**
- **`knowledgeBase.js`** — the single source of truth for everything the digital twin knows (Markdown string). To change what the chat says about background/experience/projects, edit this file. To change tone/persona/formatting rules, edit the `DIGITAL_TWIN_SYSTEM` prompt in `api/chat.js`.

### Module system split (gotcha)
The repo root is **CommonJS** (`api-server.js` uses `require`, then `await import()` to load the ESM handler; `knowledgeBase.js` uses `module.exports`). The **`api/` directory is ESM** — `api/package.json` is just `{ "type": "module" }`, so `api/chat.js` uses `import`/`export` and bridges to the CommonJS `knowledgeBase.js` via `createRequire`. Keep new files on the correct side of this boundary.

## Deployment

Production is **Vercel**: `vercel.json` rewrites `/api/*` to the serverless functions and everything else to `index.html` (SPA fallback). A `.github/workflows/static.yml` GitHub Pages workflow and a `gh-pages` deploy script also exist, but the live site and chat backend run on Vercel.

## Reference docs in this repo

- `BACKEND.md` — detailed chat backend setup / troubleshooting.
- `PRD.md` — product requirements for the "Ask Chetan" feature.
- `README.md` — template setup and GitHub Pages deploy instructions.
