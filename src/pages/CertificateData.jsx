
// import React, { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Download, Lock } from "lucide-react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import "./CertificateData.css";
// import logo from "../assets/primehire_logo.png";
// import { API_BASE } from "@/utils/constants";

// export default function CertificateData() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const {
//     scores = [],
//     candidateName = "Anonymous",
//     candidateId = null,
//     overall = 0,
//     result = "FAIL",
//     feedback = "",
//     designation = "",
//   } = location.state || {};

//   const [faceImage, setFaceImage] = useState("/api/placeholder/80/80");

//   useEffect(() => {
//     if (!candidateId || !candidateName) return;

//     (async () => {
//       try {
//         const res = await fetch(
//           `${API_BASE}/mcp/tools/candidate_validation/get_face_image/${candidateName}/${candidateId}`
//         );
//         if (!res.ok) throw new Error("No image found");

//         const blob = await res.blob();
//         setFaceImage(URL.createObjectURL(blob));
//       } catch (err) {
//         console.warn("Face image not found:", err);
//       }
//     })();
//   }, [candidateId, candidateName]);

//   const handleDownload = async () => {
//     const el = document.querySelector(".certificate-container");
//     if (!el) return;

//     const canvas = await html2canvas(el, { scale: 2 });
//     const img = canvas.toDataURL("image/png");

//     const pdf = new jsPDF({
//       unit: "px",
//       format: [canvas.width, canvas.height],
//     });

//     pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
//     pdf.save(`${candidateName}_certificate.pdf`);
//   };

//   return (
//     <div className="certificate-page">
//       {/* NAVBAR */}
//       <nav className="navbar">
//         <Link to="/">
//           <img src={logo} alt="PrimeHire" className="nav-logo" />
//         </Link>
//       </nav>

//       {/* CERTIFICATE BOX */}
//       <div className="certificate-container">
//         {/* HEADER */}
//         <div className="certificate-header">
//           <h1>CERTIFICATE</h1>

//           <div className="user-info">
//             <div className="user-photo">
//               <img src={faceImage} alt="face" />
//             </div>

//             <div className="user-details">
//               <h2>{candidateName}</h2>
//               <div className="designation">{designation}</div>
//               <div className="date">{new Date().toLocaleDateString()}</div>

//               <div className="certificate-link">
//                 <Lock />
//                 {candidateId
//                   ? `certs.primehire.ai/${candidateId}`
//                   : "Not available"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* RESULT */}
//         <div className="result-container">
//           <h2 className={result === "PASS" ? "pass" : "fail"}>{result}</h2>

//           <p>
//             <strong>Overall Score: </strong>
//             {overall}/100
//           </p>

//           <p>
//             <strong>Feedback: </strong>
//             {feedback}
//           </p>
//         </div>

//         {/* SCORES WITH RANGE BAR */}
//         <div className="scores-container">
//           {scores.map((s, i) => (
//             <div key={i} className="score-item">
//               <div className="score-header">
//                 <strong>{s.title}</strong>
//                 <strong>{s.score}</strong>
//               </div>

//               <div className="score-description">{s.description}</div>

//               {/* RANGE BAR */}
//               <div className="range-bar-container">
//                 <span className="range-min">10</span>

//                 <div className="range-bar">
//                   <div className="range-highlight"></div>
//                   <div className="range-highlight"></div>
//                   <div className="range-highlight"></div>
//                 </div>

//                 <span className="range-max">100</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* DOWNLOAD BUTTON */}
//         <div className="download-wrapper">
//           <button className="download-btn" onClick={handleDownload}>
//             <Download /> Download Certificate
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// FILE: src/pages/CertificateData.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Download, Lock } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./CertificateData.css";
import logo from "../assets/primehire_logo.png";
import { API_BASE } from "@/utils/constants";

