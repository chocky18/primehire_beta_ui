
// // 📁 src/hooks/useWebSocket.js
// import { useEffect, useRef, useCallback } from "react";
// import { WS_URL } from "@/utils/constants";
// import { generateSingleJD } from "@/utils/api";

// export const useWebSocket = (
//   setSelectedFeature,
//   setSelectedTask,
//   fetchProfileMatches,
//   setMessages,
//   setIsLoading,
//   handleJdProcess
// ) => {
//   const wsRef = useRef(null);
//   const reconnectRef = useRef(null);
//   // lastIntentRef now stores { name, ts }
//   const lastIntentRef = useRef({ name: null, ts: 0 });
//   const lastUserMessageRef = useRef("");

//   // 🧠 Detect possible intent in text responses — STRICT
//   const detectIntentFromText = (text) => {
//     if (!text || typeof text !== "string") return null;

//     const raw = text.trim();
//     const cleaned = raw.toLowerCase();

//     // ---------- IGNORE backend routing / assistant UI phrases ----------
//     // These are messages intentionally sent by the server to *announce* routing.
//     // If text matches these patterns, DO NOT treat as command.
//     const ignorePatterns = [
//       /detected feature[:]/i,
//       /\bopening\b.*\bmodule\b/i,
//       /\brouting (your|request)\b/i,
//       /processing your request/i,
//       /detected task[:]/i,
//     ];
//     for (const p of ignorePatterns) {
//       if (p.test(raw)) return null;
//     }

//     // ---------- Only detect explicit "Start ..." or "Use ..." style commands ----------
//     // Examples we accept:
//     //   Start Profile Matcher: ...
//     //   start profile matcher
//     //   use mailmind
//     //   use zohoBridge
//     // Case-insensitive, allow punctuation after command words.
//     if (/^start\s+profile\s*matcher\b/i.test(raw)) return "Profile Matcher";
//     if (/^start\s+jd\s*creator\b/i.test(raw) || /^start\s+job\s+description\b/i.test(raw)) return "JD Creator";
//     if (/^start\s+upload\s+resumes\b/i.test(raw) || /^start\s+resume\s+upload\b/i.test(raw)) return "Upload Resumes";

//     if (/^use\s+zohobridge\b/i.test(raw) || /^use\s+zoho\b/i.test(raw)) return "ZohoBridge";
//     if (/^use\s+mailmind\b/i.test(raw) || /^use\s+mail\s*mind\b/i.test(raw)) return "MailMind";
//     if (/^use\s+primehire\s*brain\b/i.test(raw) || /^use\s+primehirebrain\b/i.test(raw)) return "PrimeHireBrain";
//     if (/^use\s+interview\s*bot\b/i.test(raw) || /^use\s+interviewbot\b/i.test(raw)) return "InterviewBot";
//     if (/^use\s+linkedin\s*poster\b/i.test(raw) || /^use\s+linkedinposter\b/i.test(raw)) return "LinkedInPoster";

//     // ---------- Also accept short explicit commands without "Start"/"Use" but anchored to start ----------
//     // e.g. "profile matcher: find me..."
//     if (/^profile\s*matcher[:\s]/i.test(raw)) return "Profile Matcher";
//     if (/^jd\s*creator[:\s]/i.test(raw) || /^job\s+description[:\s]/i.test(raw)) return "JD Creator";
//     if (/^upload\s+resumes[:\s]/i.test(raw)) return "Upload Resumes";

//     // Otherwise: do not infer from casual mentions
//     return null;
//   };

//   // 🧩 Handle all WebSocket messages
//   const handleWebSocketMessage = useCallback(
//     async (msg) => {
//       console.log("📩 Received WS message:", msg);

//       // ✅ Handle structured intent (from backend) — highest priority
//       if ((msg.type === "feature_detected" || msg.type === "task_detected") && msg.data) {
//         const intent = msg.data;

//         // ⭐ FIX: Save JD text from backend routing
//         if (msg.user_message) {
//           lastUserMessageRef.current = msg.user_message;
//           console.log("🧠 Stored user message for matching:", msg.user_message);
//         }

//         await handleIntent(intent);
//         return;
//       }



