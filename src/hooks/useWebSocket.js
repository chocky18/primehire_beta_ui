// // // 📁 src/hooks/useWebSocket.js
// // import { useEffect, useRef, useCallback } from "react";
// // import { WS_URL } from "@/utils/constants";

// // export const useWebSocket = (
// //   setSelectedFeature,
// //   setSelectedTask,
// //   fetchProfileMatches,
// //   setMessages,
// //   setIsLoading,
// //   handleJdProcess
// // ) => {
// //   const wsRef = useRef(null);
// //   const reconnectRef = useRef(null);
// //   const lastIntentRef = useRef({ name: null });
// //   const lastUserMessageRef = useRef("");

// //   // 🧠 Detect possible intent in text responses
// //   const detectIntentFromText = (text) => {
// //     const intents = [
// //       "ZohoBridge",
// //       "MailMind",
// //       "PrimeHireBrain",
// //       "InterviewBot",
// //       "LinkedInPoster",
// //       "JD Creator",
// //       "Profile Matcher",
// //       "Upload Resumes",
// //     ];
// //     return intents.find((intent) => text.includes(intent));
// //   };

// //   // 🧩 Handle all WebSocket messages
// //   const handleWebSocketMessage = useCallback(
// //     async (msg) => {
// //       console.log("📩 Received WS message:", msg);

// //       // ✅ Handle structured intent (from backend)
// //       if ((msg.type === "feature_detected" || msg.type === "task_detected") && msg.data) {
// //         const intent = msg.data;
// //         console.log(`🎯 Detected structured intent: ${intent}`);
// //         await handleIntent(intent);
// //         return;
// //       }

// //       // ✅ Fallback: detect intent from text message
// //       if (msg.type === "text" && typeof msg.data === "string") {
// //         const text = msg.data;
// //         const detectedIntent = detectIntentFromText(text);
// //         if (detectedIntent) {
// //           console.log(`🧭 Auto-detected intent from text: ${detectedIntent}`);
// //           await handleIntent(detectedIntent);
// //           return;
// //         }

// //         // No intent detected — just display the text
// //         setMessages((prev) => [...prev, { role: "assistant", content: text }]);
// //         return;
// //       }

// //       // ✅ Handle structured data
// //       if ((msg.type === "structured" || msg.type === "profile") && msg.data?.candidates) {
// //         console.log("📊 [WebSocket] Received candidate table data");

// //         // ✅ Show the table
// //         setMessages((prev) => [
// //           ...prev,
// //           { role: "assistant", type: "profile_table", data: msg.data.candidates },
// //         ]);

// //         // 🔓 Ensure chat unlock event fires
// //         if (typeof window !== "undefined") {
// //           window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
// //           window.dispatchEvent(new Event("profile_match_done"));
// //           console.log("✅ [ProfileMatcher] Results shown — chat re-enabled.");
// //         }

// //         return;
// //       }



// //       if (msg.type === "resume" && msg.data) {
// //         console.log("📄 [WebSocket] Received resume table data");
// //         setMessages((prev) => [
// //           ...prev,
// //           { role: "assistant", type: "resume_table", data: msg.data },
// //         ]);
// //         return;
// //       }

// //       // 🧾 Fallback plain text
// //       if (typeof msg === "string") {
// //         setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
// //       }
// //     },
// //     [setMessages]
// //   );

// //   // 🚀 Handle detected feature/task
// //   const handleIntent = async (intent) => {
// //     if (!intent || lastIntentRef.current.name === intent) return;
// //     lastIntentRef.current.name = intent;

// //     // === FEATURES ===
// //     if (["ZohoBridge", "MailMind", "PrimeHireBrain", "InterviewBot", "LinkedInPoster"].includes(intent)) {
// //       console.log(`🚀 Activating feature: ${intent}`);
// //       setSelectedFeature(intent);
// //       setSelectedTask("");

