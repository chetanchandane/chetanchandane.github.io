# Ask Chetan – Backend setup

The chat view talks to **`/api/chat`**. If you see no reply or an error, the backend is not running or not reachable. Follow the steps below.

---

## 1. Set the API key

The backend uses **Gemini**. You need a key from [Google AI Studio](https://aistudio.google.com/apikey).

**Option A – Environment variable (recommended)**

```bash
export GEMINI_API_KEY=your_key_here
```

**Option B – `.env` in the project root**

Create a file `.env` (it’s in `.gitignore`) with:

```
GEMINI_API_KEY=your_key_here
```

If you use **Vercel**, set `GEMINI_API_KEY` in the project’s Environment variables in the dashboard.

---

## 2. Run the backend locally

You have two ways to run the API so the chat view gets responses.

### Option A – Local API server (good for daily dev)

1. **Install dependencies** (includes Express for the local server):

   ```bash
   npm install
   ```

2. **Start the API** (in a dedicated terminal):

   ```bash
   npm run api
   ```

   You should see: `Ask Chetan API running at http://localhost:3001`

3. **Start the React app** (in another terminal):

   ```bash
   npm start
   ```

   The app will proxy `/api/chat` to `localhost:3001`, so the chat will work.

4. **Restart the React app** after the first time you run `npm run api`, so the proxy is active (or start the API before `npm start`).

### Option B – Vercel CLI (matches production)

1. Install Vercel CLI: `npm i -g vercel`
2. In the project root, run:

   ```bash
   vercel dev
   ```

   This runs both the React app and the serverless `api/chat` handler. Set `GEMINI_API_KEY` in the environment (export or `.env`) before running.

---

## 3. Check that the backend is working

**Quick test (no UI):**

```bash
GEMINI_API_KEY=your_key node test-chat-api.js
```

You should see a short reply that mentions RIT for “Where does Chetan go to school?”.

**In the browser:**  
Open the Ask Chetan section, send a message. If the API is running and the key is set, you get a reply. If not, the chat will show an error (e.g. “Chat API is not running…”).

---

## 4. Deploy to Vercel (production)

1. Push your code and connect the repo to Vercel (or deploy with `vercel`).
2. In the Vercel project, go to **Settings → Environment variables** and add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** your Gemini API key
3. Redeploy so the function gets the new variable.

Then `https://your-app.vercel.app/api/chat` will be used by the chat view in production.

---

## Summary

| Situation              | What to do                                                                 |
|------------------------|----------------------------------------------------------------------------|
| Local dev, chat works  | Nothing; you already have API + key running.                               |
| “No reply” / API error | Start backend: `npm run api` in one terminal, `npm start` in another.      |
| Missing key            | Set `GEMINI_API_KEY` (export or `.env`).                                   |
| Production (Vercel)    | Set `GEMINI_API_KEY` in Vercel env vars and deploy.                        |
