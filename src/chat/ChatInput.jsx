import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, ChevronDown, Zap, ListTodo, Mic } from "lucide-react";
import "./ChatInput.css";
import "./ChatInput.responsive.css";

const ChatInput = ({
  onSend,
  onFileUpload,
  placeholder = "Ask PrimeHire anything…",
  activeTask: propActiveTask = null,
  forceShowChips = false,
}) => {
  const [input, setInput] = useState("");
  const [showTasksDropdown, setShowTasksDropdown] = useState(true);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ============================================================
     ⭐ INTERNAL TOKEN MAPPING (FRIENDLY → INTERNAL)
  ============================================================ */
  const internalKeyFor = {
    // Main tasks
    "JD Creator": "JD Creator",
    "Profile Matcher": "Profile Matcher",
    "Upload Resumes": "Upload Resumes",

    // Interview Bot (friendly + compact)
    "Interview Bot": "InterviewBot",
    "InterviewBot": "InterviewBot",

    // History modules
    "JD History": "JDHistory",
    "Match History": "ProfileMatchHistory",
    "Candidate Status": "CandidateStatus",

    // Feature tools
    ZohoBridge: "ZohoBridge",
    MailMind: "MailMind",
    LinkedInPoster: "LinkedInPoster",
    PrimeHireBrain: "PrimeHireBrain",
  };

  const tasks = [
    "JD Creator",
    "Profile Matcher",
    "Upload Resumes",
    "Interview Bot", // UI friendly name
    "JD History",
    "Match History",
    "Candidate Status",
  ];

  const features = [
    "ZohoBridge",
    "MailMind",
    "LinkedInPoster",
    "PrimeHireBrain",
    "Interview Bot",
  ];

  /* ============================================================
     ⭐ PROMPT CHIPS (QUICK ACTIONS)
  ============================================================ */
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
          "Start JD Creator: Create a JD for an AI Engineer at Nirmata Neurotech — 3+ years experience, Hyderabad, Python, LLMs, Vector DBs.",
      },
    ],

    "Profile Matcher": [
      {
        label: "🔍 React Developer",
        text:
          "Start Profile Matcher: React Developer — 2–4 years experience, strong in React, JavaScript, APIs.",
      },
      {
        label: "🤖 Generative AI Engineer",
        text:
          "Start Profile Matcher: Generative AI Engineer — 4–6 years experience, strong in LLMs, RAG pipelines, multi-agent systems, vector databases (Pinecone/Chroma), FastAPI, AWS, and end-to-end AI deployment.",
      },
      {
        label: "🧩 Full-Stack Engineer",
        text:
          "Start Profile Matcher: Full-Stack Engineer — React, Node.js, PostgreSQL, Docker, 3–5 years experience.",
      },

      {
        label: "📊 Data Engineer",
        text:
          "Start Profile Matcher: Data Engineer — Python, SQL, Airflow, Spark, ETL pipelines, 4+ years experience.",
      },

      {
        label: "📱 Mobile App Developer",
        text:
          "Start Profile Matcher: Mobile App Developer — React Native or Flutter, REST APIs, CI/CD, 2–5 years experience.",
      }

    ],

    "Upload Resumes": [
      {
        label: "📤 Upload All Resumes",
        text: "Start Upload Resumes: Upload all candidate resumes for bulk processing.",
      },
      {
        label: "🗂 Bulk Extract",
        text:
          "Start Upload Resumes: Bulk extract skills and experience from multiple resumes.",
      },
    ],

    InterviewBot: [
      {
        label: "🎤 Quick Candidate Screen",
        text:
          "Start InterviewBot: Run a 5-min voice screening for the candidate — focus on communication and problem solving.",
      },
      {
        label: "🎥 Full Video Interview",
        text:
          "Start InterviewBot: Run a full video interview simulation — include technical and behavioral questions.",
      },
    ],

    "JD History": [
      { label: "🕘 Recent JDs", text: "Show JDHistory: Fetch last 10 job descriptions." },
    ],

    "Match History": [
      { label: "📈 Last Matches", text: "Show ProfileMatchHistory: recent match runs." },
    ],

    "Candidate Status": [
      {
        label: "📌 Candidate Overview",
        text: "Show CandidateStatus: Overview of candidate pipeline.",
      },
    ],

    /* ⭐ FEATURE CHIP SETS ⭐ */
    ZohoBridge: [
      {
        label: "🔗 Push Candidates to Zoho",
        text: "Start ZohoBridge: Sync and push selected candidates into the Zoho Recruit pipeline.",
      },
      {
        label: "📥 Import from Zoho",
        text: "Start ZohoBridge: Import all open job requirements from Zoho.",
      },
    ],

    MailMind: [
      {
        label: "✉️ Cold Email Sequence",
        text: "Start MailMind: Generate a 3-step cold email outreach sequence for hiring React developers.",
      },
      {
        label: "📧 Email Personalization",
        text: "Start MailMind: Personalize email content for candidate engagement.",
      },
    ],

    LinkedInPoster: [
      {
        label: "📢 Post Job Update",
        text: "Start LinkedInPoster: Create a LinkedIn post announcing hiring for a Backend Developer.",
      },
      {
        label: "🚀 Brand Update",
        text: "Start LinkedInPoster: Draft a LinkedIn post updating followers about PrimeHire's latest AI features.",
      },
    ],

    PrimeHireBrain: [
      {
        label: "🧠 Smart Research",
        text: "Start PrimeHireBrain: Analyze hiring trends for Software Engineers in India.",
      },
      {
        label: "📊 Insights",
        text: "Start PrimeHireBrain: Provide insights on why our JD isn't getting enough applicants.",
      },
    ],
  };

  /* ============================================================
     ⭐ PREFIX BUILDER
  ============================================================ */
  const getPrefix = (task = activeTask) => {
    if (!task) return "";

    const map = {
      "JD Creator": "Start JD Creator: ",
      "Profile Matcher": "Start Profile Matcher: ",
      "Upload Resumes": "Start Upload Resumes: ",
      InterviewBot: "Start InterviewBot: ",

      ZohoBridge: "Start ZohoBridge: ",
      MailMind: "Start MailMind: ",
      LinkedInPoster: "Start LinkedInPoster: ",
      PrimeHireBrain: "Start PrimeHireBrain: ",
    };

    return map[task] || "";
  };

  const enforcePrefix = (value) => {
    const prefix = getPrefix(activeTask);
    if (!prefix) return value;
    if (!value.startsWith(prefix)) return prefix + value.trimStart();
    return value;
  };

  /* ============================================================
     ⭐ SUGGESTIONS
  ============================================================ */
  const suggestionPool = [
    "React",
    "Redux",
    "TypeScript",
    "Node.js",
    "API",
    "AWS",
    "MongoDB",
    "Remote",
    "Hyderabad",
    "Bangalore",
    "Python",
    "Transformers",
    "LLMs",
  ];

  const updateSuggestions = (value) => {
    const prefix = getPrefix(activeTask);
    const actual = prefix ? value.slice(prefix.length) : value;

    if (actual.length < 2) {
      setSuggestionsVisible(false);
      return;
    }

    const filtered = suggestionPool.filter((w) =>
      w.toLowerCase().includes(actual.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 6));
    setSuggestionsVisible(true);
  };

  const acceptSuggestion = (word) => {
    setInput((prev) => {
      const prefix = getPrefix(activeTask);
      const next = prev.trim() ? prev + " " + word : prefix + word;
      setSuggestionsVisible(false);
      return next;
    });
  };

  /* ============================================================
     ⭐ HANDLE CHIP CLICK
  ============================================================ */
  const handleChipClick = (taskFriendly, text) => {
    const internal = internalKeyFor[taskFriendly] || taskFriendly;
    setActiveTask(internal);
    setInput(enforcePrefix(text));
  };

  /* ============================================================
     ⭐ SYNC WITH PARENT TASK
  ============================================================ */
  useEffect(() => {
    if (propActiveTask) {
      const internal = internalKeyFor[propActiveTask] || propActiveTask;
      setActiveTask(internal);
      setInput(getPrefix(internal));
    }
  }, [propActiveTask]);

  /* ============================================================
     ⭐ SEND MESSAGE
  ============================================================ */
  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setInput("");
    setActiveTask(null);
  };

  /* ============================================================
     ⭐ RENDER
  ============================================================ */
  const chipFriendlyKey =
    Object.keys(internalKeyFor).find((k) => internalKeyFor[k] === activeTask) ||
    activeTask;

  return (
    <div className="chat-input-wrapper">
      <div className="ci-shell">

        {/* LEFT: FILE UPLOAD */}
        <button
          className="ci-icon-btn ci-file-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={(e) => onFileUpload?.(Array.from(e.target.files))}
        />

        {/* CENTER */}
        <div className="ci-center">

          {/* TOP ROW: FEATURES + TASKS */}
          <div className="ci-top-row">

            {/* FEATURE DROPDOWN */}
            <div className="ci-dropdown-wrapper">
              <button
                className="ci-dropdown-trigger"
                onClick={() => {
                  setShowFeaturesDropdown((s) => !s);
                  setShowTasksDropdown(false);
                }}
              >
                <Zap className="w-4 h-4" />
                <span>Features</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showFeaturesDropdown && (
                <div className="ci-dropdown-menu">
                  {features.map((f, i) => (
                    <button
                      key={i}
                      className="ci-dropdown-item"
                      onClick={() => {
                        const internal = internalKeyFor[f] || f;
                        setActiveTask(internal);
                        setInput(getPrefix(internal));
                        setShowFeaturesDropdown(false);
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* TASK DROPDOWN */}
            <div className="ci-dropdown-wrapper">
              <button
                className="ci-dropdown-trigger always-open-trigger"
                onClick={() => {
                  setShowTasksDropdown((s) => !s);
                }}
              >
                <ListTodo className="w-4 h-4" />
                <span>Tasks</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showTasksDropdown && (
                <div className="ci-dropdown-menu ci-task-menu">
                  {tasks.map((t, i) => (
                    <button
                      key={i}
                      className={`ci-dropdown-item ${activeTask === internalKeyFor[t] ? "task-active" : ""
                        }`}
                      onClick={() => {
                        const internal = internalKeyFor[t];
                        setActiveTask(internal);
                        setInput(getPrefix(internal));
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PROMPT CHIPS */}
          {activeTask && promptChips[chipFriendlyKey] && (
            <div className="ci-chip-row">
              {promptChips[chipFriendlyKey].map((chip, idx) => (
                <div
                  key={idx}
                  className="ci-chip"
                  onClick={() => handleChipClick(chipFriendlyKey, chip.text)}
                >
                  {chip.label}
                </div>
              ))}
            </div>
          )}

          {/* TEXTAREA */}
          <div className="ci-textarea-wrapper">
            <Textarea
              className="ci-textarea"
              placeholder={placeholder}
              value={input}
              ref={textareaRef}
              onChange={(e) => {
                const enforced = enforcePrefix(e.target.value);
                setInput(enforced);
                updateSuggestions(enforced);
              }}
            />

            {suggestionsVisible && (
              <div className="ci-suggestions">
                {suggestions.map((s, idx) => (
                  <div
                    key={idx}
                    className="ci-suggestion-item"
                    onMouseDown={() => acceptSuggestion(s)}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: MIC + SEND */}
        <div className="ci-right">
          <button className="ci-icon-btn ci-mic-btn">
            <Mic className="w-5 h-5" />
          </button>

          <button className="ci-send-btn" onClick={send}>
            <Send className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ChatInput;
