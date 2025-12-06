// // // FILE: src/interview/InterviewMode.jsx
// // import React, { useState, useEffect } from "react";
// // import { useLocation } from "react-router-dom";

// // import WebcamRecorder from "./WebcamRecorder";
// // import TranscriptPanel from "./TranscriptPanel";
// // import LiveInsightsPanel from "./LiveInsightsPanel";
// // import AIChartPanel from "./AIChartPanel";
// // import InterviewToolbar from "./InterviewToolbar";

// // import "./InterviewMode.css";

// // export default function InterviewMode() {
// //     const location = useLocation();

// //     const candidateName = location.state?.candidateName || "Anonymous";
// //     const initialCandidateId = location.state?.candidateId || null;
// //     const jdText = location.state?.jd_text || "";

// //     const [candidateId, setCandidateId] = useState(initialCandidateId);
// //     const [transcript, setTranscript] = useState([]);

// //     // Global event → add transcript entry
// //     useEffect(() => {
// //         const handler = (e) => {
// //             const msg = e.detail;
// //             setTranscript((prev) => [...prev, msg]);
// //         };
// //         window.addEventListener("transcriptAdd", handler);
// //         return () => window.removeEventListener("transcriptAdd", handler);
// //     }, []);

// //     return (
// //         <div className="interview-root">

// //             <div className="interview-toolbar-container">
// //                 <InterviewToolbar
// //                     candidateId={candidateId}
// //                     candidateName={candidateName}
// //                     jdText={jdText}
// //                 />

// //             </div>

// //             <div className="interview-layout">

// //                 {/* LEFT SIDE */}
// //                 <div className="left-panel">

// //                     <div className="video-wrapper">
// //                         <WebcamRecorder
// //                             candidateName={candidateName}
// //                             candidateId={candidateId}
// //                             jdText={jdText}
// //                             onCandidateId={setCandidateId}
// //                         />
// //                     </div>

// //                     <div className="insight-score-row">
// //                         <div className="insights-box">
// //                             <LiveInsightsPanel candidateId={candidateId} />
// //                         </div>

// //                         <div className="aichart-box">
// //                             <AIChartPanel />
// //                         </div>
// //                     </div>

// //                 </div>

// //                 {/* RIGHT SIDE */}
// //                 <div className="right-panel">
// //                     <TranscriptPanel
// //                         transcript={transcript}
// //                         jdId={location.state?.jd_id || null}
// //                         jdText={jdText}
// //                     />

// //                 </div>

// //             </div>
// //         </div>
// //     );
// // }
// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { API_BASE } from "@/utils/constants";

// import WebcamRecorder from "./WebcamRecorder";
// import TranscriptPanel from "./TranscriptPanel";
// import LiveInsightsPanel from "./LiveInsightsPanel";
// import AIChartPanel from "./AIChartPanel";
// import InterviewToolbar from "./InterviewToolbar";

// import "./InterviewMode.css";

// export default function InterviewMode() {
//     const location = useLocation();
//     const navigate = useNavigate();

//     const candidateName = location.state?.candidateName || "Anonymous";
//     const initialCandidateId = location.state?.candidateId || null;
//     const jdText = location.state?.jd_text || "";

//     const [candidateId, setCandidateId] = useState(initialCandidateId);
//     const [transcript, setTranscript] = useState([]);

//     const [insights, setInsights] = useState({});
//     const [anomalyCounts, setAnomalyCounts] = useState({});

//     // Transcript listener
//     useEffect(() => {
//         const handler = (e) => {
//             setTranscript((prev) => [...prev, e.detail]);
//         };
//         window.addEventListener("transcriptAdd", handler);
//         return () => window.removeEventListener("transcriptAdd", handler);
//     }, []);

//     // Insights listener
//     useEffect(() => {
//         const handler = (e) => {
//             setInsights(e.detail);
//             setAnomalyCounts(e.detail.counts || {});
//         };
//         window.addEventListener("liveInsightsUpdate", handler);
//         return () => window.removeEventListener("liveInsightsUpdate", handler);
//     }, []);

//     // STOP interview → Evaluate
//     useEffect(() => {
//         const stopHandler = async () => {
//             if (!candidateId) return;

//             const fd = new FormData();
//             fd.append("candidate_name", candidateName);
//             fd.append("candidate_id", candidateId);
//             fd.append("job_description", jdText);

//             const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/evaluate-transcript`, {
//                 method: "POST",
//                 body: fd,
//             });

//             const d = await r.json();

//             if (d.ok) {
//                 navigate("/certificatedata", {
//                     state: {
//                         scores: d.scores,
//                         candidateName,
//                         candidateId,
//                         overall: d.overall,
//                         result: d.result,
//                         feedback: d.feedback,
//                         designation: d.designation,

//                         // NEW: Full dataset
//                         transcript,
//                         insights,
//                         anomalyCounts,
//                     }
//                 });
//             } else {
//                 alert("Evaluation failed: " + d.error);
//             }
//         };