export default function CertificateData() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    scores = [],
    candidateName = "Anonymous",
    candidateId = null,
    overall = 0,
    result = "FAIL",
    feedback = "",
    designation = "",

    // NEW ANALYTICS
    transcript = [],
    insights = {},
    anomalyCounts = {},
    per_question = []
  } = location.state || {};

  const [faceImage, setFaceImage] = useState("/api/placeholder/80/80");

  useEffect(() => {
    if (!candidateId || !candidateName) return;

    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/mcp/tools/candidate_validation/get_face_image/${candidateName}/${candidateId}`
        );
        if (!res.ok) throw new Error("No image found");

        const blob = await res.blob();
        setFaceImage(URL.createObjectURL(blob));
      } catch (err) {
        console.warn("Face image not found:", err);
      }
    })();
  }, [candidateId, candidateName]);

  const handleDownload = async () => {
    const el = document.querySelector(".certificate-container");
    if (!el) return;

    const canvas = await html2canvas(el, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${candidateName}_certificate.pdf`);
  };

  return (
    <div className="certificate-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <Link to="/">
          <img src={logo} alt="PrimeHire" className="nav-logo" />
        </Link>
      </nav>

      {/* CERTIFICATE BOX */}
      <div className="certificate-container">

        {/* HEADER */}
        <div className="certificate-header">
          <h1>CERTIFICATE</h1>

          <div className="user-info">
            <div className="user-photo">
              <img src={faceImage} alt="face" />
            </div>

            <div className="user-details">
              <h2>{candidateName}</h2>
              <div className="designation">{designation}</div>
              <div className="date">{new Date().toLocaleDateString()}</div>

              <div className="certificate-link">
                <Lock />
                {candidateId
                  ? `certs.primehire.ai/${candidateId}`
                  : "Not available"}
              </div>
            </div>
          </div>
        </div>

        {/* RESULT */}
        <div className="result-container">
          <h2 className={result === "PASS" ? "pass" : "fail"}>{result}</h2>

          <p><strong>Overall Score: </strong>{overall}/100</p>
          <p><strong>Feedback: </strong>{feedback}</p>
        </div>

        {/* SCORES */}
        <div className="scores-container">
          {scores.map((s, i) => (
            <div key={i} className="score-item">
              <div className="score-header">
                <strong>{s.title}</strong>
                <strong>{s.score}</strong>
              </div>
              <div className="score-description">{s.description}</div>

              <div className="range-bar-container">
                <span className="range-min">0</span>
                <div className="range-bar">
                  <div
                    className="range-highlight"
                    style={{ width: `${s.score}%` }}
                  ></div>
                </div>
                <span className="range-max">100</span>
              </div>
            </div>
          ))}
        </div>

        {/* DOWNLOAD */}
        <div className="download-wrapper">
          <button className="download-btn" onClick={handleDownload}>
            <Download /> Download Certificate
          </button>
        </div>
      </div>

      {/* ==================== ANALYTICS DASHBOARD ==================== */}
      <div className="analytics-container">

        <h2 className="analytics-title">Interview Analytics</h2>

        {/* ANOMALIES */}
        <section className="analytics-section">
          <h3>Anomaly Summary</h3>
          {Object.keys(anomalyCounts).length === 0 ? (
            <p>No anomalies detected.</p>
          ) : (
            <ul className="anomaly-list">
              {Object.entries(anomalyCounts).map(([k, v]) => (
                <li key={k}><strong>{k.replace(/_/g, " ")}</strong>: {v}</li>
              ))}
            </ul>
          )}
        </section>

        {/* PER-QUESTION */}
        <section className="analytics-section">
          <h3>Per-Question Breakdown</h3>

          {per_question?.length === 0 ? (
            <p>No question-answer pairs</p>
          ) : (
            per_question.map((q, idx) => (
              <div className="question-block" key={idx}>

                <div className="qa"><strong>Q:</strong> {q.question}</div>
                <div className="qa answer"><strong>A:</strong> {q.answer}</div>

                <div className="sub-analytics-row">

                  {/* CONFIDENCE */}
                  <div className="sub-card">
                    <h4>Confidence</h4>
                    <p>WPM: {q.analysis.confidence.wpm}</p>
                    <p>Fillers: {q.analysis.confidence.filler_count}</p>
                    <p>Score: {q.analysis.confidence.confidence_score}/100</p>
                    <div className="bar">
                      <div className="bar-fill"
                        style={{ width: q.analysis.confidence.confidence_score + "%" }}
                      ></div>
                    </div>
                  </div>

                  {/* DEPTH */}
                  <div className="sub-card">
                    <h4>Depth</h4>
                    <p>Buzzwords: {q.analysis.superficial.buzzword_hits}</p>
                    <p>Depth Score: {q.analysis.superficial.depth_score}/100</p>
                    <div className="bar">
                      <div className="bar-fill depth"
                        style={{ width: q.analysis.superficial.depth_score + "%" }}
                      ></div>
                    </div>
                  </div>

                  {/* AUTHENTICITY */}
                  <div className="sub-card">
                    <h4>Authenticity</h4>
                    <p>Score: {q.analysis.authenticity.authenticity_score}/100</p>
                    <p>Level: {q.analysis.authenticity.authenticity_level}</p>
                    <div className="bar">
                      <div className="bar-fill authenticity"
                        style={{
                          width: q.analysis.authenticity.authenticity_score + "%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

        </section>

        {/* TRANSCRIPT */}
        <section className="analytics-section">
          <h3>Transcript</h3>

          <div className="transcript-preview">
            {transcript.map((m, i) => (
              <div key={i} className={`transcript-line ${m.role}`}>
                <strong>{m.role.toUpperCase()}:</strong> {m.text}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
