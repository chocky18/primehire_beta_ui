// import React, { useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { Lock, Download } from 'lucide-react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import './CertificateData.css';
// import logo from '../assets/primehire_logo.png';
// import { API_BASE } from "@/utils/constants";

// export default function CertificateData() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { scores = [], candidateName = "Anonymous", candidateId = null } = location.state || {};
//   const [faceImage, setFaceImage] = useState("/api/placeholder/80/80");

//   // ✅ Fetch candidate face image
//   useEffect(() => {
//     const fetchFaceImage = async () => {
//       if (!candidateId || !candidateName) return;
//       try {
//         const res = await fetch(
//           `${API_BASE}/mcp/tools/candidate_validation/get_face_image/${candidateName}/${candidateId}`
//         );

//         if (!res.ok) throw new Error("Failed to fetch face image");

//         const blob = await res.blob();
//         const imageUrl = URL.createObjectURL(blob);
//         setFaceImage(imageUrl);
//       } catch (err) {
//         console.error("Failed to fetch face image:", err);
//       }
//     };

//     fetchFaceImage();
//   }, [candidateId, candidateName]);

//   // ✅ Download Certificate as PDF
//   const handleDownload = async () => {
//     const certificate = document.querySelector('.certificate-container');
//     if (!certificate) return;

//     const canvas = await html2canvas(certificate, { scale: 2 });
//     const imgData = canvas.toDataURL('image/png');

//     const pdf = new jsPDF({
//       orientation: 'portrait',
//       unit: 'px',
//       format: [canvas.width, canvas.height],
//     });

//     pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
//     pdf.save(`${candidateName}_Certificate.pdf`);
//   };

//   if (!scores.length) {
//     return (
//       <div className="certificate-page">
//         <div className="navbar">
//           <Link to={"/"}><img src={logo} alt="PrimeHire" className="nav-logo" /></Link>
//           <h1 className="nav-title">PrimeHire</h1>
//         </div>
//         <div className="intro-box">
//           <h2>No evaluation data found.</h2>
//           <p>Please complete the interview first.</p>
//           <button className="start-btn" onClick={() => navigate('/')}>
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="certificate-page">
//       {/* Navbar */}
//       <nav className="navbar">
//         <div className="navbar-logo">
//          <Link to={"/"}><img src={logo} alt="PrimeHire" className="nav-logo" /></Link>
//         </div>
//       </nav>

//       {/* Certificate Container */}
//       <div className="certificate-container">

//         <div className="certificate-header">
//           <h1 className="certificate-title">CERTIFICATE</h1>

//           <div className="header-content">
//             <div className="profile-section">
//               <img
//                 src={faceImage}
//                 alt="Profile"
//                 className="profile-image"
//                 onError={(e) => (e.target.src = "/api/placeholder/80/80")}
//               />
//               <div className="profile-info">
//                 <h2 className="profile-name">{candidateName}</h2>
//                 <p className="profile-date">{new Date().toLocaleDateString()}</p>
//                 <div className="certificate-link">
//                   <Lock className="lock-icon" />
//                   <span className="link-text">
//                     {candidateId ? `certs.primehire.ai/${candidateId}` : 'Not available'}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="logo-section">
//               <div className="logo-outer">
//                 <div className="logo-middle">
//                   <div className="logo-inner"></div>
//                 </div>
//               </div>
//               <p className="logo-text-main">PrimeHire</p>
//               <p className="logo-text-sub">InterviewTest</p>
//             </div>
//           </div>
//         </div>

//         {/* ✅ Scores Section */}
//         <div className="scores-container">
//           {scores.map((item, index) => (
//             <div key={index} className="score-item">

//               {/* Score Header */}
//               <div className="score-header">
//                 <span className="score-number">{item.score}</span>
//                 <div className="score-info">
//                   <h3 className="score-title">{item.title}</h3>
//                 </div>
//               </div>

//               {/* Progress bar */}
//               <div className="score-bar-container">
//                 <div className="score-bar-wrapper">
//                   <div className="score-min">0</div>
//                   <div className="score-max">160</div>

//                   <div className="score-track">
//                     {[...Array(30)].map((_, i) => (
//                       <div
//                         key={i}
//                         className="score-marker"
//                         style={{ left: `${(i / 29) * 100}%` }}
//                       ></div>
//                     ))}
//                   </div>

