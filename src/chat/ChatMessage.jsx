// import { useEffect, useRef } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { cn } from "@/lib/utils";
// import "./ChatMessage.css";

// const ChatMessage = ({ role, content }) => {
//   const messageEndRef = useRef(null);

//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [content]);

//   return (
//     <div
//       className={cn(
//         "chat-message",
//         role === "assistant" && "chat-message-assistant"
//       )}
//       ref={messageEndRef}
//     >
//       <div className="chat-avatar">{role === "user" ? "U" : "AI"}</div>

//       <div className="chat-content markdown-body">
//         <ReactMarkdown
//           remarkPlugins={[remarkGfm]}
//           components={{
//             p: ({ children }) => <p className="chat-text">{children}</p>,
//             ul: ({ children }) => <ul className="chat-list">{children}</ul>,
//             li: ({ children }) => <li className="chat-list-item">{children}</li>,
//             strong: ({ children }) => <strong className="chat-bold">{children}</strong>,
//             h1: ({ children }) => <h1 className="chat-heading">{children}</h1>,
//             h2: ({ children }) => <h2 className="chat-heading">{children}</h2>,
//             h3: ({ children }) => <h3 className="chat-heading">{children}</h3>,
//           }}
//         >
//           {content}
//         </ReactMarkdown>
//       </div>
//     </div>
//   );
// };

// export default ChatMessage;
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "./ChatMessage.css";

// Icons (you can replace with lucide-react if you prefer)
const CopyIcon = () => (
  <span style={{ fontSize: "14px", opacity: 0.8 }}>📋</span>
);
const ThumbsUp = () => (
  <span style={{ fontSize: "16px" }}>👍</span>
);
const ThumbsDown = () => (
  <span style={{ fontSize: "16px" }}>👎</span>
);

const ChatMessage = ({ role, content, onFeedback }) => {
  const messageEndRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null); // "up" | "down"

  // Scroll into view
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [content]);

  // Copy message text
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Feedback
  const handleFeedback = (type) => {
    setFeedback(type);
    if (onFeedback) onFeedback({ message: content, feedback: type });
  };

  return (
    <div
      ref={messageEndRef}
      className={cn(
        "chat-message",
        role === "assistant" && "chat-message-assistant"
      )}
    >
      <div className="chat-avatar">{role === "user" ? "U" : "AI"}</div>

      <div className="chat-content-wrapper">
        <div className="chat-content">
          <p className="chat-text">{content}</p>
        </div>

        {/* Action Buttons: Copy + Feedback */}
        {role === "assistant" && (
          <div className="chat-actions">
            {/* Copy Button */}
            <button
              className="chat-btn copy-btn"
              onClick={handleCopy}
              title="Copy"
            >
              {copied ? "✔ Copied!" : <CopyIcon />}
            </button>

            {/* Thumbs Up */}
            <button
              className={`chat-btn thumb-btn ${feedback === "up" ? "active" : ""
                }`}
              onClick={() => handleFeedback("up")}
            >
              <ThumbsUp />
            </button>

            {/* Thumbs Down */}
            <button
              className={`chat-btn thumb-btn ${feedback === "down" ? "active" : ""
                }`}
              onClick={() => handleFeedback("down")}
            >
              <ThumbsDown />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