//       // ✅ Fallback: detect intent from text message (careful & strict)
//       if (msg.type === "text" && typeof msg.data === "string") {
//         const text = msg.data;

//         // Skip detection if a task is actively locking the chat
//         if (typeof window !== "undefined" && (window.__JD_MODE_ACTIVE__ || window.__PROFILE_MATCH_MODE_ACTIVE__)) {
//           console.log("⏸️ Skipping text-based intent detection while a task is active.");
//           // Still display neutral assistant text (but don't attempt to parse)
//           setMessages((prev) => [...prev, { role: "assistant", content: text }]);
//           return;
//         }

//         const detectedIntent = detectIntentFromText(text);

//         // Extra safety: ignore text that looks like backend announcement (double-check)
//         const backendAnnouncePattern = /(detected feature:|opening .* module|routing your request|processing your request)/i;
//         if (backendAnnouncePattern.test(text)) {
//           console.log("ℹ️ Ignoring backend announce text (no intent):", text);
//           // show a friendly assistant message but not a trigger
//           setMessages((prev) => [...prev, { role: "assistant", content: text }]);
//           return;
//         }

//         if (detectedIntent) {
//           // Prevent accidental immediate re-trigger when same intent was handled very recently
//           const now = Date.now();
//           const last = lastIntentRef.current || { name: null, ts: 0 };
//           if (last.name === detectedIntent && now - (last.ts || 0) < 3000) {
//             console.log(`⏱ Ignoring duplicate quick-fire intent: ${detectedIntent}`);
//             // append message but do not re-run intent
//             setMessages((prev) => [...prev, { role: "assistant", content: text }]);
//             return;
//           }

//           console.log(`🧭 Auto-detected explicit intent from text: ${detectedIntent}`);
//           await handleIntent(detectedIntent);
//           return;
//         }

//         // No intent detected — just display the text
//         setMessages((prev) => [...prev, { role: "assistant", content: text }]);
//         return;
//       }

//       // ✅ Handle structured data (profile table)
//       if ((msg.type === "structured" || msg.type === "profile") && msg.data?.candidates) {
//         console.log("📊 [WebSocket] Received candidate table data");

//         // ✅ Show the table
//         setMessages((prev) => [
//           ...prev,
//           { role: "assistant", type: "profile_table", data: msg.data.candidates },
//         ]);

//         // 🔓 Ensure chat unlock event fires
//         if (typeof window !== "undefined") {
//           window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
//           window.dispatchEvent(new Event("profile_match_done"));
//           console.log("✅ [ProfileMatcher] Results shown — chat re-enabled.");
//         }

//         return;
//       }

//       // 📄 Resume table payload
//       if (msg.type === "resume" && msg.data) {
//         console.log("📄 [WebSocket] Received resume table data");
//         setMessages((prev) => [
//           ...prev,
//           { role: "assistant", type: "resume_table", data: msg.data },
//         ]);
//         return;
//       }

//       // 🧾 Fallback plain text (string)
//       if (typeof msg === "string") {
//         setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
//       }
//     },
//     [setMessages]
//   );

//   // 🚀 Handle detected feature/task
//   const handleIntent = async (intent) => {
//     if (!intent) return;

//     /* =====================================================
//        ⭐ FIX: Allow Profile Matcher to trigger EVERY TIME
//        ===================================================== */
//     // const isProfileMatcher = intent === "Profile Matcher";
//     /* =====================================================
//    ⭐ FIX: Only throttle Profile Matcher, NEVER JD Creator
//    ===================================================== */
//     if (intent === "Profile Matcher") {
//       const now = Date.now();
//       const last = lastIntentRef.current;

//       if (last.name === "Profile Matcher" && now - last.ts < 1000) {
//         console.log("⏱ Skipping duplicate Profile Matcher trigger");
//         return;
//       }
//     }

//     // For ALL other intents, skip if same intent already recorded
//     // if (!isProfileMatcher) {
//     //   if (lastIntentRef.current && lastIntentRef.current.name === intent) {
//     //     console.log("⏱ Intent already active, skipping:", intent);
//     //     return;
//     //   }
//     // }

