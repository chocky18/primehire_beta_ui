import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import "./ChatMessage.css";

const ChatMessage = ({ role, content }) => {
  const messageEndRef = useRef(null);

  // 🔽 Auto-scroll to bottom when new message renders
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [content]);

  return (
    <div
      className={cn(
        "chat-message",
        role === "assistant" && "chat-message-assistant"
      )}
      ref={messageEndRef}
    >
      <div className="chat-avatar">{role === "user" ? "U" : "AI"}</div>
      <div className="chat-content">
        <p className="chat-text">{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;