//                   <div
//                     className="score-indicator"
//                     style={{
//                       left: `${(item.position / 160) * 100}%`,
//                       width: '6%'
//                     }}
//                   ></div>
//                 </div>
//               </div>

//               {/* ✅ ONLY Reason (Removed repeated description & details) */}
//               <div className="score-reason">
//                 <p className="reason-text">
//                   <strong>Reason:</strong> {item.description}
//                 </p>
//               </div>

//             </div>
//           ))}
//         </div>

//         {/* Footer Legend */}
//         <div className="footer">
//           <div className="legend">
//             <div className="legend-item">
//               <div className="legend-box legend-score"></div>
//               <span className="legend-text">Your score</span>
//             </div>
//             <div className="legend-item">
//               <div className="legend-box legend-range"></div>
//               <span className="legend-text">Your score range</span>
//             </div>
//           </div>
//         </div>

//         {/* Download Button */}
//         <div className="download-btn-container">
//           <button className="download-btn" onClick={handleDownload}>
//             <Download className="download-icon" />
//             Download Certificate
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// -------------------------------- FRONTEND: FULL CERTIFICATE --------------------------
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
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
    passStatus = "FAIL",
    candidateName = "Anonymous",
    candidateId = null,
  } = location.state || {};

  const [faceImage, setFaceImage] = useState("/api/placeholder/80/80");

  // Fetch face image
  useEffect(() => {
    const fetchFaceImage = async () => {
      if (!candidateId || !candidateName) return;

      try {
        const res = await fetch(
          `${API_BASE}/mcp/tools/candidate_validation/get_face_image/${candidateName}/${candidateId}`
        );

        if (!res.ok) throw new Error("Failed to fetch face image");

        const blob = await res.blob();
        setFaceImage(URL.createObjectURL(blob));
      } catch (err) {
        console.error("Failed to fetch face image:", err);
      }
    };

    fetchFaceImage();
  }, [candidateId, candidateName]);


  // Download PDF
  const handleDownload = async () => {
    const cert = document.querySelector(".certificate-container-modern");
    const canvas = await html2canvas(cert, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${candidateName}_Certificate.pdf`);
  };

  if (!scores.length) {
    return (
      <div className="certificate-page">
        <h2>No evaluation data found.</h2>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="certificate-page">
      <div className="certificate-container-modern">

        {/* Header */}
        <div className="cert-header">
          <img src={logo} className="cert-logo" alt="PrimeHire Logo" />
          <h1 className="cert-main-title">PrimeHire Certification</h1>
        </div>

        {/* Profile Section */}
        <div className="cert-profile-section">
          <img src={faceImage} className="cert-profile-img" alt="Profile" />
          <div className="cert-profile-info">
            <h2>{candidateName}</h2>
            <p>ID: {candidateId}</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Pass/Fail */}
          <div className={`cert-status ${passStatus.toLowerCase()}`}>
            {passStatus}
          </div>
        </div>

        {/* Gold Badge */}
        <div className="cert-badge">
          <div className="badge-circle">
            <span className="badge-text">
              {passStatus === "PASS" ? "Certified" : "Completed"}
            </span>
          </div>
        </div>

        {/* SCORES */}
        <div className="cert-scores-modern">
          {scores.map(
            (item, index) =>
              item.title !== "feedback" && (
                <div key={index} className="score-box-modern">
                  <h3>{item.title.toUpperCase()}</h3>
                  <div className="score-value">{item.score}/100</div>

                  <div className="score-bar-modern">
                    <div
                      className="score-fill-modern"
                      style={{ width: `${item.position}%` }}
                    ></div>
                  </div>

                  <div className="reason">{item.description}</div>
                </div>
              )
          )}
        </div>

        {/* Feedback */}
        <div className="cert-feedback-box">
          <h3>Overall Feedback</h3>
          <p>{scores.find((s) => s.title === "feedback")?.description}</p>
        </div>

        {/* Footer */}
        <div className="cert-footer">
          <p>PrimeHire • AI-powered interview assessment</p>
        </div>

        {/* Download Button */}
        <div className="download-btn-container">
          <button className="download-btn" onClick={handleDownload}>
            <Download className="download-icon" />
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
