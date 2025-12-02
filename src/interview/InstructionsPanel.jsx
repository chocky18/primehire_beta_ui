// 📁 src/interview/InstructionsPanel.jsx
import React from "react";
import "./InstructionsPanel.css";
import { Button } from "@/components/ui/button";

export default function InstructionsPanel({ candidateName, onNext }) {
    return (
        <div className="ip-page">
            <div className="ip-glass-wrapper">

                <h2 className="ip-title">Interview Instructions</h2>

                <p className="ip-subtitle">
                    Hello <strong>{candidateName || "Candidate"}</strong>,
                    please read the following instructions before starting the interview.
                </p>

                <div className="ip-card">
                    <ul className="ip-list">
                        <li>Ensure your camera and microphone are working.</li>
                        <li>Choose a quiet, well-lit environment.</li>
                        <li>Answer questions clearly and confidently.</li>
                        <li>The interview will be recorded for evaluation.</li>
                        <li>You can stop the interview at any time.</li>
                    </ul>
                </div>

                <div className="ip-actions">
                    <Button className="ip-btn-start" onClick={onNext}>
                        Start Interview →
                    </Button>
                </div>

            </div>
        </div>
    );
}
