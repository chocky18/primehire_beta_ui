
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

          <p>
            <strong>Overall Score: </strong>
            {overall}/100
          </p>

          <p>
            <strong>Feedback: </strong>
            {feedback}
          </p>
        </div>

        {/* SCORES WITH RANGE BAR */}
        <div className="scores-container">
          {scores.map((s, i) => (
            <div key={i} className="score-item">
              <div className="score-header">
                <strong>{s.title}</strong>
                <strong>{s.score}</strong>
              </div>

              <div className="score-description">{s.description}</div>

              {/* RANGE BAR */}
              <div className="range-bar-container">
                <span className="range-min">10</span>

                <div className="range-bar">
                  <div className="range-highlight"></div>
                  <div className="range-highlight"></div>
                  <div className="range-highlight"></div>
                </div>

                <span className="range-max">100</span>
              </div>
            </div>
          ))}
        </div>

        {/* DOWNLOAD BUTTON */}
        <div className="download-wrapper">
          <button className="download-btn" onClick={handleDownload}>
            <Download /> Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
}