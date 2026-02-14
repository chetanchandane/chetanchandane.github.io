/**
 * Local API server for development. Run with: npm run api
 * Forwards /api/chat to the same handler used on Vercel.
 * Set GEMINI_API_KEY in .env or export it.
 */
require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(express.json());

async function start() {
  const { default: chatHandler } = await import("./api/chat.js");
  app.post("/api/chat", (req, res) => chatHandler(req, res));
  app.listen(PORT, "127.0.0.1", () => {
    console.log(`Ask Chetan API running at http://localhost:${PORT}`);
    console.log(`  POST /api/chat`);
    if (!process.env.GEMINI_API_KEY) {
      console.warn("  Warning: GEMINI_API_KEY is not set. Requests will fail with 500.");
    }
  });
}

start();
