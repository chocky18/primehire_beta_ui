import React, { useState, useEffect } from "react";
import ChatContainer from "@/chat/ChatContainer";

import ValidationPanel from "@/interview/ValidationPanel";
import InstructionsPanel from "@/interview/InstructionsPanel";
import InterviewMode from "@/interview/InterviewMode";
import ChatInput from "@/chat/ChatInput";
import "./MainContent.css";

export default function MainContent({
  messages = [],
  selectedFeature,
  selectedTask,
  setSelectedTask,
  isLoading,
  handleSend,
  handleTaskSelect,
}) {
  /* ------------------------------------------------------------
     INTERVIEW BOT STATE
  ------------------------------------------------------------ */
  const [candidateState, setCandidateState] = useState({
    candidateName: "",
    candidateId: "",
    jdId: "",
    jdText: "",
  });

  /* ------------------------------------------------------------
     HERO QUICK START SUPPORT
  ------------------------------------------------------------ */
  const [pendingTask, setPendingTask] = useState(null);

  const handleQuickStart = (task) => {
    setPendingTask(task);
    handleTaskSelect?.(task);

    // trigger state update
    setTimeout(() => handleSend(""), 50);
  };

  /* ------------------------------------------------------------
     INTERVIEW BOT OVERRIDE MODE
  ------------------------------------------------------------ */
  if (selectedFeature === "InterviewBot") {
    if (selectedTask === "validation") {
      return (
        <div className="vp-page">
          <ValidationPanel
            onNext={(data) => {
              setCandidateState(data);
              setSelectedTask("instructions");
            }}
          />
        </div>
      );
    }

    if (selectedTask === "instructions") {
      return (
        <div className="mc-interview-wrapper">
          <InstructionsPanel
            candidateName={candidateState.candidateName}
            jd_text={candidateState.jdText}
            onNext={() => {
              setSelectedTask("interview");
            }}
          />
        </div>
      );
    }

    if (selectedTask === "interview") {
      return (
        <div className="mc-interview-wrapper">
          <InterviewMode
            candidateName={candidateState.candidateName}
            candidateId={candidateState.candidateId}
            jd_text={candidateState.jdText}
            jd_id={candidateState.jdId}
          />
        </div>
      );
    }

    return <div className="mc-interview-wrapper">⚠️ No task active</div>;
  }

  /* ------------------------------------------------------------
     DEFAULT CHAT MODE + HERO
  ------------------------------------------------------------ */
  const showHero =
    messages.length === 0 &&
    !selectedFeature &&
    !selectedTask;

  return (
    <div className="mc-root">

      {showHero ? (
        /* ------------------------------------------------------------
           HERO SECTION
        ------------------------------------------------------------ */
        <section className="mc-hero">
          <div className="mc-hero-inner">

            <h1 className="mc-title">
              Welcome to <span className="mc-accent">PrimeHire AI</span>
            </h1>

            <p className="mc-subtitle">
              Your unified AI recruiting assistant — create JDs, match profiles,
              automate interviews, and manage hiring operations.
            </p>

            {/* ACTION CARDS */}
            <div className="mc-actions-grid">
              {[
                ["📝", "JD Creator", "Generate job descriptions instantly."],
                ["🎯", "Profile Matcher", "AI-ranked resumes in seconds."],
                ["📤", "Upload Resumes", "Parse & extract candidate insights."],
                // ["🎤", "InterviewBot", "Automated AI-powered interviews."],
                // ["📌", "Candidate Status", "Track your entire pipeline."],
                // ["📝", "JD History", "View your previously generated JDs."],
                // ["📈", "Match History", "Review past match results."],
              ].map(([icon, label, desc]) => (
                <div
                  key={label}
                  className="mc-action-card"
                  onClick={() => handleQuickStart(label)}
                >
                  <span className="mc-icon">{icon}</span>
                  <h3>{label}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>

            {/* 🚫 ChatInput removed — handled globally in Index.jsx */}

          </div>
        </section>
      ) : (
        /* ------------------------------------------------------------
           CHAT MODE ONLY
        ------------------------------------------------------------ */
        <div className="mc-chat-mode">
          <div className="mc-chat-scroll">
            <ChatContainer
              messages={messages}
              selectedFeature={selectedFeature}
              selectedTask={selectedTask}
              isLoading={isLoading}
            />
          </div>

          {/* 🚫 ChatInput removed — handled globally in Index.jsx */}
          {/* Sticky Chat Input INSIDE MainContent */}
          <div className="mc-chatinput-wrapper">
            <ChatInput
              onSend={handleSend}
              activeTask={pendingTask || selectedTask}
              forceShowChips={true}
            />
          </div>

        </div>
      )}

    </div>
  );
}
// import React, { useState } from "react";
// import ChatContainer from "@/chat/ChatContainer";
// import ChatInput from "@/chat/ChatInput";

// import ValidationPanel from "@/interview/ValidationPanel";
// import InstructionsPanel from "@/interview/InstructionsPanel";
// import InterviewMode from "@/interview/InterviewMode";

// import "./MainContent.css";

// export default function MainContent({
//   messages = [],
//   selectedFeature,
//   selectedTask,
//   setSelectedTask,
//   isLoading,
//   handleSend,
//   handleTaskSelect,
// }) {
//   /* ------------------------------------------------------------
//      INTERVIEW BOT STATE
//   ------------------------------------------------------------ */
//   const [candidateState, setCandidateState] = useState({
//     candidateName: "",
//     candidateId: "",
//     jdId: "",
//     jdText: "",
//   });

//   /* ------------------------------------------------------------
//      QUICK START (Hero Cards)
//   ------------------------------------------------------------ */
//   const [pendingTask, setPendingTask] = useState(null);

//   const handleQuickStart = (task) => {
//     setPendingTask(task);
//     handleTaskSelect?.(task);

//     setTimeout(() => handleSend(""), 50);
//   };

//   /* ------------------------------------------------------------
//      INTERVIEW BOT ROUTING
//   ------------------------------------------------------------ */
//   if (selectedFeature === "InterviewBot") {
//     if (selectedTask === "validation") {
//       return (
//         <div className="vp-page">
//           <ValidationPanel
//             onNext={(data) => {
//               setCandidateState(data);
//               setSelectedTask("instructions");
//             }}
//           />
//         </div>
//       );
//     }

//     if (selectedTask === "instructions") {
//       return (
//         <div className="mc-interview-wrapper">
//           <InstructionsPanel
//             candidateName={candidateState.candidateName}
//             jd_text={candidateState.jdText}
//             onNext={() => setSelectedTask("interview")}
//           />
//         </div>
//       );
//     }

//     if (selectedTask === "interview") {
//       return (
//         <div className="mc-interview-wrapper">
//           <InterviewMode
//             candidateName={candidateState.candidateName}
//             candidateId={candidateState.candidateId}
//             jd_text={candidateState.jdText}
//             jd_id={candidateState.jdId}
//           />
//         </div>
//       );
//     }

//     return <div className="mc-interview-wrapper">⚠️ No task active</div>;
//   }

//   /* ------------------------------------------------------------
//      DEFAULT CHAT MODE
//   ------------------------------------------------------------ */
//   const showHero =
//     messages.length === 0 &&
//     !selectedFeature &&
//     !selectedTask;

//   return (
//     <div className="mc-root">

//       {showHero ? (
//         /* ---------------- HERO MODE ---------------- */
//         <section className="mc-hero">
//           <div className="mc-hero-inner">

//             <h1 className="mc-title">
//               Welcome to <span className="mc-accent">PrimeHire AI</span>
//             </h1>

//             <p className="mc-subtitle">
//               Your unified AI recruiting assistant — create JDs, match profiles,
//               automate interviews, and manage hiring operations.
//             </p>

//             <div className="mc-actions-grid">
//               {[
//                 ["📝", "JD Creator", "Generate job descriptions instantly."],
//                 ["🎯", "Profile Matcher", "AI-ranked resumes in seconds."],
//                 ["📤", "Upload Resumes", "Extract candidate insights instantly."],
//                 ["🎤", "InterviewBot", "Automated AI-powered interviews."],
//                 ["📌", "Candidate Status", "Track your entire hiring pipeline."],
//                 ["📝", "JD History", "View previously generated job descriptions."],
//                 ["📈", "Match History", "Review past match results."],
//               ].map(([icon, label, desc]) => (
//                 <div
//                   key={label}
//                   className="mc-action-card"
//                   onClick={() => handleQuickStart(label)}
//                 >
//                   <span className="mc-icon">{icon}</span>
//                   <h3>{label}</h3>
//                   <p>{desc}</p>
//                 </div>
//               ))}
//             </div>

//           </div>
//         </section>
//       ) : (
//         /* ---------------- CHAT MODE ---------------- */
//         <div className="mc-chat-mode">

//           {/* Scrollable messages */}
//           <div className="mc-chat-scroll">
//             <ChatContainer
//               messages={messages}
//               selectedFeature={selectedFeature}
//               selectedTask={selectedTask}
//               isLoading={isLoading}
//             />
//           </div>

//           {/* Sticky Chat Input INSIDE MainContent */}
//           <div className="mc-chatinput-wrapper">
//             <ChatInput
//               onSend={handleSend}
//               activeTask={pendingTask || selectedTask}
//               forceShowChips={true}
//             />
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }
