// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { API_BASE } from "@/utils/constants";
// import "./CandidateOverview.css";
// import logo from "../assets/primehire_logo.png";


// export default function CandidateOverview() {
//     const { id } = useParams(); // attempt_id
//     const [data, setData] = useState(null);

//     const fetchDetails = async () => {
//         try {
//             const res = await fetch(`${API_BASE}/mcp/tools/jd_history/scheduler/attempt_detail/${id}`);
//             const json = await res.json();
//             if (json.ok) setData(json);
//         } catch (err) {
//             console.error("Error loading candidate detail", err);
//         }
//     };

//     useEffect(() => {
//         fetchDetails();
//     }, [id]);

//     if (!data) return <p>Loading...</p>;

//     const attempt = data.attempt;
//     const candidate = data.candidate || {};
//     const jd = data.jd || {};

//     return (
//         <div className="candidate-status-container">
//             <Link to={"/"}>
//                 <div className="top-header1">
//                     <img src={logo} alt="Logo" className="top-logo2" />
//                 </div>
//             </Link>

//             <h2 className="title">CANDIDATE STATUS</h2>

//             <div className="status-card">

//                 {/* Profile Section */}
//                 <div className="profile-section">
//                     <div className="profile-img-placeholder">
//                         {candidate.full_name?.charAt(0)}
//                     </div>

//                     <h3 className="candidate-name">{candidate.full_name}</h3>
//                     <p className="candidate-role">{jd.designation || "Role not specified"}</p>

//                     <div className="interview-score">
//                         <span>{attempt.progress}</span>
//                         <span className="score">Score: {attempt.interview_score ?? "—"}</span>
//                     </div>

//                     <p className="contact-email">{candidate.email ?? "No email"}</p>
//                     <p className="contact-phone">{candidate.phone ?? "Phone not available"}</p>
//                 </div>

//                 {/* Right Section */}
//                 <div className="content-section">

//                     {/* JD DETAILS */}
//                     <div className="box">
//                         <h4>JD Details</h4>
//                         <div className="info-grid">
//                             <p>JD ID</p><span>{jd.id}</span>
//                             <p>Designation</p><span>{jd.designation}</span>
//                             <p>Description</p><span>{jd.jd_text?.slice(0, 200)}...</span>
//                         </div>
//                     </div>

//                     {/* INTERVIEW PROGRESS */}
//                     <div className="box">
//                         <h4>Interview Progress</h4>
//                         <div className="progress-bar">
//                             <div className={`step active`}></div>
//                             <div className={`step ${attempt.interview_score ? "active" : ""}`}></div>
//                             <div className={`step`}></div>
//                         </div>
//                         <div className="progress-labels">
//                             <span>Scheduled</span>
//                             <span>Interviewed</span>
//                             <span>Offer</span>
//                         </div>
//                     </div>

//                     {/* PROFILE MATCH / SCORES */}
//                     <div className="box half">
//                         <h4>Score Breakdown</h4>
//                         <p>AI Score <span>{attempt.ai_score ?? 0}</span></p>
//                         <p>Manual Score <span>{attempt.manual_score ?? 0}</span></p>
//                         <p>Skill Score <span>{attempt.skill_score ?? 0}</span></p>
//                     </div>

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


//                     <div className="box half">
//                         <h4>Metadata</h4>
//                         <p>Created <span>{new Date(attempt.created_at).toLocaleString()}</span></p>
//                         <p>Updated <span>{new Date(attempt.updated_at).toLocaleString()}</span></p>
//                         <p>Token</p>
//                         <span>{attempt.interview_token}</span>

//                         <button className="resume-btn">Download Resume</button>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// }
// 📁 src/pages/CandidateOverview.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE } from "@/utils/constants";
import "./CandidateOverview.css";
import logo from "../assets/primehire_logo.png";

export default function CandidateOverview() {
    const { id } = useParams(); // attempt_id
    const [data, setData] = useState(null);
    const [stats, setStats] = useState({});

    /* -------------------------------------------------------
       FETCH ATTEMPT DETAILS
    ------------------------------------------------------- */
    const fetchDetails = async () => {
        try {
            const res = await fetch(
                `${API_BASE}/mcp/tools/jd_history/scheduler/attempt_detail/${id}`
            );
            const json = await res.json();
            if (json.ok) setData(json);
        } catch (err) {
            console.error("Error loading candidate detail", err);
        }
    };

    /* -------------------------------------------------------
       FETCH JD STATUS COUNTS
    ------------------------------------------------------- */
    const fetchStats = async (jdId) => {
        if (!jdId) return;
        try {
            const res = await fetch(
                `${API_BASE}/mcp/tools/jd_history/scheduler/jd_stats/${jdId}`
            );
            const json = await res.json();
            if (json.ok) setStats(json.stats || {});
        } catch (err) {
            console.error("Error loading JD stats", err);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    useEffect(() => {
        if (data?.jd?.id) {
            fetchStats(data.jd.id);
        }
    }, [data?.jd?.id]);

    if (!data) return <p>Loading...</p>;

    const attempt = data.attempt || {};
    const candidate = data.candidate || {};
    const jd = data.jd || {};

    const resolvedName =
        candidate.full_name ||
        attempt.candidate_id?.split("@")[0] ||
        "Candidate";

    const resolvedEmail =
        candidate.email || attempt.candidate_id || "No email";

    /* -------------------------------------------------------
       STATUS HELPERS
    ------------------------------------------------------- */
    const isCompleted = attempt.status === "COMPLETED";
    const isInProgress = attempt.status === "IN_PROGRESS";

    return (
        <div className="candidate-status-container">
            {/* HEADER */}
            <Link to={"/"}>
                <div className="top-header1">
                    <img src={logo} alt="PrimeHire" className="top-logo2" />
                </div>
            </Link>

            <h2 className="title">CANDIDATE STATUS</h2>

            <div className="status-card">
                {/* =====================================================
            LEFT: PROFILE
        ===================================================== */}
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
                            Score: {attempt.interview_score ?? "—"}
                        </span>
                    </div>

                    <p className="contact-email">{resolvedEmail}</p>
                    <p className="contact-phone">
                        {candidate.phone || "Phone not available"}
                    </p>
                </div>

                {/* =====================================================
            RIGHT: DETAILS
        ===================================================== */}
                <div className="content-section">
                    {/* JD DETAILS */}
                    <div className="box">
                        <h4>JD Details</h4>
                        <div className="info-grid">
                            <p>JD ID</p><span>{jd.id}</span>
                            <p>Designation</p><span>{jd.designation}</span>
                            <p>Description</p>
                            <span>{jd.jd_text?.slice(0, 200) || "—"}...</span>
                        </div>
                    </div>

                    {/* INTERVIEW PROGRESS */}
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
                        <p>AI Score <span>{attempt.ai_score ?? 0}</span></p>
                        <p>Manual Score <span>{attempt.manual_score ?? 0}</span></p>
                        <p>Skill Score <span>{attempt.skill_score ?? 0}</span></p>
                    </div>

                    {/* ANOMALIES */}
                    <div className="box">
                        <h4>Anomalies Detected</h4>
                        {attempt.anomalies?.length > 0 ? (
                            <ul className="anomaly-list">
                                {attempt.anomalies.map((a, i) => (
                                    <li key={i}>
                                        <strong>{a.type}</strong> — {a.msg}
                                        <br />
                                        <small>{a.timestamp}</small>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No anomalies recorded.</p>
                        )}
                    </div>

                    {/* JD SUMMARY COUNTS */}
                    <div className="box half">
                        <h4>JD Summary</h4>
                        <p>Scheduled <span>{stats.SCHEDULED ?? 0}</span></p>
                        <p>In Progress <span>{stats.IN_PROGRESS ?? 0}</span></p>
                        <p>Completed <span>{stats.COMPLETED ?? 0}</span></p>
                        <p>Expired <span>{stats.EXPIRED ?? 0}</span></p>
                    </div>

                    {/* METADATA */}
                    <div className="box half">
                        <h4>Metadata</h4>
                        <p>Created <span>{new Date(attempt.created_at).toLocaleString()}</span></p>
                        <p>Updated <span>{new Date(attempt.updated_at).toLocaleString()}</span></p>
                        <p>Token</p>
                        <span className="token-text">{attempt.interview_token}</span>

                        <button className="resume-btn">Download Resume</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
