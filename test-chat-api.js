/**
 * Local test for the Digital Twin API (Phase 1).
 * Run: GEMINI_API_KEY=your_key node test-chat-api.js
 * Success: "Where does Chetan go to school?" should yield an answer that includes "RIT".
 */

const testMessages = [
  { role: "user", content: "Where does Chetan go to school?" },
];

const req = {
  method: "POST",
  body: JSON.stringify({ messages: testMessages }),
};

const res = {
  statusCode: 200,
  _headers: {},
  setHeader(name, value) {
    this._headers[name] = value;
  },
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    if (this.statusCode === 200 && body.message?.content) {
      console.log("Response:", body.message.content);
      if (body.message.content.toLowerCase().includes("rit")) {
        console.log("\n✓ Success: Answer mentions RIT.");
      } else {
        console.log("\n? Check: Expected answer to mention RIT (Rochester Institute of Technology).");
      }
    } else {
      console.log("Status:", this.statusCode, "Body:", JSON.stringify(body, null, 2));
    }
  },
};

async function run() {
  const { default: handler } = await import("./api/chat.js");
  await handler(req, res);
}

run().catch((err) => {
  console.error("Handler error:", err);
  process.exit(1);
});