// //       // 🧹 Reset context (if safe)
// //       if (window.__JD_MODE_ACTIVE__) {
// //         console.log("⏸️ [WebSocket] JD Creator active — skipping context reset.");
// //       } else {
// //         console.log("🔁 [WebSocket] Resetting context: clearing feature/task states");
// //         lastIntentRef.current = { feature: null, task: null };
// //         setSelectedFeature("");
// //         setSelectedTask("");
// //       }

// //       setMessages((prev) => [
// //         ...prev,
// //         { role: "assistant", content: `✨ Detected feature: **${intent}** — Opening ${intent} module...` },
// //       ]);
// //       return;
// //     }

// //     // === TASKS ===
// //     if (["JD Creator", "Profile Matcher", "Upload Resumes"].includes(intent)) {
// //       console.log(`🧩 Activating task: ${intent}`);
// //       setSelectedFeature("");
// //       setSelectedTask(intent);

// //       // 🚫 JD Creator lock
// //       if (intent === "JD Creator") {
// //         if (window.__JD_REFRESHING__) {
// //           console.log("⏸️ Skipping JD Creator activation during refresh.");
// //           return;
// //         }

// //         console.log("🧩 [WebSocket] JD Creator activated — initializing UI panel.");
// //         setSelectedFeature("");
// //         setSelectedTask("JD Creator");

// //         // ✅ Global state setup for JD session
// //         if (typeof window !== "undefined") {
// //           window.__JD_MODE_ACTIVE__ = true;
// //           window.__JD_HISTORY__ = [];
// //           window.__CURRENT_JD_STEP__ = "👉 What is the job title / role?";
// //           window.dispatchEvent(new Event("jd_open"));
// //         }

// //         // ✅ Add assistant message in chat (append, not overwrite)
// //         setMessages((prev) => [
// //           ...prev,
// //           {
// //             role: "assistant",
// //             content: "✨ Detected task: **JD Creator** — Opening JD Creator module...",
// //           },
// //         ]);

// //         // ✅ Try syncing React JD states for UI render
// //         try {
// //           if (typeof setCurrentJdStep === "function") setCurrentJdStep("role");
// //           if (typeof setJdInProgress === "function") setJdInProgress(true);
// //         } catch (err) {
// //           console.warn("⚠️ JD state not ready yet:", err);
// //         }

// //         console.log("✅ JD Creator UI initialized successfully.");
// //         return;
// //       }



// //       // 🎯 Profile Matcher
// //       // if (intent === "Profile Matcher") {
// //       //   console.log("🎯 [WebSocket] Profile Matcher activated");
// //       //   setMessages([
// //       //     { role: "assistant", content: "🎯 Profile Matcher activated — fetching candidates..." },
// //       //   ]);

// //       //   if (lastUserMessageRef.current) {
// //       //     setIsLoading(true);
// //       //     await fetchProfileMatches(lastUserMessageRef.current);
// //       //     setIsLoading(false);
// //       //   }
// //       //   return;
// //       // }
// //       // 🎯 Profile Matcher
// //       if (intent === "Profile Matcher") {
// //         console.log("🎯 [WebSocket] Profile Matcher activated");

// //         // 🔒 Lock chat and dispatch start event
// //         window.__PROFILE_MATCH_MODE_ACTIVE__ = true;
// //         window.dispatchEvent(new Event("profile_match_start"));

// //         // Notify user
// //         setMessages((prev) => [
// //           ...prev,
// //           {
// //             role: "assistant",
// //             content: "🎯 Profile Matcher Active\n\nYour JD has been sent for candidate matching...",
// //           },
// //         ]);

// //         try {
// //           if (lastUserMessageRef.current) {
// //             setIsLoading(true);
// //             await fetchProfileMatches(lastUserMessageRef.current);
// //             setIsLoading(false);
// //           }
// //         } catch (err) {
// //           console.error("⚠️ [ProfileMatcher] Matching failed:", err);
// //           setMessages((prev) => [
// //             ...prev,
// //             { role: "assistant", content: "❌ Matching failed. Please try again." },
// //           ]);
// //         } finally {
// //           // 🔓 Unlock and dispatch completion event
// //           if (typeof window !== "undefined") {
// //             window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
// //             window.__PROFILE_MATCH_RECENTLY_DONE__ = Date.now();
// //             window.dispatchEvent(new Event("profile_match_done"));
// //           }
// //           console.log("🔓 [ProfileMatcher] Chat re-enabled after matching.");
// //         }