//     // Always update last intent for all tasks (including Profile Matcher)
//     lastIntentRef.current = { name: intent, ts: Date.now() };


//     /* ============================
//           FEATURES (Zoho, MailMind)
//        ============================ */
//     if (
//       ["ZohoBridge", "MailMind", "PrimeHireBrain", "InterviewBot", "LinkedInPoster"]
//         .includes(intent)
//     ) {
//       console.log(`🚀 Activating feature: ${intent}`);
//       setSelectedFeature(intent);
//       setSelectedTask("");

//       if (window.__JD_MODE_ACTIVE__) {
//         console.log("⏸️ JD Creator active — skipping resets.");
//       } else {
//         setSelectedFeature("");
//         setSelectedTask("");
//       }

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: `✨ Detected feature: **${intent}** — Opening ${intent} module...`,
//         },
//       ]);
//       return;
//     }


//     /* ============================
//               TASKS
//        ============================ */
//     if (["JD Creator", "Profile Matcher", "Upload Resumes"].includes(intent)) {
//       console.log(`🧩 Activating task: ${intent}`);
//       setSelectedFeature("");
//       setSelectedTask(intent);

//       /* ---------- JD CREATOR ---------- */
//       // if (intent === "JD Creator") {
//       //   if (window.__JD_REFRESHING__) return;

//       //   window.__JD_MODE_ACTIVE__ = true;
//       //   window.__JD_HISTORY__ = [];
//       //   window.__CURRENT_JD_STEP__ = "👉 What is the job title / role?";
//       //   window.dispatchEvent(new Event("jd_open"));

//       //   setMessages((prev) => [
//       //     ...prev,
//       //     {
//       //       role: "assistant",
//       //       content: "✨ Detected task: **JD Creator** — Opening JD Creator module...",
//       //     },
//       //   ]);

//       //   try {
//       //     if (typeof setCurrentJdStep === "function") setCurrentJdStep("role");
//       //     if (typeof setJdInProgress === "function") setJdInProgress(true);
//       //   } catch { }

//       //   return;
//       // }
//       /* ---------- ⭐ JD CREATOR (WebSocket → ALWAYS SINGLE PROMPT) ---------- */
//       if (intent === "JD Creator") {
//         console.log("📝 [WebSocket] JD Creator detected — using SINGLE-PROMPT mode");

//         // DO NOT enable multi-step JD mode
//         window.__JD_MODE_ACTIVE__ = false;
//         window.dispatchEvent(new Event("jd_close"));

//         // Announce action
//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "assistant",
//             content: "📝 Creating job description from your message...",
//           },
//         ]);

//         // Use last user message as JD prompt
//         const prompt = lastUserMessageRef.current || "";
//         if (!prompt.trim()) {
//           setMessages((prev) => [
//             ...prev,
//             {
//               role: "assistant",
//               content:
//                 "⚠️ I need a description. Try: 'Start JD Creator: React Developer with 3 YOE in Bangalore'",
//             },
//           ]);
//           return;
//         }

//         try {
//           setIsLoading(true);

//           // CALL THE SINGLE-PROMPT ENDPOINT
//           const result = await generateSingleJD(prompt);

//           const jdText = result?.result?.markdown_jd || "⚠️ No JD generated.";

//           // SHOW JD IN CHAT
//           setMessages((prev) => [
//             ...prev,
//             { role: "assistant", content: jdText },
//             {
//               role: "assistant",
//               content: "🎉 JD generated successfully!",
//             },
//           ]);

//         } catch (err) {
//           console.error("❌ [WS] Single JD error:", err);

//           setMessages((prev) => [
//             ...prev,
//             { role: "assistant", content: "❌ Failed to generate JD." },
//           ]);
//         } finally {
//           setIsLoading(false);
//         }

//         return;
//       }


//       /* ---------- ⭐ PROFILE MATCHER (ALWAYS RE-TRIGGER) ---------- */
//       if (intent === "Profile Matcher") {
//         console.log("🎯 [WebSocket] Profile Matcher activated");

//         window.__PROFILE_MATCH_MODE_ACTIVE__ = true;
//         window.dispatchEvent(new Event("profile_match_start"));

