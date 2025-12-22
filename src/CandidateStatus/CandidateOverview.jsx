// // import React, { useEffect, useState } from "react";
// // import { useParams, Link } from "react-router-dom";
// // import { API_BASE } from "@/utils/constants";
// // import "./CandidateOverview.css";
// // import logo from "../assets/primehire_logo.png";


// // export default function CandidateOverview() {
// //     const { id } = useParams(); // attempt_id
// //     const [data, setData] = useState(null);

// //     const fetchDetails = async () => {
// //         try {
// //             const res = await fetch(`${API_BASE}/mcp/tools/jd_history/scheduler/attempt_detail/${id}`);
// //             const json = await res.json();
// //             if (json.ok) setData(json);
// //         } catch (err) {
// //             console.error("Error loading candidate detail", err);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchDetails();
// //     }, [id]);

// //     if (!data) return <p>Loading...</p>;

// //     const attempt = data.attempt;
// //     const candidate = data.candidate || {};
// //     const jd = data.jd || {};

// //     return (
// //         <div className="candidate-status-container">
// //             <Link to={"/"}>
// //                 <div className="top-header1">
// //                     <img src={logo} alt="Logo" className="top-logo2" />
// //                 </div>
// //             </Link>

// //             <h2 className="title">CANDIDATE STATUS</h2>

// //             <div className="status-card">

// //                 {/* Profile Section */}
// //                 <div className="profile-section">
// //                     <div className="profile-img-placeholder">
// //                         {candidate.full_name?.charAt(0)}
// //                     </div>

// //                     <h3 className="candidate-name">{candidate.full_name}</h3>
// //                     <p className="candidate-role">{jd.designation || "Role not specified"}</p>

// //                     <div className="interview-score">
// //                         <span>{attempt.progress}</span>
// //                         <span className="score">Score: {attempt.interview_score ?? "—"}</span>
// //                     </div>

// //                     <p className="contact-email">{candidate.email ?? "No email"}</p>
// //                     <p className="contact-phone">{candidate.phone ?? "Phone not available"}</p>
// //                 </div>

// //                 {/* Right Section */}
// //                 <div className="content-section">

// //                     {/* JD DETAILS */}
// //                     <div className="box">
// //                         <h4>JD Details</h4>
// //                         <div className="info-grid">
// //                             <p>JD ID</p><span>{jd.id}</span>
// //                             <p>Designation</p><span>{jd.designation}</span>
// //                             <p>Description</p><span>{jd.jd_text?.slice(0, 200)}...</span>
// //                         </div>
// //                     </div>

// //                     {/* INTERVIEW PROGRESS */}
// //                     <div className="box">
// //                         <h4>Interview Progress</h4>
// //                         <div className="progress-bar">
// //                             <div className={`step active`}></div>
// //                             <div className={`step ${attempt.interview_score ? "active" : ""}`}></div>
// //                             <div className={`step`}></div>
// //                         </div>
// //                         <div className="progress-labels">
// //                             <span>Scheduled</span>
// //                             <span>Interviewed</span>
// //                             <span>Offer</span>
// //                         </div>
// //                     </div>

// //                     {/* PROFILE MATCH / SCORES */}
// //                     <div className="box half">
// //                         <h4>Score Breakdown</h4>
// //                         <p>AI Score <span>{attempt.ai_score ?? 0}</span></p>
// //                         <p>Manual Score <span>{attempt.manual_score ?? 0}</span></p>
// //                         <p>Skill Score <span>{attempt.skill_score ?? 0}</span></p>
// //                     </div>

// //                     <div className="box">
// //                         <h4>Anomalies Detected</h4>

// //                         {attempt.anomalies?.length > 0 ? (
// //                             <ul className="anomaly-list">
// //                                 {attempt.anomalies.map((a, i) => (
// //                                     <li key={i}>
// //                                         <strong>{a.type}</strong> — {a.msg}
// //                                         <br />
// //                                         <small>{a.timestamp}</small>
// //                                     </li>
// //                                 ))}
// //                             </ul>
// //                         ) : (
// //                             <p>No anomalies recorded.</p>
// //                         )}
// //                     </div>


// //                     <div className="box half">
// //                         <h4>Metadata</h4>
// //                         <p>Created <span>{new Date(attempt.created_at).toLocaleString()}</span></p>
// //                         <p>Updated <span>{new Date(attempt.updated_at).toLocaleString()}</span></p>
// //                         <p>Token</p>
// //                         <span>{attempt.interview_token}</span>

