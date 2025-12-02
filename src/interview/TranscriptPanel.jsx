// FILE: /src/interview/TranscriptPanel.jsx
import React, { useEffect, useRef } from "react";
import "./TranscriptPanel.css";

export default function TranscriptPanel({ transcript = [] }) {
    const scrollRef = useRef(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcript]);

    return (
        <div className="tp-wrapper">
            <div className="tp-head">
                <h4>Transcript</h4>
                <small>Live conversation transcript</small>
            </div>

            <div className="tp-scroll" ref={scrollRef}>
                {transcript.length === 0 ? (
                    <div className="tp-empty">Transcript will appear here…</div>
                ) : (
                    transcript.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`tp-msg ${msg.role === "ai" ? "tp-ai" : "tp-user"}`}
                        >
                            <div className="tp-role">
                                {msg.role === "ai" ? "🤖 AI" : "🧑 Candidate"}
                            </div>
                            <div className="tp-text">{msg.text || msg.message || ""}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
