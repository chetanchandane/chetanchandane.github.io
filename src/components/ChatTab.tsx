import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import SendIcon from "@mui/icons-material/Send";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import mediumImg from "../assets/images/medium.png";
import profilePic from "../assets/images/my-profile-pic.jpeg";
import "../assets/styles/ChatTab.scss";

const STORAGE_KEY = "digital-twin-chat-v1";

const QUICK_QUESTIONS = [
  "What have you worked on recently?",
  "Tell me your experience with agentic systems.",
  "Which stack did you use at Excellus?",
];

const GMAIL_TO = "cc5831@g.rit.edu";
const GMAIL_SUBJECT = "Introduction — Let's connect";
const GMAIL_BODY = "Hi Chetan,\n\nI came across your portfolio and would like to connect.";
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(GMAIL_TO)}&subject=${encodeURIComponent(GMAIL_SUBJECT)}&body=${encodeURIComponent(GMAIL_BODY)}`;

const BACKEND_ERROR_MESSAGE =
  "Hey, interesting question! Looks like something went wrong — an error has occurred on the backend. My human self has been notified of this. Please email me if you'd like to discuss further.";

export type ChatMessage = { role: "user" | "assistant"; content: string };

function loadMessages(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: ChatMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // ignore quota or other storage errors
  }
}

function ChatTab() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadMessages());
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isTyping) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const contentType = res.headers.get("content-type") || "";
      let data: { message?: { content?: string }; error?: string } | null = null;
      if (contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          console.error("Chat API: invalid JSON response");
          setMessages([...nextMessages, { role: "assistant", content: BACKEND_ERROR_MESSAGE }]);
          return;
        }
      } else {
        const text = await res.text();
        console.error("Chat API error:", res.status, text?.slice(0, 200));
        setMessages([...nextMessages, { role: "assistant", content: BACKEND_ERROR_MESSAGE }]);
        return;
      }

      if (!res.ok) {
        console.error("Chat API error:", res.status, data?.error);
        setMessages([...nextMessages, { role: "assistant", content: BACKEND_ERROR_MESSAGE }]);
        return;
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data?.message?.content ?? "No response.",
      };
      setMessages([...nextMessages, assistantMessage]);
    } catch (err) {
      console.error("Chat API error:", err);
      setMessages([...nextMessages, { role: "assistant", content: BACKEND_ERROR_MESSAGE }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleClearChat = () => {
    if (isTyping) return;
    setMessages([]);
    setError(null);
  };

  return (
    <div id="ask-chetan" className="chat-tab">
      <div className="items-container">
        <div className="chat-tab-wrapper">
          <h1>Ask Chetan</h1>
          <p className="chat-tab-subtitle">
            Ask me about my background, experience, or projects. Answers are based only on my portfolio knowledge base.
          </p>

          <div className="chat-tab-main">
            <div className="chat-messages" ref={listRef}>
              {messages.length === 0 && !isTyping && (
                <div className="chat-empty">
                  <p>Send a message or pick a quick question below.</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`chat-message-row chat-message-row--${msg.role}`}>
                  {msg.role === "assistant" && (
                    <div className="chat-avatar chat-avatar--assistant">
                      <img src={profilePic} alt="Chetan" />
                    </div>
                  )}
                  <div className={`chat-bubble chat-bubble--${msg.role}`}>
                    {msg.role === "assistant" ? (
                      <div className="chat-bubble-content markdown-body">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="chat-bubble-content chat-bubble-content--text">
                        {msg.content}
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="chat-avatar chat-avatar--user">
                      <PersonIcon />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="chat-message-row chat-message-row--assistant">
                  <div className="chat-avatar chat-avatar--assistant">
                    <img src={profilePic} alt="Chetan" />
                  </div>
                  <div className="chat-bubble chat-bubble--assistant chat-bubble--typing">
                    <div className="chat-bubble-content">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-quick-questions">
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  className="chat-quick-btn"
                  onClick={() => handleQuickQuestion(q)}
                  disabled={isTyping}
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="chat-social-row">
              <div className="chat-social-links">
                <a
                  href="https://www.linkedin.com/in/chetanchandane"
                  target="_blank"
                  rel="noreferrer"
                  className="chat-social-link chat-social-link--linkedin"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
                <a
                  href="https://github.com/chetanchandane"
                  target="_blank"
                  rel="noreferrer"
                  className="chat-social-link chat-social-link--github"
                  aria-label="GitHub"
                >
                  <GitHubIcon />
                </a>
                <a
                  href="https://medium.com/@chetanchandane013"
                  target="_blank"
                  rel="noreferrer"
                  className="chat-social-link"
                  aria-label="Medium"
                >
                  <img src={mediumImg} alt="Medium" className="chat-social-medium-img" />
                </a>
                <a
                  href={GMAIL_COMPOSE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="chat-social-link chat-social-link--gmail"
                  aria-label="Email (Gmail)"
                >
                  <EmailIcon />
                </a>
              </div>
              {messages.length > 0 && (
                <button
                  type="button"
                  className="chat-clear-btn"
                  onClick={handleClearChat}
                  disabled={isTyping}
                  aria-label="Clear chat"
                >
                  Clear chat
                </button>
              )}
            </div>

            <form className="chat-input-row" onSubmit={handleSubmit}>
              <input
                type="text"
                className="chat-input"
                placeholder="Ask anything about my background or projects..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                aria-label="Message"
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={isTyping || !input.trim()}
                aria-label="Send"
              >
                <SendIcon />
              </button>
            </form>

            {error && (
              <div className="chat-error" role="alert">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatTab;
