import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "./ChatMessage.css";

/* ------------------------------------------
   Modern SVG Icons (ChatGPT-style)
--------------------------------------------*/
const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none">
    <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="1.6" />
    <rect x="3" y="3" width="13" height="13" rx="2" strokeWidth="1.6" opacity="0.5" />
  </svg>
);

const ThumbUp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none">
    <path
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3h-4z"
    />
  </svg>
);

const ThumbDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none">
    <path
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 15v4a3 3 0 0 0 3 3l4-9V2H6a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h4z"
    />
  </svg>
);

const ChatMessage = ({ role, content, onFeedback, onTriggerFeature }) => {
  const messageEndRef = useRef(null);
  const [copiedf, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  /* Smooth scroll to bottom */
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [content]);

  /* Feature auto-trigger (optional logic retained) */
  useEffect(() => {
    if (!content || role !== "assistant") return;

    const clean = content.replace(/[*_~`]/g, "");
    const match = clean.match(/\b(JDHistory)\b/i);

    if (match && onTriggerFeature) {
      onTriggerFeature("JDHistory");
    }
  }, [content]);

  /* Copy text */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  /* Feedback handler */
  const handleFeedback = (type) => {
    setFeedback(type);
    onFeedback?.({ message: content, feedback: type });
  };

  return (
    <div
      ref={messageEndRef}
      className={cn(
        "chat-message",
        role === "assistant" ? "chat-message-assistant" : "chat-message-user"
      )}
    >
      <div className="chat-message-inner">
        <div className="chat-avatar">{role === "user" ? "U" : "AI"}</div>

        <div className="chat-content-wrapper">
          <div className="chat-content">
            <p className="chat-text">{content}</p>
          </div>

          {/* Actions under assistant messages */}
          {role === "assistant" && (
            <div className="chat-actions">
              <button className="chat-btn copy-btn" onClick={handleCopy}>
                {copiedf ? "✔ Copied" : <CopyIcon />}
              </button>

              <button
                className={`chat-btn thumb-btn ${feedback === "up" ? "active" : ""}`}
                onClick={() => handleFeedback("up")}
              >
                <ThumbUp />
              </button>

              <button
                className={`chat-btn thumb-btn ${feedback === "down" ? "active" : ""}`}
                onClick={() => handleFeedback("down")}
              >
                <ThumbDown />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
