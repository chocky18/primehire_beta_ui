// 📁 src/components/ChatInput.jsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, ChevronDown, Zap, ListTodo, Mic } from "lucide-react";
import "./ChatInput.css";

/**
 * ChatInput with:
 * - locked prefixes for tasks
 * - prompt chips that ALWAYS insert prefixed text
 * - inline auto-suggestions dropdown (ChatGPT-like)
 * - mic (speech-to-text) button (Web Speech API)
 */

const ChatInput = ({
  onSend,
  onFileUpload,
  disabled: externalDisabled = false,
  placeholder = "Ask me anything...",
}) => {
  const [input, setInput] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [dynamicPlaceholder, setDynamicPlaceholder] = useState(placeholder);
  const [isCentered, setIsCentered] = useState(true);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [showTasksDropdown, setShowTasksDropdown] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [micActive, setMicActive] = useState(false);

  const fileInputRef = useRef(null);
  const featuresRef = useRef(null);
  const tasksRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // features & tasks
  const features = [
    "ZohoBridge",
    "MailMind",
    "PrimeHire Brain",
    "Interview Bot",
    "LinkedIn Poster",
    "JD History",
    "Candidates Status",
  ];

  const tasks = ["JD Creator", "Profile Matcher", "Upload Resumes"];

  // prompt chips content (prefixed strings)
  const promptChips = {
    "JD Creator": [
      {
        label: "✨ Senior React Developer @ PrimeHire",
        text:
          "Start JD Creator: Create a JD for a Senior React Developer at PrimeHire — 5 years experience, Bangalore, React, Redux, TypeScript.",
      },
      {
        label: "🤖 AI Engineer @ Nirmata",
        text:
          "Start JD Creator: Create a JD for an AI Engineer at Nirmata Neurotech — 3+ years experience, Python, LLMs, Vector DBs, Transformers, Hyderabad.",
      },
      {
        label: "⚡ Node.js Backend @ InnovateX",
        text:
          "Start JD Creator: Create a JD for a Node.js Backend Developer at InnovateX — API development, MongoDB, Postgres, AWS, Remote.",
      },
      {
        label: "📱 Flutter Developer @ PixelApps",
        text:
          "Start JD Creator: Create a JD for a Flutter Mobile Developer at PixelApps — 2–3 years experience, Flutter, Dart, Firebase, Remote.",
      },
      {
        label: "⚙️ DevOps Engineer @ CloudNova",
        text:
          "Start JD Creator: Create a JD for a DevOps Engineer at CloudNova — AWS, Kubernetes, CI/CD, 4+ years experience, Bangalore.",
      },
    ],
    "Profile Matcher": [
      {
        label: "🔍 React Developer",
        text:
          "Start Profile Matcher: React Developer — 2–4 years experience, strong in React, JavaScript, API integrations.",
      },
      {
        label: "🤖 AI Engineer",
        text:
          "Start Profile Matcher: AI Engineer — 3+ YOE, Python, Transformers, LLMs, Vector DBs.",
      },
      {
        label: "⚡ Node.js Backend",
        text:
          "Start Profile Matcher: Node.js Backend Developer — REST APIs, MongoDB, Postgres, AWS.",
      },
    ],
    "Upload Resumes": [
      {
        label: "📤 Upload All Resumes",
        text: "Start Upload Resumes: Upload all candidate resumes for bulk processing.",
      },
      {
        label: "📎 Upload Shortlisted",
        text: "Start Upload Resumes: Upload shortlisted candidate resumes for screening.",
      },
      {
        label: "🗂 Bulk Resume Extraction",
        text: "Start Upload Resumes: Upload multiple resumes to extract skills and experience.",
      },
    ],
  };

  /* -----------------------
     Locked prefix helpers
  ------------------------*/
  const getPrefix = (task = activeTask) => {
    if (task === "JD Creator") return "Start JD Creator: ";
    if (task === "Profile Matcher") return "Start Profile Matcher: ";
    if (task === "Upload Resumes") return "Start Upload Resumes: ";
    return "";
  };

  // Restore/maintain prefix when user types or paste
  const enforcePrefix = (value) => {
    const prefix = getPrefix();
    if (!prefix) return value;
    if (!value.startsWith(prefix)) {
      // If user pasted a whole sentence starting with the short text (without prefix),
      // remove any stray duplicate prefix-like fragments and restore proper prefix.
      const cleaned = value.replace(/^Start\s+(JD Creator:|Profile Matcher:|Upload Resumes:)/i, "").trimStart();
      return prefix + cleaned;
    }
    return value;
  };

  // Put caret at end of input
  const focusAndMoveCaretToEnd = () => {
    requestAnimationFrame(() => {
      const t = textareaRef.current;
      if (!t) return;
      t.focus();
      const len = t.value.length;
      t.setSelectionRange(len, len);
    });
  };

  // Set input (used by chips) and focus textarea at end
  const setInputAndFocus = (val) => {
    setInput(val);
    setTimeout(() => focusAndMoveCaretToEnd(), 30);
  };

  /* -----------------------
     Auto-suggestions logic
     - simple client-side list
     - shows when user types after prefix
  ------------------------*/
  const suggestionPool = [
    "React",
    "Redux",
    "TypeScript",
    "Node.js",
    "API",
    "AWS",
    "Docker",
    "Kubernetes",
    "Python",
    "PyTorch",
    "TensorFlow",
    "Transformers",
    "LLMs",
    "Vector DB",
    "Postgres",
    "MongoDB",
    "Remote",
    "Bangalore",
    "Hyderabad",
    "Full-time",
    "Contract",
  ];

  const updateSuggestions = (currentVal) => {
    const prefix = getPrefix();
    const after = prefix ? currentVal.slice(prefix.length) : currentVal;
    const token = after.trim().split(/\s+/).pop() || "";
    if (!token || token.length < 2) {
      setSuggestions([]);
      setSuggestionsVisible(false);
      return;
    }
    const q = token.toLowerCase();
    const filtered = suggestionPool.filter((s) => s.toLowerCase().includes(q)).slice(0, 6);
    setSuggestions(filtered);
    setSuggestionsVisible(filtered.length > 0);
  };

  const acceptSuggestion = (sugg) => {
    const prefix = getPrefix();
    const cur = textareaRef.current;
    if (!cur) {
      // fallback: append
      setInput((prev) => enforcePrefix(prev) + " " + sugg);
      focusAndMoveCaretToEnd();
      return;
    }

    // insert at caret (after prefix enforcement)
    const start = Math.max(cur.selectionStart, prefix.length);
    const end = Math.max(cur.selectionEnd, prefix.length);
    const before = input.slice(0, start);
    const after = input.slice(end);
    const separator = before.endsWith(" ") || sugg.startsWith(" ") ? "" : " ";
    const newVal = before + separator + sugg + (after.startsWith(" ") ? after : " " + after);
    const enforced = enforcePrefix(newVal);
    setInput(enforced);

    // set caret to just after inserted suggestion
    setTimeout(() => {
      const pos = before.length + separator.length + sugg.length;
      cur.focus();
      cur.setSelectionRange(pos, pos);
      updateSuggestions(enforced);
    }, 10);
  };

  /* -----------------------
     Mic (SpeechRecognition)
  ------------------------*/
  const startMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const rec = new SpeechRecognition();
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.continuous = false;

    rec.onstart = () => {
      setMicActive(true);
    };

    rec.onresult = (ev) => {
      const transcript = Array.from(ev.results)
        .map((r) => r[0])
        .map((r) => r.transcript)
        .join(" ")
        .trim();

      if (!transcript) return;

      // append transcript to input (after prefix)
      const prefix = getPrefix();
      let base = input;
      if (!base.startsWith(prefix)) base = prefix;
      if (base.endsWith(" ") || transcript.startsWith(" ")) {
        setInput(base + transcript);
      } else {
        setInput(base + " " + transcript);
      }

      setTimeout(() => focusAndMoveCaretToEnd(), 20);
    };

    rec.onerror = (e) => {
      console.error("Speech rec error:", e);
      setMicActive(false);
    };

    rec.onend = () => {
      setMicActive(false);
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch (err) {
      console.warn("Mic start error:", err);
    }
  };

  const stopMic = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    rec.stop();
    recognitionRef.current = null;
    setMicActive(false);
  };

  const toggleMic = () => {
    if (micActive) stopMic();
    else startMic();
  };

  /* -----------------------
     Event Effects
  ------------------------*/
  useEffect(() => {
    const moveInputDown = () => setIsCentered(false);
    window.addEventListener("sidebar_item_clicked", moveInputDown);
    return () => window.removeEventListener("sidebar_item_clicked", moveInputDown);
  }, []);

  useEffect(() => {
    const updateLockState = () => {
      const jdActive = !!window.__JD_MODE_ACTIVE__;
      const matchActive = !!window.__PROFILE_MATCH_MODE_ACTIVE__;
      const locked = jdActive || matchActive;
      setIsLocked(locked);
      if (jdActive) setDynamicPlaceholder("🧠 JD Creator active — please complete the flow...");
      else if (matchActive) setDynamicPlaceholder("🎯 Profile Matcher running — please wait...");
      else setDynamicPlaceholder(placeholder);
    };

    updateLockState();

    const events = ["jd_open", "jd_close", "jd_step_update", "profile_match_start", "profile_match_done"];
    events.forEach((e) => window.addEventListener(e, updateLockState));
    return () => events.forEach((e) => window.removeEventListener(e, updateLockState));
  }, [placeholder]);

  useEffect(() => {
    const handleClickOutside = (ev) => {
      if (featuresRef.current && !featuresRef.current.contains(ev.target)) setShowFeaturesDropdown(false);
      if (tasksRef.current && !tasksRef.current.contains(ev.target)) setShowTasksDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // update suggestions when input changes
  useEffect(() => {
    updateSuggestions(input);
  }, [input, activeTask]);

  /* -----------------------
     Handlers: send, file, features, tasks
  ------------------------*/
  const handleSend = () => {
    if (!input.trim() || isLocked || externalDisabled) return;
    onSend(input);
    setInput("");
    setActiveTask(null);
    setSuggestionsVisible(false);
    setIsCentered(false);
  };

  const handleKeyDown = (e) => {
    const prefix = getPrefix();
    // block backspace/delete into prefix
    if ((e.key === "Backspace" || e.key === "Delete") && textareaRef.current) {
      const pos = textareaRef.current.selectionStart;
      if (pos <= prefix.length) {
        e.preventDefault();
        return;
      }
    }

    // press Enter to send (unless shift+enter)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }

    // arrow down to open suggestions navigation (basic)
    if (e.key === "ArrowDown" && suggestionsVisible) {
      e.preventDefault();
      // blur/focus to allow mouse selection; we keep simple: move focus out then back
      // more complex keyboard nav can be added
    }
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (!files?.length) return;
    if (onFileUpload) onFileUpload(Array.from(files));
    event.target.value = null;
  };

  const handleFeatureSelect = (feature) => {
    setInput(`Use ${feature}: `);
    setShowFeaturesDropdown(false);
    focusAndMoveCaretToEnd();
  };

  const handleTaskSelect = (task) => {
    setShowTasksDropdown(false);
    setActiveTask(task);
    // set prefixed empty prompt
    const prefix = getPrefix(task);
    setInput(prefix);
    setTimeout(() => focusAndMoveCaretToEnd(), 50);
  };

  /* helper: getPrefix by explicit task */


  /* allow chip click which ensures prefix & full example inserted */
  const handleChipClick = (task, text) => {
    setActiveTask(task);
    // text already contains prefix, but enforce just in case
    const enforced = enforcePrefix(text);
    setInput(enforced);
    setTimeout(() => focusAndMoveCaretToEnd(), 40);
  };

  const fullyDisabled = externalDisabled || isLocked;

  return (
    <div className={isCentered ? "chat-input-center" : "chat-input-bottom"}>
      <div className="chat-input-container">
        {/* left icons */}
        <Button
          variant="ghost"
          size="icon"
          className="attach-btn"
          onClick={() => fileInputRef.current?.click()}
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

        {/* main panel */}
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
              {showFeaturesDropdown && (
                <div className="dropdown-menu">
                  {features.map((f, i) => (
                    <button key={i} className="dropdown-item" onClick={() => handleFeatureSelect(f)}>
                      {f}
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
              {showTasksDropdown && (
                <div className="dropdown-menu">
                  {tasks.map((t, i) => (
                    <button key={i} className="dropdown-item" onClick={() => handleTaskSelect(t)}>
                      {t}
                    </button>
                  ))}
                </div>
              )}

            </div>
          </div>
          {/* Active Task Pill Indicator
          {activeTask && (
            <div className="active-task-pill">
              {activeTask === "JD Creator" && "🧠 JD Creator"}
              {activeTask === "Profile Matcher" && "🎯 Profile Matcher"}
              {activeTask === "Upload Resumes" && "📄 Upload Resumes"}

              <button
                className="pill-close"
                onClick={() => {
                  setActiveTask(null);
                  setInput(""); // remove forced prefix
                }}
              >
                ✕
              </button>
            </div>
          )} */}


          {/* Prompt chips (task-specific) */}
          <div className="chips-row">
            {activeTask && (promptChips[activeTask] || []).map((c, idx) => (
              <div
                key={idx}
                className="prompt-chip"
                onClick={() => handleChipClick(activeTask, c.text)}
              >
                {c.label}
              </div>
            ))}
          </div>

          {/* textarea + suggestions */}
          <div style={{ position: "relative", width: "100%" }}>
            {activeTask && (
              <div className="floating-prefix">
                🟢 {activeTask} Active —
              </div>
            )}
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                const enforced = enforcePrefix(e.target.value);
                setInput(enforced);
              }}
              onKeyDown={handleKeyDown}
              onClick={(e) => {
                const prefix = getPrefix();
                const t = textareaRef.current;
                if (t && t.selectionStart < prefix.length) {
                  t.setSelectionRange(prefix.length, prefix.length);
                }
              }}
              placeholder={
                activeTask === "Profile Matcher"
                  ? "Describe the role to match… (Example: React Developer with 2–4 YOE, strong in React + JS)"
                  : activeTask === "JD Creator"
                    ? "Create a JD… (Example: Senior React Developer, 5 YOE, Bangalore, Company: PrimeHire, Skills: React, TS)"
                    : dynamicPlaceholder
              }
              disabled={fullyDisabled}
              className="chat-textarea"
              rows={1}
              onFocus={() => updateSuggestions(input)}
            />

            {/* suggestions dropdown */}
            {suggestionsVisible && !fullyDisabled && (
              <div className="suggestions-dropdown">
                {suggestions.map((s, i) => (
                  <div key={i} className="suggestion-item" onMouseDown={() => acceptSuggestion(s)}>
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* right icons: mic + send */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMic}
            disabled={fullyDisabled}
            className={`mic-btn ${micActive ? "active" : ""}`}
          >
            <Mic className="w-5 h-5" />
          </Button>

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
    </div>
  );
};

export default ChatInput;