// //         return;
// //       }




// //       // 📄 Upload Resumes
// //       // 📄 Upload Resumes
// //       if (intent === "Upload Resumes") {
// //         console.log("📄 [WebSocket] Upload Resumes activated");

// //         // ✅ Open the ResumeUpload feature in UI
// //         setSelectedFeature("Upload Resumes");
// //         setSelectedTask("");

// //         // ✅ Append message (not overwrite)
// //         setMessages((prev) => [
// //           ...prev,
// //           {
// //             role: "assistant",
// //             content: "📎 Upload resumes to begin extraction.",
// //           },
// //         ]);

// //         // 🧠 Optional: store intent name to prevent double trigger
// //         lastIntentRef.current.name = intent;

// //         return;
// //       }

// //     }
// //   };

// //   // 🔗 Establish WebSocket connection
// //   const connectWebSocket = useCallback(() => {
// //     console.log("🔗 Connecting WebSocket:", WS_URL);
// //     const ws = new WebSocket(WS_URL);
// //     wsRef.current = ws;

// //     ws.onopen = () => {
// //       console.log("✅ WebSocket connected");
// //       if (reconnectRef.current) {
// //         clearTimeout(reconnectRef.current);
// //         reconnectRef.current = null;
// //       }
// //     };

// //     ws.onmessage = (event) => {
// //       try {
// //         const msg = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
// //         handleWebSocketMessage(msg);
// //       } catch (err) {
// //         console.warn("⚠️ Failed to parse WS message:", event.data);
// //       }
// //     };

// //     ws.onclose = () => {
// //       console.warn("❌ WebSocket disconnected. Reconnecting in 2s...");
// //       reconnectRef.current = setTimeout(connectWebSocket, 2000);
// //     };

// //     ws.onerror = (err) => {
// //       console.error("🔥 WebSocket error:", err);
// //       try {
// //         ws.close();
// //       } catch { }
// //     };
// //   }, [handleWebSocketMessage]);

// //   // 📤 Send message handler
// //   const sendMessage = useCallback(
// //     (message) => {
// //       // 🚫 JD Creator lock guard
// //       if (window.__JD_MODE_ACTIVE__) {
// //         console.log("🧱 [WebSocket] JD Creator active — skipping WebSocket send.");
// //         return;
// //       }
// //       if (window.__PROFILE_MATCH_MODE_ACTIVE__) {
// //         console.log("🧱 [WebSocket] Profile Matcher active — skipping WebSocket send.");
// //         return;
// //       }
// //       if (wsRef.current?.readyState === WebSocket.OPEN) {
// //         const payload = JSON.stringify({ message });
// //         console.log("📤 Sending WS message:", payload);
// //         wsRef.current.send(payload);
// //         lastUserMessageRef.current = message;
// //         console.log("🧠 [WebSocket] lastUserMessageRef set to:", message);
// //         setMessages((prev) => [...prev, { role: "user", content: message }]);
// //       } else {
// //         console.warn("⚠️ WebSocket not connected, cannot send.");
// //         setMessages((prev) => [
// //           ...prev,
// //           { role: "assistant", content: "❌ WebSocket not connected." },
// //         ]);
// //       }
// //     },
// //     [setMessages]
// //   );

// //   // 🧹 Cleanup and reconnect management
// //   useEffect(() => {
// //     connectWebSocket();
// //     return () => {
// //       if (wsRef.current) wsRef.current.close();
// //       if (reconnectRef.current) clearTimeout(reconnectRef.current);
// //     };
// //   }, [connectWebSocket]);