//         window.addEventListener("stopInterview", stopHandler);
//         return () => window.removeEventListener("stopInterview", stopHandler);
//     }, [candidateId, transcript, insights, anomalyCounts]);

//     return (
//         <div className="interview-root">
//             <div className="interview-toolbar-container">
//                 <InterviewToolbar
//                     candidateId={candidateId}
//                     candidateName={candidateName}
//                     jdText={jdText}
//                 />
//             </div>

//             <div className="interview-layout">
//                 <div className="left-panel">
//                     <div className="video-wrapper">
//                         <WebcamRecorder
//                             candidateName={candidateName}
//                             candidateId={candidateId}
//                             jdText={jdText}
//                             onCandidateId={setCandidateId}
//                         />
//                     </div>

//                     <div className="insight-score-row">
//                         <div className="insights-box">
//                             <LiveInsightsPanel candidateId={candidateId} />
//                         </div>

//                         <div className="aichart-box">
//                             <AIChartPanel />
//                         </div>
//                     </div>
//                 </div>

//                 <div className="right-panel">
//                     <TranscriptPanel
//                         transcript={transcript}
//                         jdId={location.state?.jd_id || null}
//                         jdText={jdText}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }
// FILE: src/interview/InterviewMode.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "@/utils/constants";

import WebcamRecorder from "./WebcamRecorder";
import TranscriptPanel from "./TranscriptPanel";
import LiveInsightsPanel from "./LiveInsightsPanel";
import AIChartPanel from "./AIChartPanel";
import InterviewToolbar from "./InterviewToolbar";

import "./InterviewMode.css";

export default function InterviewMode() {
    const location = useLocation();
    const navigate = useNavigate();

    const candidateName = location.state?.candidateName || "Anonymous";
    const initialCandidateId = location.state?.candidateId || null;
    const jdText = location.state?.jd_text || "";
    const jdId = location.state?.jd_id || null;

    const [candidateId, setCandidateId] = useState(initialCandidateId);
    const [transcript, setTranscript] = useState([]);

    const [insights, setInsights] = useState({});
    const [anomalyCounts, setAnomalyCounts] = useState({});
    const [perQuestion, setPerQuestion] = useState([]);

    // Transcript collector
    useEffect(() => {
        const handler = (e) => {
            setTranscript((prev) => [...prev, e.detail]);
        };
        window.addEventListener("transcriptAdd", handler);
        return () => window.removeEventListener("transcriptAdd", handler);
    }, []);

    // Insights collector
    useEffect(() => {
        const handler = (e) => {
            setInsights(e.detail);
            setAnomalyCounts(e.detail.counts || {});
        };
        window.addEventListener("liveInsightsUpdate", handler);
        return () => window.removeEventListener("liveInsightsUpdate", handler);
    }, []);

    // STOP INTERVIEW → Evaluate transcript and navigate
    useEffect(() => {
        const stopHandler = async () => {
            if (!candidateId) return alert("Candidate ID missing");

            const fd = new FormData();
            fd.append("candidate_name", candidateName);
            fd.append("candidate_id", candidateId);
            fd.append("job_description", jdText);
            if (jdId) fd.append("jd_id", jdId);

            const r = await fetch(
                `${API_BASE}/mcp/interview_bot_beta/evaluate-transcript`,
                { method: "POST", body: fd }
            );
            const d = await r.json();

            if (!d.ok) {
                alert("Evaluation failed: " + d.error);
                return;
            }

            navigate("/certificatedata", {
                state: {
                    ...d,              // backend output
                    transcript,        // frontend transcript
                    insights,          // face insights
                    anomalyCounts,     // anomaly summary
                },
            });
        };

        window.addEventListener("stopInterview", stopHandler);
        return () => window.removeEventListener("stopInterview", stopHandler);

    }, [candidateId, transcript, insights, anomalyCounts]);

    return (
        <div className="interview-root">

            <div className="interview-toolbar-container">
                <InterviewToolbar
                    candidateId={candidateId}
                    candidateName={candidateName}
                    jdText={jdText}
                />
            </div>

            <div className="interview-layout">

                {/* LEFT SIDE */}
                <div className="left-panel">

                    <div className="video-wrapper">
                        <WebcamRecorder
                            candidateName={candidateName}
                            candidateId={candidateId}
                            jdText={jdText}
                            onCandidateId={setCandidateId}
                        />
                    </div>

                    <div className="insight-score-row">
                        <div className="insights-box">
                            <LiveInsightsPanel candidateId={candidateId} />
                        </div>

                        <div className="aichart-box">
                            <AIChartPanel />
                        </div>
                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="right-panel">
                    <TranscriptPanel
                        transcript={transcript}
                        jdId={jdId}
                        jdText={jdText}
                    />
                </div>

            </div>
        </div>
    );
}