// //                         <button className="resume-btn">Download Resume</button>
// //                     </div>

// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }
// // 📁 src/pages/CandidateOverview.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { API_BASE } from "@/utils/constants";
// import "./CandidateOverview.css";
// import logo from "../assets/primehire_logo.png";

// export default function CandidateOverview() {
//     const { id } = useParams(); // attempt_id
//     const [data, setData] = useState(null);
//     const [stats, setStats] = useState({});

//     /* -------------------------------------------------------
//        FETCH ATTEMPT DETAILS
//     ------------------------------------------------------- */
//     const fetchDetails = async () => {
//         try {
//             const res = await fetch(
//                 `${API_BASE}/mcp/tools/jd_history/scheduler/attempt_detail/${id}`
//             );
//             const json = await res.json();
//             if (json.ok) setData(json);
//         } catch (err) {
//             console.error("Error loading candidate detail", err);
//         }
//     };

//     /* -------------------------------------------------------
//        FETCH JD STATUS COUNTS
//     ------------------------------------------------------- */
//     const fetchStats = async (jdId) => {
//         if (!jdId) return;
//         try {
//             const res = await fetch(
//                 `${API_BASE}/mcp/tools/jd_history/scheduler/jd_stats/${jdId}`
//             );
//             const json = await res.json();
//             if (json.ok) setStats(json.stats || {});
//         } catch (err) {
//             console.error("Error loading JD stats", err);
//         }
//     };

//     useEffect(() => {
//         fetchDetails();
//     }, [id]);

//     useEffect(() => {
//         if (data?.jd?.id) {
//             fetchStats(data.jd.id);
//         }
//     }, [data?.jd?.id]);

//     if (!data) return <p>Loading...</p>;

//     const attempt = data.attempt || {};
//     const candidate = data.candidate || {};
//     const jd = data.jd || {};

//     const resolvedName =
//         candidate.full_name ||
//         attempt.candidate_id?.split("@")[0] ||
//         "Candidate";

//     const resolvedEmail =
//         candidate.email || attempt.candidate_id || "No email";

//     /* -------------------------------------------------------
//        STATUS HELPERS
//     ------------------------------------------------------- */
//     const isCompleted = attempt.status === "COMPLETED";
//     const isInProgress = attempt.status === "IN_PROGRESS";

//     return (
//         <div className="candidate-status-container">
//             {/* HEADER */}
//             <Link to={"/"}>
//                 <div className="top-header1">
//                     <img src={logo} alt="PrimeHire" className="top-logo2" />
//                 </div>
//             </Link>

//             <h2 className="title">CANDIDATE STATUS</h2>

//             <div className="status-card">
//                 {/* =====================================================
//             LEFT: PROFILE
//         ===================================================== */}
//                 <div className="profile-section">
//                     <div className="profile-img-placeholder">
//                         {resolvedName.charAt(0).toUpperCase()}
//                     </div>

//                     <h3 className="candidate-name">{resolvedName}</h3>
//                     <p className="candidate-role">
//                         {jd.designation || "Role not specified"}
//                     </p>

//                     <div className="interview-score">
//                         <span className={`status-pill status-${attempt.status?.toLowerCase()}`}>
//                             {attempt.status}
//                         </span>
//                         <span className="score">
//                             Score: {attempt.interview_score ?? "—"}
//                         </span>
//                     </div>

//                     <p className="contact-email">{resolvedEmail}</p>
//                     <p className="contact-phone">
//                         {candidate.phone || "Phone not available"}
//                     </p>
//                 </div>

//                 {/* =====================================================
//             RIGHT: DETAILS
//         ===================================================== */}
//                 <div className="content-section">
//                     {/* JD DETAILS */}
//                     <div className="box">
//                         <h4>JD Details</h4>
//                         <div className="info-grid">
//                             <p>JD ID</p><span>{jd.id}</span>
//                             <p>Designation</p><span>{jd.designation}</span>
//                             <p>Description</p>
//                             <span>{jd.jd_text?.slice(0, 200) || "—"}...</span>
//                         </div>
//                     </div>

//                     {/* INTERVIEW PROGRESS */}
//                     <div className="box">
//                         <h4>Interview Progress</h4>
//                         <div className="progress-bar">
//                             <div className={`step active`} />
//                             <div className={`step ${isInProgress || isCompleted ? "active" : ""}`} />
//                             <div className={`step ${isCompleted ? "active" : ""}`} />
//                         </div>
//                         <div className="progress-labels">
//                             <span>Scheduled</span>
//                             <span>Interviewed</span>
//                             <span>Completed</span>
//                         </div>
//                     </div>