// //   return { sendMessage };
// // };
// // 📁 src/hooks/useWebSocket.js
// import { useEffect, useRef, useCallback } from "react";
// import { WS_URL } from "@/utils/constants";

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
//   const lastIntentRef = useRef({ name: null });
//   const lastUserMessageRef = useRef("");

//   const detectIntentFromText = (text) => {
//     const intents = [
//       "ZohoBridge",
//       "MailMind",
//       "PrimeHireBrain",
//       "InterviewBot",
//       "LinkedInPoster",
//       "JD Creator",
//       "Profile Matcher",
//       "Upload Resumes",
//     ];
//     return intents.find((intent) => text.includes(intent));
//   };

//   const handleWebSocketMessage = useCallback(
//     async (msg) => {
//       console.log("📩 Received WS message:", msg);

//       if ((msg.type === "feature_detected" || msg.type === "task_detected") && msg.data) {
//         const intent = msg.data;
//         await handleIntent(intent);
//         return;
//       }

//       if (msg.type === "text" && typeof msg.data === "string") {
//         const text = msg.data;
//         const detectedIntent = detectIntentFromText(text);
//         if (detectedIntent) {
//           await handleIntent(detectedIntent);
//           return;
//         }
//         setMessages((prev) => [...prev, { role: "assistant", content: text }]);
//         return;
//       }

//       if ((msg.type === "structured" || msg.type === "profile") && msg.data?.candidates) {
//         setMessages((prev) => [
//           ...prev,
//           { role: "assistant", type: "profile_table", data: msg.data.candidates },
//         ]);
//         if (typeof window !== "undefined") {
//           window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
//           window.dispatchEvent(new Event("profile_match_done"));
//         }
//         return;
//       }

//       if (msg.type === "resume" && msg.data) {
//         setMessages((prev) => [...prev, { role: "assistant", type: "resume_table", data: msg.data }]);
//         return;
//       }

//       if (typeof msg === "string") {
//         setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
//       }
//     },
//     [setMessages]
//   );

//   const handleIntent = async (intent) => {
//     if (!intent || lastIntentRef.current.name === intent) return;
//     lastIntentRef.current.name = intent;

//     if (["ZohoBridge", "MailMind", "PrimeHireBrain", "InterviewBot", "LinkedInPoster"].includes(intent)) {
//       setSelectedFeature(intent);
//       setSelectedTask("");
//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: `✨ Detected feature: **${intent}** — Opening ${intent} module...` },
//       ]);
//       return;
//     }

//     if (["JD Creator", "Profile Matcher", "Upload Resumes"].includes(intent)) {
//       setSelectedFeature("");
//       setSelectedTask(intent);

//       if (intent === "JD Creator") {
//         console.log("🧩 [WebSocket] JD Creator activated — injecting JD UI into chat.");

//         // ensure JD global flags
//         if (typeof window !== "undefined") {
//           window.__JD_MODE_ACTIVE__ = true;
//           window.__JD_HISTORY__ = [];
//           window.__CURRENT_JD_STEP__ = "👉 What is the job title?";
//         }

