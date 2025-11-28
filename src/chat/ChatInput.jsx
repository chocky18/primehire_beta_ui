import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, ChevronDown, Zap, ListTodo } from "lucide-react";
import "./ChatInput.css";

const ChatInput = ({
  onSend,
  onFileUpload,
  disabled: externalDisabled = false,
  placeholder = "Ask me anything...",
}) => {
  const [input, setInput] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [dynamicPlaceholder, setDynamicPlaceholder] = useState(placeholder);
  const [isCentered, setIsCentered] = useState(true);   // ⭐ default center
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [showTasksDropdown, setShowTasksDropdown] = useState(false);

  const fileInputRef = useRef(null);
  const featuresRef = useRef(null);
  const tasksRef = useRef(null);

  const features = [
    "ZohoBridge",
    "MailMind",
    "PrimeHire Brain",
    "Interview Bot",
    "LinkedIn Poster",
    "JD History",
    "Candidates Status"
  ];

  const tasks = [
    "JD Creator",
    "Profile Matcher",
    "Upload Resumes"
  ];

  /*  
  =========================================================
  ⭐ LISTEN FOR SIDEBAR BUTTON CLICK EVENT
  =========================================================
  */
  useEffect(() => {
    const moveInputDown = () => {
      setIsCentered(false);    // ⭐ Move input field to bottom
    };

    window.addEventListener("sidebar_item_clicked", moveInputDown);

    return () => {
      window.removeEventListener("sidebar_item_clicked", moveInputDown);
    };
  }, []);

  /*
  =========================================================
  JD & Profile Match Locking
  =========================================================
  */
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

    updateLockState();

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

  /*
  =========================================================
  Close dropdowns on outside click
  =========================================================
  */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (featuresRef.current && !featuresRef.current.contains(event.target)) {
        setShowFeaturesDropdown(false);
      }
      if (tasksRef.current && !tasksRef.current.contains(event.target)) {
        setShowTasksDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    if (input.trim() && !isLocked && !externalDisabled) {
      onSend(input);
      setInput("");
      setIsCentered(false);   // user typed → push down
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
    event.target.value = null;
  };

  const openFilePicker = () => {
    if (!isLocked && !externalDisabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFeatureSelect = (feature) => {
    setInput(`Use ${feature}: `);
    setShowFeaturesDropdown(false);
  };

  const handleTaskSelect = (task) => {
    setInput(`Start ${task}: `);
    setShowTasksDropdown(false);
  };

  const fullyDisabled = externalDisabled || isLocked;

  return (
    <div className={isCentered ? "chat-input-center" : "chat-input-bottom"}>
      <div className="chat-input-container">

        {/* Attach File */}
        <Button
          variant="ghost"
          size="icon"
          className="attach-btn"
          onClick={openFilePicker}
          disabled={fullyDisabled}
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        {/* Input wrapper */}
        <div className="input-with-panel">
          <div className="dropdown-buttons-row">

            {/* Features */}
            <div className="dropdown-wrapper" ref={featuresRef}>
              <button
                className="dropdown-trigger"
                onClick={() => {
                  setShowFeaturesDropdown(!showFeaturesDropdown);
                  setShowTasksDropdown(false);
                }}
                disabled={fullyDisabled}
              >
                <Zap className="w-4 h-4" />
                <span>Features</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showFeaturesDropdown && !fullyDisabled && (
                <div className="dropdown-menu">
                  {features.map((feature, index) => (
                    <button
                      key={index}
                      className="dropdown-item"
                      onClick={() => handleFeatureSelect(feature)}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tasks */}
            <div className="dropdown-wrapper" ref={tasksRef}>
              <button
                className="dropdown-trigger"
                onClick={() => {
                  setShowTasksDropdown(!showTasksDropdown);
                  setShowFeaturesDropdown(false);
                }}
                disabled={fullyDisabled}
              >
                <ListTodo className="w-4 h-4" />
                <span>Tasks</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showTasksDropdown && !fullyDisabled && (
                <div className="dropdown-menu">
                  {tasks.map((task, index) => (
                    <button
                      key={index}
                      className="dropdown-item"
                      onClick={() => handleTaskSelect(task)}
                    >
                      {task}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Textarea */}
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={dynamicPlaceholder}
            disabled={fullyDisabled}
            className="chat-textarea"
            rows={1}
          />
        </div>

        {/* Send */}
        <Button
          onClick={handleSend}
          disabled={!input.trim() || fullyDisabled}
          size="icon"
          className="send-btn"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;