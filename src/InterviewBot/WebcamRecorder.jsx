import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import TranscriptPanel from "../InterviewBot/TranscriptPanel";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "@/utils/constants";
import logo from "../assets/primehire_logo.png";
import "./WebcamRecorder.css";

export default function WebcamRecorder() {
  const location = useLocation();
  const navigate = useNavigate();

  const candidateName = location.state?.candidateName || "Anonymous";
  const initialId = location.state?.candidateId || null;

  const jd_text = location.state?.jd_text || "";
  const jd_id = location.state?.jd_id || "";

  const [candidateId, setCandidateId] = useState(initialId);
  const [started, setStarted] = useState(false);

  const [jobDescription, setJobDescription] = useState(jd_text);
  const [firstQuestion, setFirstQuestion] = useState(null);

  const [tabWarning, setTabWarning] = useState(false);
  const [faceWarning, setFaceWarning] = useState(false);

  const videoRef = useRef();
  const frameCanvas = useRef();

  useEffect(() => {
    console.log("[WebcamRecorder] Loaded values:", {
      candidateName,
      candidateId,
      jd_id,
      jd_text,
    });
    setJobDescription(jd_text);
  }, []);

  // === Tab Switching Alert === //
  useEffect(() => {
    const handleTabChange = () => {
      if (document.hidden) {
        setTabWarning(true);
        alert("⚠ Don’t switch the tab during the interview!");
      } else {
        setTabWarning(false);
      }
    };

    document.addEventListener("visibilitychange", handleTabChange);
    return () =>
      document.removeEventListener("visibilitychange", handleTabChange);
  }, []);

  // === Webcam Start + Face Visibility Check === //
  useEffect(() => {
    if (!started) return;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        frameCanvas.current = document.createElement("canvas");

        const ctx = frameCanvas.current.getContext("2d");

        const checkFace = () => {
          if (!videoRef.current) return;

          const width = videoRef.current.videoWidth;
          const height = videoRef.current.videoHeight;

          frameCanvas.current.width = width;
          frameCanvas.current.height = height;

          ctx.drawImage(videoRef.current, 0, 0, width, height);

          const frame = ctx.getImageData(0, 0, 80, 80).data;
          let visiblePixels = 0;

          for (let i = 0; i < frame.length; i += 4) {
            const avg = (frame[i] + frame[i + 1] + frame[i + 2]) / 3;
            if (avg > 60) visiblePixels++;
          }

          const brightnessRatio = visiblePixels / (frame.length / 4);

          if (brightnessRatio < 0.18) {
            setFaceWarning(true);
          } else {
            setFaceWarning(false);
          }
        };

        const interval = setInterval(checkFace, 2000);
        return () => clearInterval(interval);
      } catch (e) {
        console.error("Camera error:", e);
        alert("Camera unavailable");
      }
    })();
  }, [started]);

  const handleStartInterview = async () => {
    setStarted(true);

    const fd = new FormData();
    fd.append("init", "true");
    fd.append("candidate_name", candidateName);
    fd.append("job_description", jobDescription);

    if (candidateId) fd.append("candidate_id", candidateId);

    try {
      const res = await fetch(
        `${API_BASE}/mcp/interview_bot_beta/process-answer`,
        {
          method: "POST",
          body: fd,
        }
      );
      const d = await res.json();

      if (d.ok) {
        if (d.candidate_id) setCandidateId(d.candidate_id);
        if (d.next_question) setFirstQuestion(d.next_question);
      }
    } catch (e) {
      console.error("Start interview failed:", e);
    }
  };

  const handleStopInterview = async () => {
    setStarted(false);

    const fd = new FormData();
    fd.append("candidate_name", candidateName);
    fd.append("candidate_id", candidateId);
    fd.append("job_description", jobDescription);

    try {
      const res = await fetch(
        `${API_BASE}/mcp/interview_bot_beta/evaluate-transcript`,
        {
          method: "POST",
          body: fd,
        }
      );

      const d = await res.json();

      if (d.ok) {
        navigate("/certificatedata", {
          state: {
            scores: d.scores,
            candidateName: d.candidateName,
            candidateId: d.candidateId,
            overall: d.overall,
            result: d.result,
            feedback: d.feedback,
            designation: d.designation,
          },
        });
      } else {
        alert("Evaluation failed: " + d.error);
      }
    } catch (e) {
      alert("Stop interview error: " + e.message);
    }
  };

  return (
    <div className="webcam-interview-wrapper">

      {/* 🔹 Top Navbar with Logo */}
      <div className="webcam-navbar">
        <img
          src={logo}
          alt="Company Logo"
          className="navbar-logo"
        />
      </div>

      <div className="webcam-interview-container">
        <div className="webcam-left-panel">
          <h3>Candidate: {candidateName}</h3>

          <textarea
            placeholder="Job Description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <div className="video-container">
            <video ref={videoRef} autoPlay muted />

            {/* Overlays */}
            {tabWarning && (
              <div className="warning-banner">
                ⚠ Please keep this tab active!
              </div>
            )}

            {faceWarning && (
              <div className="warning-banner">
                ⚠ Face is not visible clearly. Improve lighting.
              </div>
            )}
          </div>

          {!started ? (
            <Button onClick={handleStartInterview}>Start Interview</Button>
          ) : (
            <Button variant="destructive" onClick={handleStopInterview}>
              Stop & Evaluate
            </Button>
          )}

          <div className="debug-info">
            Debug → name: {candidateName} | id: {candidateId} <br />
            JD Loaded: {jobDescription?.slice(0, 50)}...
          </div>
        </div>

        <div className="webcam-right-panel">
          <TranscriptPanel
            candidateName={candidateName}
            candidateId={candidateId}
            jobDescription={jobDescription}
            firstQuestion={firstQuestion}
          />
        </div>
      </div>
    </div>
  );
}
