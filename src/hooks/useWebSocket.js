// 📁 src/hooks/useWebSocket.js
import { useEffect, useRef, useCallback } from "react";
import { WS_URL } from "@/utils/constants";
import { generateSingleJD } from "@/utils/api";

export const useWebSocket = (
  setSelectedFeature,
  setSelectedTask,
  fetchProfileMatches,
  setMessages,
  setIsLoading
) => {
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);

  /* =======================================================
       GLOBAL LOCKS
  ======================================================= */
  const intentLockRef = useRef({ intent: null, ts: 0 });

  // Prevent Upload Resumes from firing twice
  const uploadTriggeredRef = useRef(false);

  // Store last user message for JD & Profile Matcher
  const lastUserMessageRef = useRef("");

  /* =======================================================
     INTENT LOCK — Prevents double WebSocket triggers
  ======================================================= */
  const allowIntent = (intent) => {
    const now = Date.now();
    const lock = intentLockRef.current;

    if (lock.intent === intent && now - lock.ts < 1200) {
      console.warn("⛔ BLOCKED DUPLICATE INTENT:", intent);
      return false;
    }

    lock.intent = intent;
    lock.ts = now;
    return true;
  };

  /* =======================================================
     HANDLE INTENTS
  ======================================================= */
  const handleIntent = async (intent) => {
    if (!intent) return;
    if (!allowIntent(intent)) return;

    console.log("🎯 Executing Intent:", intent);

    const featureUIs = {
      JDHistory: "📘 Showing JD History…",
      ProfileMatchHistory: "📊 Showing Profile Match History…",
      CandidateStatus: "📌 Showing Candidate Status…",
      InterviewBot: "🤖 InterviewBot activated!",
      ZohoBridge: "🔗 Opening Zoho Recruit Bridge…",
      MailMind: "📬 MailMind activated!",
      LinkedInPoster: "🔗 Posting on LinkedIn…",
      PrimeHireBrain: "🧠 Activating PrimeHire Brain…",
    };

    // ✔ GENERIC FEATURE UI ROUTES
    if (featureUIs[intent]) {
      uploadTriggeredRef.current = false;
      setSelectedFeature(intent);
      setSelectedTask("");

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: featureUIs[intent] },
        { role: "assistant", type: "feature_ui", feature: intent },
      ]);

      return;
    }

    // ✔ JD CREATOR
    if (intent === "JD Creator") {
      uploadTriggeredRef.current = false;
      const prompt = lastUserMessageRef.current.trim();
      if (!prompt) return;

      setMessages(prev => [...prev, { role: "assistant", content: "📝 Creating JD…" }]);

      try {
        setIsLoading(true);
        const result = await generateSingleJD(prompt);
        const jdText = result?.result?.markdown_jd || "⚠️ No JD generated.";
        setMessages(prev => [...prev, { role: "assistant", content: jdText }]);
      } finally {
        setIsLoading(false);
      }

      return;
    }

    // ✔ PROFILE MATCHER
    if (intent === "Profile Matcher") {
      uploadTriggeredRef.current = false;
      const jd = lastUserMessageRef.current.trim();
      if (!jd) return;

      setMessages(prev => [...prev, { role: "assistant", content: "🎯 Matching candidates…" }]);

      try {
        setIsLoading(true);
        await fetchProfileMatches(jd);
      } finally {
        setIsLoading(false);
      }

      return;
    }

    // ✔ UPLOAD RESUMES (WS triggered)
    if (intent === "Upload Resumes") {
      if (uploadTriggeredRef.current) return;
      uploadTriggeredRef.current = true;

      setSelectedFeature("Upload Resumes");
      setMessages(prev => [
        ...prev,
        { role: "assistant", type: "upload_ui", content: "📎 Upload your resumes…" }
      ]);

      return;
    }
  };


  /* =======================================================
     MASTER WS MESSAGE HANDLER
  ======================================================= */
  const handleWebSocketMessage = useCallback(
    async (msg) => {
      console.log("📩 WS Received:", msg);

      // 1) Backend detects intent
      if (msg.type === "feature_detected" && msg.data) {
        lastUserMessageRef.current = msg.user_message || "";
        await handleIntent(msg.data);
        return;
      }

      // 2) Ignore AI detection logs
      if (
        msg.type === "text" &&
        typeof msg.data === "string" &&
        msg.data.startsWith("✨ Detected request:")
      ) {
        return;
      }

      // 3) Standard assistant messages
      if (msg.type === "text") {
        setMessages((prev) => [...prev, { role: "assistant", content: msg.data }]);
        return;
      }

      // 4) Profile Matcher table
      if (msg.type === "profile" && msg.data?.candidates) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "profile_table", data: msg.data.candidates },
        ]);
        return;
      }

      // 5) Resume table
      if (msg.type === "resume" && msg.data) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "resume_table", data: msg.data },
        ]);
        return;
      }
    },
    [setMessages]
  );

  /* =======================================================
     CONNECT WEBSOCKET
  ======================================================= */
  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => console.log("🌐 WS connected");
    ws.onclose = () => {
      reconnectRef.current = setTimeout(connectWebSocket, 1500);
    };
    ws.onerror = () => ws.close();

    ws.onmessage = (event) => {
      try {
        const msg =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        handleWebSocketMessage(msg);
      } catch { }
    };
  }, [handleWebSocketMessage]);

  /* =======================================================
     LISTEN FOR ProfileMatcher → No Candidates → trigger_upload_resumes
  ======================================================= */
  useEffect(() => {
    const openUpload = () => {
      if (uploadTriggeredRef.current) return;
      uploadTriggeredRef.current = true;

      setSelectedFeature("Upload Resumes");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "upload_ui",
          content: "📎 Upload more resumes to improve matching.",
        },
      ]);
    };

    window.addEventListener("trigger_upload_resumes", openUpload);
    return () =>
      window.removeEventListener("trigger_upload_resumes", openUpload);
  }, [setMessages, setSelectedFeature]);

  /* =======================================================
     INITIATE WS CONNECTION
  ======================================================= */
  useEffect(() => {
    connectWebSocket();
    return () => {
      wsRef.current?.close();
      clearTimeout(reconnectRef.current);
    };
  }, [connectWebSocket]);

  /* =======================================================
     SEND MESSAGE
  ======================================================= */
  const sendMessage = useCallback(
    (msg) => {
      if (!msg.trim()) return;

      lastUserMessageRef.current = msg;

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ message: msg }));
        setMessages((prev) => [...prev, { role: "user", content: msg }]);
      }
    },
    [setMessages]
  );

  return { sendMessage };
};