//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "assistant",
//             content:
//               "🎯 Profile Matcher Active\n\nYour JD has been sent for candidate matching...",
//           },
//         ]);

//         try {
//           if (lastUserMessageRef.current) {
//             setIsLoading(true);
//             await fetchProfileMatches(lastUserMessageRef.current);
//             setIsLoading(false);
//           }
//         } catch (err) {
//           console.error("⚠️ Matching failed:", err);
//           setMessages((prev) => [
//             ...prev,
//             { role: "assistant", content: "❌ Matching failed. Please try again." },
//           ]);
//         } finally {
//           window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
//           window.__PROFILE_MATCH_RECENTLY_DONE__ = Date.now();
//           window.dispatchEvent(new Event("profile_match_done"));
//         }

//         return;
//       }


//       /* ---------- UPLOAD RESUMES ---------- */
//       if (intent === "Upload Resumes") {
//         setSelectedFeature("Upload Resumes");
//         setSelectedTask("");

//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "assistant",
//             type: "upload_ui",
//             content: "📎 Please upload resumes to begin.",
//             data: {},
//           },
//         ]);

//         return;
//       }
//     }
//   };

//   // 🔗 Establish WebSocket connection
//   const connectWebSocket = useCallback(() => {
//     console.log("🔗 Connecting WebSocket:", WS_URL);
//     const ws = new WebSocket(WS_URL);
//     wsRef.current = ws;

//     ws.onopen = () => {
//       console.log("✅ WebSocket connected");
//       if (reconnectRef.current) {
//         clearTimeout(reconnectRef.current);
//         reconnectRef.current = null;
//       }
//     };

//     ws.onmessage = (event) => {
//       try {
//         const msg = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
//         handleWebSocketMessage(msg);
//       } catch (err) {
//         console.warn("⚠️ Failed to parse WS message:", event.data);
//       }
//     };

//     ws.onclose = () => {
//       console.warn("❌ WebSocket disconnected. Reconnecting in 2s...");
//       reconnectRef.current = setTimeout(connectWebSocket, 2000);
//     };

//     ws.onerror = (err) => {
//       console.error("🔥 WebSocket error:", err);
//       try {
//         ws.close();
//       } catch { }
//     };
//   }, [handleWebSocketMessage]);

//   // 📤 Send message handler
//   const sendMessage = useCallback(
//     (message) => {
//       if (!message || !message.trim()) return;

//       // Save last user message for potential task routing (Profile Matcher)
//       lastUserMessageRef.current = message;

//       // 🚫 JD Creator lock guard
//       if (window.__JD_MODE_ACTIVE__) {
//         console.log("🧱 [WebSocket] JD Creator active — skipping WebSocket send.");
//         return;
//       }
//       if (window.__PROFILE_MATCH_MODE_ACTIVE__) {
//         console.log("🧱 [WebSocket] Profile Matcher active — skipping WebSocket send.");
//         return;
//       }
//       if (wsRef.current?.readyState === WebSocket.OPEN) {
//         const payload = JSON.stringify({ message });
//         console.log("📤 Sending WS message:", payload);
//         wsRef.current.send(payload);
//         console.log("🧠 [WebSocket] lastUserMessageRef set to:", message);
//         setMessages((prev) => [...prev, { role: "user", content: message }]);
//       } else {
//         console.warn("⚠️ WebSocket not connected, cannot send.");
//         setMessages((prev) => [
//           ...prev,
//           { role: "assistant", content: "❌ WebSocket not connected." },
//         ]);
//       }
//     },
//     [setMessages]
//   );

//   // 🧹 Cleanup and reconnect management
//   useEffect(() => {
//     connectWebSocket();
//     return () => {
//       if (wsRef.current) wsRef.current.close();
//       if (reconnectRef.current) clearTimeout(reconnectRef.current);
//     };
//   }, [connectWebSocket]);

//   return { sendMessage };
// };
// 📁 src/hooks/useWebSocket.js
import { useEffect, useRef, useCallback } from "react";
import { WS_URL } from "@/utils/constants";
import { generateSingleJD } from "@/utils/api";   // ⭐ REQUIRED