//                     {/* SCORE BREAKDOWN */}
//                     <div className="box half">
//                         <h4>Score Breakdown</h4>
//                         <p>AI Score <span>{attempt.ai_score ?? 0}</span></p>
//                         <p>Manual Score <span>{attempt.manual_score ?? 0}</span></p>
//                         <p>Skill Score <span>{attempt.skill_score ?? 0}</span></p>
//                     </div>

//                     {/* ANOMALIES */}
//                     <div className="box">
//                         <h4>Anomalies Detected</h4>
//                         {attempt.anomalies?.length > 0 ? (
//                             <ul className="anomaly-list">
//                                 {attempt.anomalies.map((a, i) => (
//                                     <li key={i}>
//                                         <strong>{a.type}</strong> — {a.msg}
//                                         <br />
//                                         <small>{a.timestamp}</small>
//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <p>No anomalies recorded.</p>
//                         )}
//                     </div>

//                     {/* JD SUMMARY COUNTS */}
//                     <div className="box half">
//                         <h4>JD Summary</h4>
//                         <p>Scheduled <span>{stats.SCHEDULED ?? 0}</span></p>
//                         <p>In Progress <span>{stats.IN_PROGRESS ?? 0}</span></p>
//                         <p>Completed <span>{stats.COMPLETED ?? 0}</span></p>
//                         <p>Expired <span>{stats.EXPIRED ?? 0}</span></p>
//                     </div>

//                     {/* METADATA */}
//                     <div className="box half">
//                         <h4>Metadata</h4>
//                         <p>Created <span>{new Date(attempt.created_at).toLocaleString()}</span></p>
//                         <p>Updated <span>{new Date(attempt.updated_at).toLocaleString()}</span></p>
//                         <p>Token</p>
//                         <span className="token-text">{attempt.interview_token}</span>

//                         <button className="resume-btn">Download Resume</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE } from "@/utils/constants";
import "./CandidateOverview.css";
import logo from "../assets/primehire_logo.png";

/* =========================
   STRIP JD HTML (YOUR FN)
========================= */
function stripHtml(html) {
    if (!html) return "";

    html = html.replace(/📋\s*Copy JD/gi, "");
    html = html.replace(/<button[\s\S]*?<\/button>/gi, "");
    html = html.replace(/<h2>How to Apply[\s\S]*?<\/p>/gi, "");
    html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
    html = html.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
    html = html.replace(/<li>/gi, "- ");
    html = html.replace(/<br\s*\/?>/gi, "\n");
    html = html.replace(/<\/p>/gi, "\n");
    html = html.replace(/<\/h[1-6]>/gi, "\n");
    html = html.replace(/<[^>]+>/g, "");
    html = html.replace(/\n\s*\n\s*\n+/g, "\n\n");

    return html.trim();
}

