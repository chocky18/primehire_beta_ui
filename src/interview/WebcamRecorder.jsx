// 📁 src/interview/WebcamRecorder.jsx
import React, { useEffect, useRef, useState } from "react";
import { API_BASE } from "@/utils/constants";
import "./WebcamRecorder.css";

export default function WebcamRecorder({
    candidateName,
    candidateId,
    jd_text,
    jd_id,

    onStart,
    onCandidateId,
    onTranscriptUpdate
}) {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    const [stream, setStream] = useState(null);
    const [recording, setRecording] = useState(false);

    const chunksRef = useRef([]);

    /* ------------------------------------------------------------
       INIT CAMERA STREAM
    ------------------------------------------------------------ */
    async function initCamera() {
        try {
            const s = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
                audio: true
            });
            setStream(s);
            if (videoRef.current) {
                videoRef.current.srcObject = s;
                await videoRef.current.play();
            }
        } catch (err) {
            console.error("Camera error:", err);
        }
    }

    useEffect(() => {
        initCamera();
        return () => stream?.getTracks().forEach((t) => t.stop());
    }, []);

    /* ------------------------------------------------------------
       START INTERVIEW (SEND INITIAL PROMPT)
    ------------------------------------------------------------ */
    async function startInterview() {
        setRecording(true);
        onStart?.();

        const fd = new FormData();
        fd.append("init", "true");
        fd.append("candidate_name", candidateName);
        fd.append("job_description", jd_text);
        if (candidateId) fd.append("candidate_id", candidateId);
        if (jd_id) fd.append("jd_id", jd_id);

        try {
            const res = await fetch(`${API_BASE}/mcp/interview/start`, {
                method: "POST",
                body: fd
            });
            const d = await res.json();

            if (d.candidate_id) {
                onCandidateId?.(d.candidate_id);
            }
            if (d.first_question) {
                onTranscriptUpdate?.([
                    { role: "assistant", content: d.first_question }
                ]);
            }
        } catch (err) {
            console.error("Interview init failed:", err);
        }

        startRecording();
    }

    /* ------------------------------------------------------------
       MEDIA RECORDER (Audio + Video chunks)
    ------------------------------------------------------------ */
    const startRecording = () => {
        if (!stream) return;

        const mr = new MediaRecorder(stream, {
            mimeType: "video/webm; codecs=vp8,opus"
        });
        mediaRecorderRef.current = mr;

        mr.ondataavailable = (e) => {
            chunksRef.current.push(e.data);
        };

        mr.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: "video/webm" });
            chunksRef.current = [];
            sendChunk(blob);
        };

        mr.start(1000); // chunk every 1 sec
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
        window.dispatchEvent(new Event("stopInterview"));
    };

    /* ------------------------------------------------------------
       SEND RECORDING CHUNK TO BACKEND FOR PROCESSING
    ------------------------------------------------------------ */
    async function sendChunk(blob) {
        const fd = new FormData();
        fd.append("candidate_name", candidateName);
        fd.append("candidate_id", candidateId);
        fd.append("video_chunk", blob);

        try {
            const res = await fetch(`${API_BASE}/mcp/interview/process-chunk`, {
                method: "POST",
                body: fd
            });
            const d = await res.json();

            if (d.transcript) {
                onTranscriptUpdate?.(d.transcript);
            }
            if (d.next_question) {
                onTranscriptUpdate?.((prev) => [
                    ...prev,
                    { role: "assistant", content: d.next_question }
                ]);
            }
        } catch (err) {
            console.error("Chunk upload error:", err);
        }
    }

    /* ------------------------------------------------------------
       FACE MONITOR (every 3 seconds)
    ------------------------------------------------------------ */
    useEffect(() => {
        if (!recording) return;
        if (!candidateId) return;

        const interval = setInterval(async () => {
            if (!videoRef.current) return;

            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(videoRef.current, 0, 0);

            const blob = await new Promise((resolve) =>
                canvas.toBlob(resolve, "image/jpeg")
            );

            const fd = new FormData();
            fd.append("candidate_id", candidateId);
            fd.append("candidate_name", candidateName);
            fd.append("frame", blob);

            const r = await fetch(`${API_BASE}/mcp/interview/face-monitor`, {
                method: "POST",
                body: fd
            });
            const data = await r.json();

            if (data.anomalies?.length) {
                data.anomalies.forEach((a) => {
                    window.dispatchEvent(
                        new CustomEvent("anomalyEvent", { detail: a.msg })
                    );
                });
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [recording, candidateId]);

    /* ------------------------------------------------------------
       STOP EVENT LISTENER (from InterviewToolbar)
    ------------------------------------------------------------ */
    useEffect(() => {
        const handler = () => stopRecording();
        window.addEventListener("stopInterview", handler);
        return () => window.removeEventListener("stopInterview", handler);
    });

    return (
        <div className="webcam-glass-shell">
            <video ref={videoRef} muted autoPlay playsInline className="webcam-video" />

            {!recording ? (
                <button className="webcam-start-btn" onClick={startInterview}>
                    Start Interview
                </button>
            ) : (
                <button className="webcam-stop-btn" onClick={stopRecording}>
                    Stop Interview
                </button>
            )}
        </div>
    );
}
