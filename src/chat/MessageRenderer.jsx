
import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ProfileTable from "./ProfileTable";
import ResumeTable from "@/chat/ResumeTable";
import JDTaskUI from "@/pages/JDTaskUI";
import UploadUI from "./UploadUI";
import ProfileMatchHistory from "@/components/ProfileMatcher/ProfileMatchHistory";
import PrimeHireBrain from "../PrimeHireBrain/PrimeHireBrain";
import InterviewBot from "../InterviewBot/InterviewBot";
import LinkedInPosterButton from "../LinkedInPoster/LinkedInPosterButton";
import ZohoLoginButton from "../ZohoBridge/ZohoLoginButton";
import MailMindButton from "../MailMind/MailMindButton";
import JDHistory from "@/pages/JDHistory";
import "./UploadUI.css";
import Designation from "../CandidateStatus/Designation";




const MessageRenderer = React.memo(({ message }) => {
  if (!message) return null;

  /* ---------- STRUCTURED TABLES ---------- */
  if (message.type === "profile_table") {
    return <ProfileTable data={message.data || {}} />;
  }

  if (message.type === "resume_table") {
    return <ResumeTable data={message.data || {}} />;
  }

  /* ---------- JD TASK UI ---------- */
  if (message.type === "jd_ui" && message.data) {
    const {
      currentJdStep,
      currentJdPrompt,
      currentJdInput,
      setCurrentJdInput,
      handleJdSend,
      jdInProgress,
      messages,
    } = message.data;

    const safePrompt =
      typeof currentJdPrompt === "object"
        ? currentJdPrompt?.prompt || ""
        : currentJdPrompt || "";

    return (
      <div className="message-block feature-block">
        <JDTaskUI
          currentJdStep={currentJdStep}
          currentJdPrompt={safePrompt}
          currentJdInput={currentJdInput}
          setCurrentJdInput={setCurrentJdInput}
          handleJdSend={handleJdSend}
          jdInProgress={jdInProgress}
          messages={messages}
        />
      </div>
    );
  }

  /* ---------- MATCHER UI ---------- */
  if (message.type === "matcher_ui") {
    const { isLoading, onSend } = message.data || {};

    return (
      <div className="message-block feature-block fade-highlight">
        {/* <ChatMessage
          role="assistant"
          content="🎯 Profile Matcher — enter JD to find best candidates."
        /> */}
        <div className="message-feature-ui mt-2">
          {/* <ChatInput
            onSend={onSend}
            disabled={isLoading}
            placeholder="Type JD text or paste JSON to match..."
          /> */}
        </div>
      </div>
    );
  }

  /* ---------- UPLOAD UI ---------- */
  if (message.type === "upload_ui") {
    return (
      <div className="message-block feature-block fade-highlight">
        <ChatMessage
          role="assistant"
          content="📎 Upload Resumes — upload PDFs/DOCXs, track progress, and view metadata."
        />
        <UploadUI />
      </div>
    );
  }

  /* ---------- FEATURE DETECTION (Zoho, MailMind, JDHistory...) ---------- */
  const featureRef = useRef(null);
  const isAssistant = message.role === "assistant";

  const cleanText =
    isAssistant && typeof message.content === "string"
      ? message.content.replace(/[*_~`]/g, "")
      : "";

  const featureMatch = cleanText.match(
    /\b(ZohoBridge|MailMind|JDHistory|PrimeHireBrain|InterviewBot|LinkedInPoster|ProfileMatchHistory|CandidateStatus)\b/i
  );

  const detectedFeature = featureMatch ? featureMatch[1] : null;

  useEffect(() => {
    if (!detectedFeature || !featureRef.current) return;

    requestAnimationFrame(() => {
      const event = new CustomEvent("featureRendered", {
        detail: { element: featureRef.current, feature: detectedFeature },
      });
      window.dispatchEvent(event);
    });
  }, [detectedFeature]);

  if (detectedFeature) {
    return (
      <div
        ref={featureRef}
        className="message-block feature-block fade-highlight"
      >
        <ChatMessage role={message.role} content={message.content} />
        <div className="message-feature-ui mt-2">
          {detectedFeature === "ZohoBridge" && <ZohoLoginButton />}
          {detectedFeature === "MailMind" && <MailMindButton />}
          {detectedFeature === "PrimeHireBrain" && <PrimeHireBrain />}
          {detectedFeature === "InterviewBot" && <InterviewBot />}
          {detectedFeature === "LinkedInPoster" && <LinkedInPosterButton />}
          {detectedFeature === "ProfileMatchHistory" && <ProfileMatchHistory />}
          {detectedFeature === "JDHistory" && <JDHistory />}
          {detectedFeature === "CandidateStatus" && <Designation />}

        </div>
      </div>
    );
  }

  /* ---------- DEFAULT CHAT MESSAGE ---------- */
  return (
    <div className="message-block">
      <ChatMessage role={message.role} content={message.content} />
    </div>
  );
});

export default MessageRenderer;