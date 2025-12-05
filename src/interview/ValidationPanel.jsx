// FILE: src/interview/ValidationPanel.jsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/utils/constants";
import { useNavigate, useLocation } from "react-router-dom";
import "./ValidationPanel.css";

export default function ValidationPanel() {
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);

    /* ---------------------------------------
       STATE
    ---------------------------------------- */
    const [candidateName, setCandidateName] = useState("");
    const [candidateId, setCandidateId] = useState("");
    const [jdId, setJdId] = useState("");
    const [jdText, setJdText] = useState("");

    const [capturedImage, setCapturedImage] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    /* ---------------------------------------
       1️⃣ LOAD VALUES FROM URL
    ---------------------------------------- */
    useEffect(() => {
        const nameURL = params.get("candidateName");
        const idURL = params.get("candidateId");
        const jdURL = params.get("jd_id");
        const tokenURL = params.get("jd_token") || params.get("token");

        if (nameURL) setCandidateName(nameURL);
        if (idURL) setCandidateId(idURL);

        // ⭐ Ignore jd_id = "None"
        if (jdURL && jdURL !== "None" && jdURL !== "null" && jdURL.trim() !== "") {
            console.log("📌 Loading JD by ID:", jdURL);
            setJdId(jdURL);
            fetchJDTextById(jdURL);
        }

        // ⭐ Token mode
        if (tokenURL) {
            console.log("📌 Loading JD by Token:", tokenURL);
            fetchJDTextByToken(tokenURL);
        }
    }, []);

    /* ---------------------------------------
       2️⃣ FETCH JD BY ID ONLY WHEN VALID
    ---------------------------------------- */
    const fetchJDTextById = async (id) => {
        if (!id || id === "None" || id === "null") return;

        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history/${id}`);
            if (!res.ok) throw new Error("Invalid JD ID");

            const data = await res.json();
            setJdText(data?.jd_text || "");
        } catch (err) {
            console.warn("⚠ JD not found by ID");
            setJdText("");
        }
    };

    /* ---------------------------------------
       3️⃣ FETCH JD BY TEMP TOKEN (cache)
    ---------------------------------------- */
    const fetchJDTextByToken = async (token) => {
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_cache/${token}`);
            const data = await res.json();

            if (data.ok) {
                setJdText(data.jd_text || "");
            }
        } catch (err) {
            console.warn("⚠ JD not found by token");
            setJdText("");
        }
    };

    /* ---------------------------------------
       4️⃣ START CAMERA
    ---------------------------------------- */
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
        } catch {
            alert("Camera access denied.");
        }
    };

    /* ---------------------------------------
       5️⃣ CAPTURE FACE
    ---------------------------------------- */
    const captureFace = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return alert("Camera not ready");

        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 240;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
        setIsSaved(false);
    };

    /* ---------------------------------------
       6️⃣ SAVE FACE
    ---------------------------------------- */
    const saveFaceToBackend = async () => {
        if (!capturedImage) return alert("Capture an image first.");

        const blob = await (await fetch(capturedImage)).blob();
        const fd = new FormData();

        fd.append("candidate_name", candidateName);
        fd.append("candidate_id", candidateId);
        fd.append("face_image", blob, "face.png");

        try {
            const res = await fetch(
                `${API_BASE}/mcp/tools/candidate_validation/save_face_image`,
                { method: "POST", body: fd }
            );

            if (!res.ok) throw new Error("Failed to save");
            setIsSaved(true);
        } catch (err) {
            alert("Save failed: " + err.message);
        }
    };

    /* ---------------------------------------
       7️⃣ CONTINUE → INSTRUCTIONS PANEL
    ---------------------------------------- */
    const handleContinue = () => {
        if (!isSaved) return alert("Save the face first!");

        navigate("/instructions", {
            state: {
                candidateName,
                candidateId,
                jd_id: jdId || null,
                jd_text: jdText || "",
            },
        });
    };

    /* ---------------------------------------
       UI
    ---------------------------------------- */

    return (
        <div className="vp-container">
            <h2 className="vp-title">Candidate Validation</h2>

            {/* INPUTS */}
            <div className="vp-input-block">
                <label>Candidate Name</label>
                <input
                    className="vp-input"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                />

                <label>Candidate ID</label>
                <input
                    className="vp-input"
                    value={candidateId}
                    onChange={(e) => setCandidateId(e.target.value)}
                />

                <label>JD ID (optional)</label>
                <input
                    className="vp-input"
                    value={jdId}
                    onChange={(e) => setJdId(e.target.value)}
                />
            </div>

            {/* CAMERA + ACTIONS */}
            <div className="vp-camera-row">
                <div className="vp-video-box">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className={`vp-video ${capturedImage ? "hidden-video" : ""}`}
                    />

                    <canvas ref={canvasRef} style={{ display: "none" }} />

                    {capturedImage && (
                        <img src={capturedImage} className="vp-preview-img" alt="Captured" />
                    )}
                </div>

                <div className="vp-actions">
                    <Button className="vp-btn" onClick={startCamera}>Start Camera</Button>
                    <Button className="vp-btn" onClick={captureFace}>📸 Capture</Button>
                    <Button className="vp-btn" onClick={saveFaceToBackend}>💾 Save</Button>

                    <Button
                        className={`vp-btn-next ${isSaved ? "ready" : ""}`}
                        disabled={!isSaved}
                        onClick={handleContinue}
                    >
                        Continue →
                    </Button>

                    <div className="vp-status">
                        {isSaved ? "✅ Face saved" : "Waiting for save..."}
                    </div>
                </div>
            </div>

            {/* JD PREVIEW */}
            <div className="vp-jd-block">
                <label>Job Description</label>
                <textarea
                    className="vp-jd-display"
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                />
            </div>
        </div>
    );
}