export const useWebSocket = (
  setSelectedFeature,
  setSelectedTask,
  fetchProfileMatches,
  setMessages,
  setIsLoading,
  handleJdProcess
) => {
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);
  const lastIntentRef = useRef({ name: null, ts: 0 });
  const lastUserMessageRef = useRef("");

  /* ============================================================
     🧠 STRICT INTENT DETECTOR
  ============================================================ */
  const detectIntentFromText = (text) => {
    if (!text || typeof text !== "string") return null;

    const raw = text.trim();

    // Ignore routing / backend announcements
    const ignore = [
      /detected feature/i,
      /detected task/i,
      /opening.*module/i,
      /routing your request/i,
      /processing your request/i,
    ];
    if (ignore.some((p) => p.test(raw))) return null;

    // Explicit "Start ..." commands
    if (/^start\s+profile\s*matcher\b/i.test(raw)) return "Profile Matcher";
    if (/^start\s+jd\s*creator\b/i.test(raw) || /^start\s+job\s+description\b/i.test(raw)) return "JD Creator";
    if (/^start\s+upload\s+resumes\b/i.test(raw) || /^start\s+resume\s+upload\b/i.test(raw)) return "Upload Resumes";

    // Explicit "Use ..." commands
    if (/^use\s+zohobridge\b/i.test(raw)) return "ZohoBridge";
    if (/^use\s+mailmind\b/i.test(raw)) return "MailMind";
    if (/^use\s+primehire\s*brain\b/i.test(raw)) return "PrimeHireBrain";
    if (/^use\s+interview\s*bot\b/i.test(raw)) return "InterviewBot";
    if (/^use\s+linkedin\s*poster\b/i.test(raw)) return "LinkedInPoster";

    // Short commands like:
    // jd creator: ...
    if (/^profile\s*matcher[:\s]/i.test(raw)) return "Profile Matcher";
    if (/^jd\s*creator[:\s]/i.test(raw) || /^job\s+description[:\s]/i.test(raw))
      return "JD Creator";
    if (/^upload\s+resumes[:\s]/i.test(raw)) return "Upload Resumes";

    return null;
  };

  /* ============================================================
     📩 HANDLE WS MESSAGES
  ============================================================ */
  const handleWebSocketMessage = useCallback(
    async (msg) => {
      console.log("📩 Received WS message:", msg);

      // Backend sent structured intent
      if ((msg.type === "feature_detected" || msg.type === "task_detected") && msg.data) {
        if (msg.user_message) {
          lastUserMessageRef.current = msg.user_message;
        }
        await handleIntent(msg.data);
        return;
      }

      // Text message
      if (msg.type === "text" && typeof msg.data === "string") {
        const text = msg.data;

        // If a task is active — do NOT detect new intent
        if (window.__JD_MODE_ACTIVE__ || window.__PROFILE_MATCH_MODE_ACTIVE__) {
          setMessages((prev) => [...prev, { role: "assistant", content: text }]);
          return;
        }

        const detected = detectIntentFromText(text);
        if (detected) {
          await handleIntent(detected);
          return;
        }

        setMessages((prev) => [...prev, { role: "assistant", content: text }]);
        return;
      }

      // Structured profile table
      if ((msg.type === "structured" || msg.type === "profile") && msg.data?.candidates) {
        console.log("📊 Candidate Table Received");

        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "profile_table", data: msg.data.candidates },
        ]);

        window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
        window.dispatchEvent(new Event("profile_match_done"));
        return;
      }

      // Resume data
      if (msg.type === "resume" && msg.data) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "resume_table", data: msg.data },
        ]);
        return;
      }

      // String fallback
      if (typeof msg === "string") {
        setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
      }
    },
    [setMessages]
  );

  /* ============================================================
     🎯 HANDLE INTENT
  ============================================================ */
  const handleIntent = async (intent) => {
    if (!intent) return;

    /* ============================================================
       ⭐ Only throttle PROFILE MATCHER (JD Creator NEVER throttled)
    ============================================================ */
    if (intent === "Profile Matcher") {
      const now = Date.now();
      const last = lastIntentRef.current;
      if (last.name === "Profile Matcher" && now - last.ts < 1000) {
        console.log("⏱ Duplicate Profile Matcher ignored");
        return;
      }
    }

    // Save last intent timestamp
    lastIntentRef.current = { name: intent, ts: Date.now() };

    /* ============================================================
       FEATURES (ZohoBridge, MailMind etc.)
    ============================================================ */
    if (
      ["ZohoBridge", "MailMind", "PrimeHireBrain", "InterviewBot", "LinkedInPoster"]
        .includes(intent)
    ) {
      setSelectedFeature(intent);
      setSelectedTask("");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `✨ Activated feature: **${intent}**` },
      ]);
      return;
    }

    /* ============================================================
       TASKS
    ============================================================ */
    if (intent === "JD Creator") {
      /* ============================================================
         ⭐ SINGLE-LINE JD CREATOR MODE
      ============================================================ */
      console.log("📝 Using Single-Line JD Creator (WS)");

      window.__JD_MODE_ACTIVE__ = false;
      window.dispatchEvent(new Event("jd_close"));

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "📝 Creating job description from your message...",
        },
      ]);

      const prompt = lastUserMessageRef.current || "";
      if (!prompt.trim()) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "⚠️ Please provide details. Example:\nStart JD Creator: React Developer with 3 years experience",
          },
        ]);
        return;
      }

      try {
        setIsLoading(true);

        const result = await generateSingleJD(prompt);
        const jdText = result?.result?.markdown_jd || "⚠️ No JD generated.";

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: jdText },
          { role: "assistant", content: "🎉 JD generated successfully!" },
        ]);
      } catch (err) {
        console.error("❌ JD Error:", err);
        setMessages((prev) => [...prev, { role: "assistant", content: "❌ Failed to generate JD." }]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    /* ============================================================
       PROFILE MATCHER
    ============================================================ */
    if (intent === "Profile Matcher") {
      console.log("🎯 WebSocket Profile Matcher triggered");

      window.__PROFILE_MATCH_MODE_ACTIVE__ = true;
      window.dispatchEvent(new Event("profile_match_start"));

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "🎯 Matching candidates with your JD...",
        },
      ]);

      try {
        const jd = lastUserMessageRef.current;
        setIsLoading(true);
        await fetchProfileMatches(jd);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "❌ Matching failed. Try again." },
        ]);
      } finally {
        setIsLoading(false);
        window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
        window.dispatchEvent(new Event("profile_match_done"));
      }

      return;
    }

    /* ============================================================
       UPLOAD RESUMES
    ============================================================ */
    if (intent === "Upload Resumes") {
      setSelectedFeature("Upload Resumes");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "upload_ui",
          content: "📎 Upload resumes to get started.",
        },
      ]);
      return;
    }
  };

  /* ============================================================
     🔗 CONNECT WS
  ============================================================ */
  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const msg =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        handleWebSocketMessage(msg);
      } catch {
        console.warn("⚠ Error parsing WS message:", event.data);
      }
    };

    ws.onclose = () => {
      console.warn("❌ WS disconnected — reconnecting...");
      reconnectRef.current = setTimeout(connectWebSocket, 1500);
    };

    ws.onerror = () => ws.close();
  }, [handleWebSocketMessage]);

  /* ============================================================
     📤 SEND MESSAGE
  ============================================================ */
  const sendMessage = useCallback(
    (message) => {
      if (!message.trim()) return;

      lastUserMessageRef.current = message;

      if (window.__JD_MODE_ACTIVE__ || window.__PROFILE_MATCH_MODE_ACTIVE__) {
        console.log("⏸️ Task active — skipping WS send");
        return;
      }

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ message }));
        setMessages((prev) => [...prev, { role: "user", content: message }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "❌ WebSocket not connected" },
        ]);
      }
    },
    [setMessages]
  );

  /* ============================================================
     🧹 LIFECYCLE
  ============================================================ */
  useEffect(() => {
    connectWebSocket();
    return () => {
      wsRef.current?.close();
      clearTimeout(reconnectRef.current);
    };
  }, [connectWebSocket]);

  return { sendMessage };
};
