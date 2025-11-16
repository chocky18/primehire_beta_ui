
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";
import "./ChatInput.css";

const ChatInput = ({
  onSend,
  onFileUpload, // optional upload callback
  disabled: externalDisabled = false,
  placeholder = "Ask me anything...",
}) => {
  const [input, setInput] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [dynamicPlaceholder, setDynamicPlaceholder] = useState(placeholder);
  const fileInputRef = useRef(null);

  // 🧠 React to JD Creator or Profile Matcher global states
  useEffect(() => {
    const updateLockState = () => {
      const jdActive = !!window.__JD_MODE_ACTIVE__;
      const matchActive = !!window.__PROFILE_MATCH_MODE_ACTIVE__;
      const locked = jdActive || matchActive;

      setIsLocked(locked);
      if (jdActive) {
        setDynamicPlaceholder("🧠 JD Creator active — please complete the flow...");
      } else if (matchActive) {
        setDynamicPlaceholder("🎯 Profile Matcher running — please wait...");
      } else {
        setDynamicPlaceholder(placeholder);
      }
    };

    // Initial check
    updateLockState();

    // Re-evaluate on global events
    window.addEventListener("jd_open", updateLockState);
    window.addEventListener("jd_close", updateLockState);
    window.addEventListener("jd_step_update", updateLockState);
    window.addEventListener("profile_match_start", updateLockState);
    window.addEventListener("profile_match_done", updateLockState);

    return () => {
      window.removeEventListener("jd_open", updateLockState);
      window.removeEventListener("jd_close", updateLockState);
      window.removeEventListener("jd_step_update", updateLockState);
      window.removeEventListener("profile_match_start", updateLockState);
      window.removeEventListener("profile_match_done", updateLockState);
    };
  }, [placeholder]);

  const handleSend = () => {
    if (input.trim() && !isLocked && !externalDisabled) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (!files?.length) return;
    if (onFileUpload) onFileUpload(Array.from(files));
    event.target.value = null; // reset file input
  };

  const openFilePicker = () => {
    if (!isLocked && !externalDisabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const fullyDisabled = externalDisabled || isLocked;

  return (
    <div className="chat-input-wrapper">
      <div className="chat-input-container">
        {/* 📎 Attachment */}
        <Button
          variant="ghost"
          size="icon"
          className="attach-btn"
          onClick={openFilePicker}
          disabled={fullyDisabled}
          title="Attach files"
        >
          <Paperclip />
        </Button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        {/* 💬 Input field */}
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={dynamicPlaceholder}
          disabled={fullyDisabled}
          className="chat-textarea"
          rows={1}
        />

        {/* 🚀 Send button */}
        <Button
          onClick={handleSend}
          disabled={!input.trim() || fullyDisabled}
          size="icon"
          className="send-btn"
          title="Send message"
        >
          <Send />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
