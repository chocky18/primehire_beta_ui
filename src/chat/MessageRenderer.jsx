

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

const MessageRenderer = ({ message }) => {
  if (!message) return null;

  /* ---------- STRUCTURED TABLES ---------- */
  if (message.type === "profile_table")
    return <ProfileTable data={message.data} />;

  if (message.type === "resume_table")
    return <ResumeTable data={message.data} />;

  /* ---------- JD CREATOR INLINE UI ---------- */
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
      currentJdPrompt && typeof currentJdPrompt === "object"
        ? currentJdPrompt.prompt || ""
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

  /* ---------- PROFILE MATCHER UI ---------- */
  if (message.type === "matcher_ui") {
    const { isLoading, onSend } = message.data || {};

    return (
      <div className="message-block feature-block fade-highlight">
        <ChatMessage
          role="assistant"
          content="🎯 Profile Matcher — enter JD to find best candidates."
        />
        <div className="message-feature-ui mt-2">
          <ChatInput
            onSend={onSend}
            disabled={isLoading}
            placeholder="Type JD text or paste JSON to match..."
          />
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

  /* ---------- FEATURE DETECTION (Zoho, MailMind...) ---------- */
  const featureRef = useRef(null);

  const isAssistantText =
    message.role === "assistant" && typeof message.content === "string";

  const cleanContent = isAssistantText
    ? message.content.replace(/[*_~`]/g, "")
    : message.content;

  const featureMatch =
    isAssistantText &&
    cleanContent.match(
      /ZohoBridge|MailMind|JDHistory|PrimeHireBrain|InterviewBot|LinkedInPoster|ProfileMatchHistory|JD\s?Creator|Profile\s?Matcher|Upload\s?Resumes?/i
    );

  const detectedFeature = featureMatch ? featureMatch[0] : null;

  useEffect(() => {
    if (!featureRef.current || !detectedFeature) return;

    requestAnimationFrame(() => {
      setTimeout(() => {
        const event = new CustomEvent("featureRendered", {
          detail: { element: featureRef.current, feature: detectedFeature },
        });
        window.dispatchEvent(event);
      }, 40);
    });
  }, [detectedFeature]);

  if (detectedFeature) {
    return (
      <div ref={featureRef} className="message-block feature-block fade-highlight">
        <ChatMessage role={message.role} content={message.content} />
        <div className="message-feature-ui mt-2">
          {detectedFeature === "ZohoBridge" && <ZohoLoginButton />}
          {detectedFeature === "MailMind" && <MailMindButton />}
          {detectedFeature === "PrimeHireBrain" && <PrimeHireBrain />}
          {detectedFeature === "InterviewBot" && <InterviewBot />}
          {detectedFeature === "LinkedInPoster" && <LinkedInPosterButton />}
          {detectedFeature === "ProfileMatchHistory" && <ProfileMatchHistory />}
          {detectedFeature === "JDHistory" && <JDHistory />}
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
};

export default MessageRenderer;