//         // mount JD UI into chat (so MessageRenderer will render JDTaskUI)
//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "assistant",
//             content: "✨ Detected task: **JD Creator** — Opening JD Creator module...",
//           },
//           {
//             type: "jd_ui",
//             data: {
//               currentJdStep: "role",
//               currentJdPrompt: "👉 What is the job title?",
//               currentJdInput: "",
//               // These setter wrappers keep references valid inside the message.data object.
//               setCurrentJdInput: (v) => {
//                 if (typeof window !== "undefined") window.__CURRENT_JD_INPUT__ = v;
//               },
//               handleJdSend: handleJdProcess,
//               // handleSkip: will be read from global __HANDLE_JD_SKIP__ by JDTaskUI if present
//               handleSkip: () => {
//                 if (typeof window !== "undefined" && typeof window.__HANDLE_JD_SKIP__ === "function") {
//                   window.__HANDLE_JD_SKIP__();
//                   return;
//                 }
//                 console.warn("handleSkip not registered yet");
//               },
//               jdInProgress: true,
//               messages: prev,
//               stepPrompts: {
//                 ...{
//                   role: "👉 What is the job title?",
//                   company_name: "🏢 What is the company name?",
//                   location: { prompt: "📍 Choose job location:", type: "dropdown", options: ["Remote", "Hyderabad", "Bangalore", "Pune", "Chennai", "Mumbai"] },
//                   experience: { prompt: "💼 Required experience?", type: "dropdown", options: ["0-1 years", "1-2 years", "2-3 years", "3-5 years", "5+ years"] },
//                   jobType: { prompt: "📌 Job type?", type: "dropdown", options: ["Full-time", "Part-time", "Contract", "Internship", "Remote"] },
//                   skillsMandatory: "✍️ Mandatory skills (comma separated)",
//                   skillsPreferred: "✨ Preferred skills (optional)",
//                   responsibilities: "📝 Responsibilities (optional)",
//                   about: "🏢 Short company or role description",
//                   perks: "🎁 Benefits or perks (optional)",
//                 }
//               }
//             }
//           }
//         ]);

//         return;
//       }

//       if (intent === "Profile Matcher") {
//         // lock + run matcher if last user JD exists
//         window.__PROFILE_MATCH_MODE_ACTIVE__ = true;
//         window.dispatchEvent(new Event("profile_match_start"));
//         setMessages((prev) => [
//           ...prev,
//           { role: "assistant", content: "🎯 Profile Matcher Active — your JD is being matched." },
//         ]);
//         try {
//           if (lastUserMessageRef.current) {
//             setIsLoading(true);
//             await fetchProfileMatches(lastUserMessageRef.current);
//             setIsLoading(false);
//           }
//         } catch (err) {
//           setMessages((prev) => [...prev, { role: "assistant", content: "❌ Matching failed. Please try again." }]);
//           console.error(err);
//         } finally {
//           window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
//           window.dispatchEvent(new Event("profile_match_done"));
//         }
//         return;
//       }

//       if (intent === "Upload Resumes") {
//         setSelectedFeature("Upload Resumes");
//         setSelectedTask("");
//         setMessages((prev) => [...prev, { role: "assistant", content: "📎 Upload resumes to begin extraction." }]);
//         lastIntentRef.current.name = intent;
//         return;
//       }
//     }
//   };

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
//       try { ws.close(); } catch {}
//     };
//   }, [handleWebSocketMessage]);

