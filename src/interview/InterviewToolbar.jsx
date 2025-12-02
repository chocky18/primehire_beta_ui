// /src/interview/InterviewToolbar.jsx
import React, { useEffect, useRef, useState } from "react";
import "./InterviewMode.css";

export default function InterviewToolbar({
    candidateName = "Anonymous",
    interviewRunning = false,
    onToggleInsights,
    onToggleAI,
    onStop,
    onStart,
    onPause,
    onResume,
}) {
    const [seconds, setSeconds] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (interviewRunning) {
            timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [interviewRunning]);

    const format = (s) => {
        const m = Math.floor(s / 60).toString().padStart(2, "0");
        const sec = (s % 60).toString().padStart(2, "0");
        return `${m}:${sec}`;
    };

    return (
        <div className="interview-toolbar">

            {/* LEFT SIDE — TITLE + TIMER */}
            <div className="toolbar-left">
                <div className="toolbar-title">Interview — {candidateName}</div>
                <div className="toolbar-timer">{format(seconds)}</div>
            </div>

            {/* RIGHT SIDE — ACTIONS */}
            <div className="toolbar-right">

                {!interviewRunning ? (
                    <button className="primary-btn" onClick={onStart}>
                        Start
                    </button>
                ) : (
                    <>
                        <button className="ghost-btn" onClick={onPause}>Pause</button>
                        <button className="ghost-btn" onClick={onResume}>Resume</button>
                        <button className="danger-btn" onClick={onStop}>End</button>
                    </>
                )}

                <div className="toolbar-divider" />

                <button className="icon-btn" onClick={onToggleInsights}>Insights</button>
                <button className="icon-btn" onClick={onToggleAI}>AI</button>
                <button className="icon-btn">Snapshot</button>

            </div>
        </div>
    );
}