export default function CandidateOverview() {
    const { id } = useParams(); // attempt_id
    const [data, setData] = useState(null);

    /* ---------------- FETCH DETAILS ---------------- */
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(
                    `${API_BASE}/mcp/tools/jd_history/scheduler/attempt_detail/${id}`
                );
                const json = await res.json();
                if (json.ok) setData(json);
            } catch (e) {
                console.error("Failed to load candidate overview", e);
            }
        })();
    }, [id]);

    if (!data) return <p>Loading...</p>;

    const attempt = data.attempt || {};
    const candidate = data.candidate || {};
    const jd = data.jd || {};

    /* ---------------- RESOLVE EVALUATION ---------------- */
    const evaluation = data.evaluation || {};


    const {
        technical = 0,
        communication = 0,
        behaviour = 0,
        mcq = null,
        coding = null,
        per_question = []
    } = evaluation;

    /* ---------------- RESOLVE ANOMALY COUNTS ---------------- */
    const anomalyCounts = {};
    (attempt.anomalies || []).forEach(a => {
        if (!a.type) return;
        anomalyCounts[a.type] = (anomalyCounts[a.type] || 0) + 1;
    });

    const resolvedName =
        candidate.full_name ||
        attempt.candidate_id?.split("@")[0] ||
        "Candidate";

    const resolvedEmail =
        candidate.email || attempt.candidate_id || "—";

    const cleanJD = stripHtml(jd.jd_text || "");

    const isScheduled = attempt.status === "SCHEDULED";
    const isInProgress = attempt.status === "IN_PROGRESS";
    const isCompleted = attempt.status === "COMPLETED" || attempt.status === "LOCKED";

    return (
        <div className="candidate-status-container">
            {/* HEADER */}
            <Link to="/">
                <div className="top-header1">
                    <img src={logo} alt="PrimeHire" className="top-logo2" />
                </div>
            </Link>

            <h2 className="title">Candidate Overview</h2>

            <div className="status-card">

                {/* ================= LEFT ================= */}
                <div className="profile-section">
                    <div className="profile-img-placeholder">
                        {resolvedName.charAt(0).toUpperCase()}
                    </div>

                    <h3 className="candidate-name">{resolvedName}</h3>
                    <p className="candidate-role">
                        {jd.designation || "Role not specified"}
                    </p>

                    <div className="interview-score">
                        <span className={`status-pill status-${attempt.status?.toLowerCase()}`}>
                            {attempt.status}
                        </span>
                        <span className="score">
                            Final Score: {attempt.interview_score ?? "—"}
                        </span>
                    </div>

                    <p className="contact-email">{resolvedEmail}</p>
                </div>

                {/* ================= RIGHT ================= */}
                <div className="content-section">

                    {/* JD DETAILS */}
                    <div className="box">
                        <h4>Job Description</h4>
                        <pre className="jd-text">{cleanJD || "—"}</pre>
                    </div>

                    {/* PROGRESS */}
                    <div className="box">
                        <h4>Interview Progress</h4>
                        <div className="progress-bar">
                            <div className={`step active`} />
                            <div className={`step ${isInProgress || isCompleted ? "active" : ""}`} />
                            <div className={`step ${isCompleted ? "active" : ""}`} />
                        </div>
                        <div className="progress-labels">
                            <span>Scheduled</span>
                            <span>Interviewed</span>
                            <span>Completed</span>
                        </div>
                    </div>

                    {/* SCORE BREAKDOWN */}
                    <div className="box half">
                        <h4>Score Breakdown</h4>
                        <p>Technical <span>{technical}</span></p>
                        <p>Communication <span>{communication}</span></p>
                        <p>Behaviour <span>{behaviour}</span></p>
                    </div>

                    {/* MCQ */}
                    <div className="box">
                        <h4>MCQ Evaluation</h4>
                        {!mcq ? (
                            <p>No MCQ data.</p>
                        ) : (
                            <p>
                                Score: <strong>{mcq.score}/{mcq.total}</strong>
                            </p>
                        )}
                    </div>

                    {/* CODING */}
                    <div className="box">
                        <h4>Coding Test</h4>
                        {!coding ? (
                            <p>No coding test.</p>
                        ) : (
                            <>
                                <p>Score: <strong>{coding.score}</strong></p>
                                <pre className="code">
                                    {coding.solution || "No solution submitted"}
                                </pre>
                            </>
                        )}
                    </div>

                    {/* AI INTERVIEW */}
                    <div className="box">
                        <h4>AI Interview (Q & A)</h4>
                        {per_question.length === 0 ? (
                            <p>No AI interview responses.</p>
                        ) : (
                            per_question.map((q, i) => (
                                <div key={i} className="qa-block">
                                    <p><strong>Q:</strong> {q.question}</p>
                                    <p><strong>A:</strong> {q.answer}</p>
                                </div>
                            ))
                        )}
                    </div>
                    {/* ================= METADATA ================= */}
                    <div className="box half">
                        <h4>Metadata</h4>

                        <p>
                            Created
                            <span>
                                {attempt.created_at
                                    ? new Date(attempt.created_at).toLocaleString()
                                    : "—"}
                            </span>
                        </p>

                        <p>
                            Updated
                            <span>
                                {attempt.updated_at
                                    ? new Date(attempt.updated_at).toLocaleString()
                                    : "—"}
                            </span>
                        </p>

                        <p>Token</p>
                        <span className="token-text">
                            {attempt.interview_token || "—"}
                        </span>
                    </div>

                    {/* ANOMALIES (COUNTS ONLY) */}
                    <div className="box">
                        <h4>Anomalies Detected</h4>
                        {Object.keys(anomalyCounts).length === 0 ? (
                            <p>No anomalies detected.</p>
                        ) : (
                            <div className="anomaly-count-grid">
                                {Object.entries(anomalyCounts).map(([k, v]) => (
                                    <div key={k} className="anomaly-pill">
                                        <strong>{k.replace(/_/g, " ")}</strong>
                                        <span>{v}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
