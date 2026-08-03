import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import profilePic from "../assets/images/my-profile-pic.jpeg";
import "../assets/styles/ChatWidget.scss";

const STORAGE_KEY = "digital-twin-chat-v1";

const QUICK_QUESTIONS = [
  "What have you worked on recently?",
  "Tell me about your agentic systems experience.",
  "Which stack did you use at Excellus?",
];

const BACKEND_ERROR_MESSAGE =
  "Hey, interesting question! Looks like something went wrong — an error has occurred on the backend. My human self has been notified of this. Please email me at chetan.chandane2026@gmail.com if you'd like to discuss further.";

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
    // ignore storage errors
  }
}

type Props = { open: boolean; setOpen: (v: boolean) => void };

function ChatWidget({ open, setOpen }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadMessages());
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 220);
      return () => clearTimeout(t);
    }
  }, [open]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isTyping) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
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
          setMessages([...nextMessages, { role: "assistant", content: BACKEND_ERROR_MESSAGE }]);
          return;
        }
      } else {
        setMessages([...nextMessages, { role: "assistant", content: BACKEND_ERROR_MESSAGE }]);
        return;
      }

      if (!res.ok) {
        setMessages([...nextMessages, { role: "assistant", content: BACKEND_ERROR_MESSAGE }]);
        return;
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data?.message?.content ?? "No response.",
      };
      setMessages([...nextMessages, assistantMessage]);
    } catch {
      setMessages([...nextMessages, { role: "assistant", content: BACKEND_ERROR_MESSAGE }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <button
        className={`chat-fab${open ? " chat-fab--hidden" : ""}`}
        onClick={() => setOpen(true)}
        aria-label="Ask Chetan — open chat"
      >
        <AutoAwesomeIcon className="chat-fab__spark" />
        <span>Ask Chetan</span>
      </button>

      <div
        className={`chat-widget${open ? " chat-widget--open" : ""}`}
        role="dialog"
        aria-label="Ask Chetan chat"
        aria-hidden={!open}
      >
        <header className="chat-widget__top">
          <div className="chat-widget__id">
            <img src={profilePic} alt="Chetan" />
            <div>
              <strong>Ask Chetan</strong>
              <small><span className="chat-widget__dot" /> AI twin · online</small>
            </div>
          </div>
          <div className="chat-widget__actions">
            {messages.length > 0 && !isTyping && (
              <button className="chat-widget__clear" onClick={() => setMessages([])}>
                Clear
              </button>
            )}
            <button
              className="chat-widget__close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <CloseIcon />
            </button>
          </div>
        </header>

        <div className="chat-widget__body" ref={listRef}>
          {messages.length === 0 && !isTyping && (
            <div className="chat-msg chat-msg--assistant">
              <div className="chat-avatar"><img src={profilePic} alt="Chetan" /></div>
              <div className="chat-bubble chat-bubble--assistant">
                Hi! I'm Chetan's AI twin. Ask me about his background, experience, or projects —
                answers come only from his own knowledge base.
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
              {msg.role === "assistant" && (
                <div className="chat-avatar"><img src={profilePic} alt="Chetan" /></div>
              )}
              <div className={`chat-bubble chat-bubble--${msg.role}`}>
                {msg.role === "assistant" ? (
                  <div className="markdown-body"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === "user" && (
                <div className="chat-avatar chat-avatar--user"><PersonIcon /></div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="chat-msg chat-msg--assistant">
              <div className="chat-avatar"><img src={profilePic} alt="Chetan" /></div>
              <div className="chat-bubble chat-bubble--assistant chat-bubble--typing">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
        </div>

        {messages.length === 0 && (
          <div className="chat-widget__quick">
            {QUICK_QUESTIONS.map((q, i) => (
              <button key={i} type="button" onClick={() => sendMessage(q)} disabled={isTyping}>
                {q}
              </button>
            ))}
          </div>
        )}

        <form className="chat-widget__input" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask anything…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            aria-label="Message"
          />
          <button type="submit" disabled={isTyping || !input.trim()} aria-label="Send">
            <SendIcon />
          </button>
        </form>
      </div>
    </>
  );
}

export default ChatWidget;
