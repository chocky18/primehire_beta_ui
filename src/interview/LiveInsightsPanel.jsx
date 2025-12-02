// /src/interview/LiveInsightsPanel.jsx
import React, { useEffect, useState } from "react";
import { API_BASE } from "@/utils/constants";
import "./InterviewMode.css";

export default function LiveInsightsPanel({
    candidateName,
    candidateId,
    jdText,
    jdId,
    transcript = [],
}) {
    const [summary, setSummary] = useState("No summary yet.");
    const [anomalies, setAnomalies] = useState([]);
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const [emotion, setEmotion] = useState(null);

    useEffect(() => {
        const onAnomaly = (e) => {
            const detail = e.detail || e;
            setAnomalies((prev) => [detail, ...prev].slice(0, 8));
        };
        const onTranscriptUpdate = (e) => {
            const t = e.detail || [];
            // quick local summarization heuristic
            const latest = t.slice(-6).map((x) => x.text || x).join(" ");
            setSummary((s) => (latest ? `Recent: ${latest.slice(0, 200)}…` : s));
        };

        window.addEventListener("anomalyEvent", onAnomaly);
        window.addEventListener("transcriptUpdate", onTranscriptUpdate);

        return () => {
            window.removeEventListener("anomalyEvent", onAnomaly);
            window.removeEventListener("transcriptUpdate", onTranscriptUpdate);
        };
    }, []);

    useEffect(() => {
        // Tiny heuristic: generate suggested questions from JD text or transcript
        const candidates = [];
        if (jdText && jdText.length > 20) {
            candidates.push("How does your experience map to this JD?");
            candidates.push("Tell me about a recent project that matches this JD.");
        }
        if (transcript && transcript.length > 0) {
            candidates.push("Can you expand on your last answer?");
            candidates.push("What was the biggest challenge on that project?");
        }
        setSuggestedQuestions(candidates.slice(0, 6));
    }, [jdText, transcript]);

    // Optional: poll backend metrics for candidate (non-blocking)
    useEffect(() => {
        let mounted = true;
        async function poll() {
            try {
                if (!candidateId) return;
                const r = await fetch(`${API_BASE}/mcp/interview/metrics?candidate_id=${candidateId}`);
                if (!mounted) return;
                if (!r.ok) return;
                const j = await r.json();
                if (j?.emotion) setEmotion(j.emotion);
            } catch (err) {
                // swallow
            }
        }
        const t = setInterval(poll, 4500);
        poll();
        return () => {
            mounted = false;
            clearInterval(t);
        };
    }, [candidateId]);

    return (
        <div className="panel vp-panel glass-panel insights-panel">
            <div className="panel-head">
                <h4>Live Insights</h4>
                <small>{candidateName}</small>
            </div>

            <div className="panel-section">
                <div className="insight-summary">{summary}</div>
            </div>

            <div className="panel-section tiny">
                <div className="insight-metric">
                    <label>Emotion</label>
                    <div className="metric-value">{emotion || "Neutral"}</div>
                </div>

                <div className="insight-metric">
                    <label>JD relevance</label>
                    <div className="metric-value">— checking —</div>
                </div>
            </div>

            <div className="panel-section">
                <label>Detected anomalies</label>
                <ul className="anomaly-list">
                    {anomalies.length === 0 && <li className="muted">No anomalies</li>}
                    {anomalies.map((a, i) => (
                        <li key={i} className="anomaly-item">
                            {typeof a === "string" ? a : a.msg || JSON.stringify(a)}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="panel-section">
                <label>Suggested follow-ups</label>
                <div className="followups">
                    {suggestedQuestions.length === 0 && <div className="muted">No suggestions</div>}
                    {suggestedQuestions.map((q, i) => (
                        <button
                            key={i}
                            className="chip"
                            onClick={() =>
                                window.dispatchEvent(
                                    new CustomEvent("injectQuestion", { detail: { text: q } })
                                )
                            }
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>

            <div className="panel-foot">
                <button
                    className="ghost-btn"
                    onClick={() =>
                        window.dispatchEvent(new CustomEvent("downloadSnapshot", { detail: { candidateId } }))
                    }
                >
                    Snapshot
                </button>
                <button
                    className="primary-outline"
                    onClick={() =>
                        window.dispatchEvent(new CustomEvent("openTranscript"))
                    }
                >
                    Open Transcript
                </button>
            </div>
        </div>
    );
}
