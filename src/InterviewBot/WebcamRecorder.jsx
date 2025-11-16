
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import TranscriptPanel from "../InterviewBot/TranscriptPanel";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "@/utils/constants";
import "./WebcamRecorder.css";

export default function WebcamRecorder() {
  const location = useLocation();
  const navigate = useNavigate();

  const candidateName = location.state?.candidateName || "Anonymous";
  const initialId = location.state?.candidateId || null;

  const [candidateId, setCandidateId] = useState(initialId);
  const [started, setStarted] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [firstQuestion, setFirstQuestion] = useState(null);

  const videoRef = useRef();
  const frameCanvas = useRef();

  useEffect(() => {
    console.log("[WebcamRecorder] Loaded with:", { candidateName, initialId });
  }, []);

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
      } catch (e) {
        console.error("Camera error:", e);
        alert("Camera unavailable");
      }
    })();
  }, [started]);

  const handleStartInterview = async () => {
    if (!jobDescription.trim()) {
      return alert("Paste Job Description before starting.");
    }

    setStarted(true);

    const fd = new FormData();
    fd.append("init", "true");
    fd.append("candidate_name", candidateName);
    fd.append("job_description", jobDescription);
    if (candidateId) fd.append("candidate_id", candidateId);

    try {
      const res = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
        method: "POST",
        body: fd,
      });
      const d = await res.json();
      console.log("[init response]", d);

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
      const res = await fetch(`${API_BASE}/mcp/interview_bot_beta/evaluate-transcript`, {
        method: "POST",
        body: fd,
      });

      const d = await res.json();
      console.log("[evaluation response]", d);

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
    <div className="webcam-interview-container">
      <div className="webcam-left-panel">
        <h3>Candidate: {candidateName}</h3>

        <textarea
          placeholder="Paste Job Description..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <video ref={videoRef} autoPlay muted />

        {!started ? (
          <Button onClick={handleStartInterview}>Start Interview</Button>
        ) : (
          <Button variant="destructive" onClick={handleStopInterview}>
            Stop & Evaluate
          </Button>
        )}

        <div className="debug-info">
          Debug → name: {candidateName} | id: {candidateId || "null"}
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
  );
}