//   const sendMessage = useCallback((message) => {
//     if (window.__JD_MODE_ACTIVE__) {
//       console.log("🧱 [WebSocket] JD Creator active — skipping WebSocket send.");
//       return;
//     }
//     if (window.__PROFILE_MATCH_MODE_ACTIVE__) {
//       console.log("🧱 [WebSocket] Profile Matcher active — skipping WebSocket send.");
//       return;
//     }
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       const payload = JSON.stringify({ message });
//       wsRef.current.send(payload);
//       lastUserMessageRef.current = message;
//       setMessages((prev) => [...prev, { role: "user", content: message }]);
//     } else {
//       setMessages((prev) => [...prev, { role: "assistant", content: "❌ WebSocket not connected." }]);
//     }
//   }, [setMessages]);

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
  const lastIntentRef = useRef({ name: null });
  const lastUserMessageRef = useRef("");

  // 🧠 Detect possible intent in text responses
  const detectIntentFromText = (text) => {
    const intents = [
      "ZohoBridge",
      "MailMind",
      "PrimeHireBrain",
      "InterviewBot",
      "LinkedInPoster",
      "JD Creator",
      "Profile Matcher",
      "Upload Resumes",
    ];
    return intents.find((intent) => text.includes(intent));
  };

  // 🧩 Handle all WebSocket messages
  const handleWebSocketMessage = useCallback(
    async (msg) => {
      console.log("📩 Received WS message:", msg);

      // ✅ Handle structured intent (from backend)
      if ((msg.type === "feature_detected" || msg.type === "task_detected") && msg.data) {
        const intent = msg.data;
        console.log(`🎯 Detected structured intent: ${intent}`);
        await handleIntent(intent);
        return;
      }

      // ✅ Fallback: detect intent from text message
      if (msg.type === "text" && typeof msg.data === "string") {
        const text = msg.data;
        const detectedIntent = detectIntentFromText(text);
        if (detectedIntent) {
          console.log(`🧭 Auto-detected intent from text: ${detectedIntent}`);
          await handleIntent(detectedIntent);
          return;
        }

        // No intent detected — just display the text
        setMessages((prev) => [...prev, { role: "assistant", content: text }]);
        return;
      }

      // ✅ Handle structured data
      if ((msg.type === "structured" || msg.type === "profile") && msg.data?.candidates) {
        console.log("📊 [WebSocket] Received candidate table data");

        // ✅ Show the table
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "profile_table", data: msg.data.candidates },
        ]);

        // 🔓 Ensure chat unlock event fires
        if (typeof window !== "undefined") {
          window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
          window.dispatchEvent(new Event("profile_match_done"));
          console.log("✅ [ProfileMatcher] Results shown — chat re-enabled.");
        }

        return;
      }



      if (msg.type === "resume" && msg.data) {
        console.log("📄 [WebSocket] Received resume table data");
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "resume_table", data: msg.data },
        ]);
        return;
      }

      // 🧾 Fallback plain text
      if (typeof msg === "string") {
        setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
      }
    },
    [setMessages]
  );

  // 🚀 Handle detected feature/task
  const handleIntent = async (intent) => {
    if (!intent || lastIntentRef.current.name === intent) return;
    lastIntentRef.current.name = intent;

    // === FEATURES ===
    if (["ZohoBridge", "MailMind", "PrimeHireBrain", "InterviewBot", "LinkedInPoster"].includes(intent)) {
      console.log(`🚀 Activating feature: ${intent}`);
      setSelectedFeature(intent);
      setSelectedTask("");

      // 🧹 Reset context (if safe)
      if (window.__JD_MODE_ACTIVE__) {
        console.log("⏸️ [WebSocket] JD Creator active — skipping context reset.");
      } else {
        console.log("🔁 [WebSocket] Resetting context: clearing feature/task states");
        lastIntentRef.current = { feature: null, task: null };
        setSelectedFeature("");
        setSelectedTask("");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `✨ Detected feature: **${intent}** — Opening ${intent} module...` },
      ]);
      return;
    }

    // === TASKS ===
    if (["JD Creator", "Profile Matcher", "Upload Resumes"].includes(intent)) {
      console.log(`🧩 Activating task: ${intent}`);
      setSelectedFeature("");
      setSelectedTask(intent);

      // 🚫 JD Creator lock
      if (intent === "JD Creator") {
        if (window.__JD_REFRESHING__) {
          console.log("⏸️ Skipping JD Creator activation during refresh.");
          return;
        }

        console.log("🧩 [WebSocket] JD Creator activated — initializing UI panel.");
        setSelectedFeature("");
        setSelectedTask("JD Creator");

        // ✅ Global state setup for JD session
        if (typeof window !== "undefined") {
          window.__JD_MODE_ACTIVE__ = true;
          window.__JD_HISTORY__ = [];
          window.__CURRENT_JD_STEP__ = "👉 What is the job title / role?";
          window.dispatchEvent(new Event("jd_open"));
        }

        // ✅ Add assistant message in chat (append, not overwrite)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "✨ Detected task: **JD Creator** — Opening JD Creator module...",
          },
        ]);

        // ✅ Try syncing React JD states for UI render
        try {
          if (typeof setCurrentJdStep === "function") setCurrentJdStep("role");
          if (typeof setJdInProgress === "function") setJdInProgress(true);
        } catch (err) {
          console.warn("⚠️ JD state not ready yet:", err);
        }

        console.log("✅ JD Creator UI initialized successfully.");
        return;
      }



      // 🎯 Profile Matcher
      // if (intent === "Profile Matcher") {
      //   console.log("🎯 [WebSocket] Profile Matcher activated");
      //   setMessages([
      //     { role: "assistant", content: "🎯 Profile Matcher activated — fetching candidates..." },
      //   ]);

      //   if (lastUserMessageRef.current) {
      //     setIsLoading(true);
      //     await fetchProfileMatches(lastUserMessageRef.current);
      //     setIsLoading(false);
      //   }
      //   return;
      // }
      // 🎯 Profile Matcher
      if (intent === "Profile Matcher") {
        console.log("🎯 [WebSocket] Profile Matcher activated");

        // 🔒 Lock chat and dispatch start event
        window.__PROFILE_MATCH_MODE_ACTIVE__ = true;
        window.dispatchEvent(new Event("profile_match_start"));

        // Notify user
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "🎯 Profile Matcher Active\n\nYour JD has been sent for candidate matching...",
          },
        ]);

        try {
          if (lastUserMessageRef.current) {
            setIsLoading(true);
            await fetchProfileMatches(lastUserMessageRef.current);
            setIsLoading(false);
          }
        } catch (err) {
          console.error("⚠️ [ProfileMatcher] Matching failed:", err);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "❌ Matching failed. Please try again." },
          ]);
        } finally {
          // 🔓 Unlock and dispatch completion event
          if (typeof window !== "undefined") {
            window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
            window.__PROFILE_MATCH_RECENTLY_DONE__ = Date.now();
            window.dispatchEvent(new Event("profile_match_done"));
          }
          console.log("🔓 [ProfileMatcher] Chat re-enabled after matching.");
        }

        return;
      }




      // 📄 Upload Resumes
      // 📄 Upload Resumes
      if (intent === "Upload Resumes") {
        console.log("📄 [WebSocket] Upload Resumes activated");

        // ✅ Open the ResumeUpload feature in UI
        setSelectedFeature("Upload Resumes");
        setSelectedTask("");

        // ✅ Append message (not overwrite)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "📎 Upload resumes to begin extraction.",
          },
        ]);

        // 🧠 Optional: store intent name to prevent double trigger
        lastIntentRef.current.name = intent;

        return;
      }

    }
  };

  // 🔗 Establish WebSocket connection
  const connectWebSocket = useCallback(() => {
    console.log("🔗 Connecting WebSocket:", WS_URL);
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        handleWebSocketMessage(msg);
      } catch (err) {
        console.warn("⚠️ Failed to parse WS message:", event.data);
      }
    };

    ws.onclose = () => {
      console.warn("❌ WebSocket disconnected. Reconnecting in 2s...");
      reconnectRef.current = setTimeout(connectWebSocket, 2000);
    };

    ws.onerror = (err) => {
      console.error("🔥 WebSocket error:", err);
      try {
        ws.close();
      } catch { }
    };
  }, [handleWebSocketMessage]);

  // 📤 Send message handler
  const sendMessage = useCallback(
    (message) => {
      // 🚫 JD Creator lock guard
      if (window.__JD_MODE_ACTIVE__) {
        console.log("🧱 [WebSocket] JD Creator active — skipping WebSocket send.");
        return;
      }
      if (window.__PROFILE_MATCH_MODE_ACTIVE__) {
        console.log("🧱 [WebSocket] Profile Matcher active — skipping WebSocket send.");
        return;
      }
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const payload = JSON.stringify({ message });
        console.log("📤 Sending WS message:", payload);
        wsRef.current.send(payload);
        lastUserMessageRef.current = message;
        console.log("🧠 [WebSocket] lastUserMessageRef set to:", message);
        setMessages((prev) => [...prev, { role: "user", content: message }]);
      } else {
        console.warn("⚠️ WebSocket not connected, cannot send.");
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "❌ WebSocket not connected." },
        ]);
      }
    },
    [setMessages]
  );

  // 🧹 Cleanup and reconnect management
  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    };
  }, [connectWebSocket]);

  return { sendMessage };
};