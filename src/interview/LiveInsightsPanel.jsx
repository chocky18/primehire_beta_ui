
// FILE: src/interview/LiveInsightsPanel.jsx
import React, { useEffect, useState, useRef } from "react";
import "./LiveInsightsPanel.css";

function LiveInsightsPanel({ attemptId }) {
    const [live, setLive] = useState({ anomalies: [], counts: {} });
    const writtenRef = useRef(new Set());

    useEffect(() => {
        setLive({ anomalies: [], counts: {} });
        writtenRef.current = new Set();
    }, [attemptId]);

    useEffect(() => {
        const handler = (e) => {
            const payload = e.detail || {};

            if (payload.attempt_id !== attemptId) return;

            const incomingAnomalies = Array.isArray(payload.anomalies)
                ? payload.anomalies
                : [];

            const incomingCounts = payload.counts || {};

            setLive((prev) => {
                const mergedCounts = { ...incomingCounts };

                return {
                    anomalies: incomingAnomalies.length
                        ? [...prev.anomalies, ...incomingAnomalies].slice(-50)
                        : prev.anomalies,
                    counts: mergedCounts,
                };
            });

            incomingAnomalies.forEach((a) => {
                const key =
                    typeof a === "string"
                        ? a
                        : a?.type || a?.msg || JSON.stringify(a);

                if (writtenRef.current.has(key)) return;

                writtenRef.current.add(key);

                window.dispatchEvent(
                    new CustomEvent("transcriptAdd", {
                        detail: {
                            role: "system",
                            text: `⚠ ${key}`,
                        },
                    })
                );
            });
        };

        window.addEventListener("liveInsightsUpdate", handler);
        return () => window.removeEventListener("liveInsightsUpdate", handler);
    }, [attemptId]);

    const C = live.counts || {};

    return (
        <div className="live-insight-box">
            <h4>Real-time Behaviour Insights</h4>

            <div className="anomaly-grid">
                <div><span>No Face</span><strong>{C.absence ?? 0}</strong></div>
                <div><span>Multi Face</span><strong>{C.multi_face ?? 0}</strong></div>
                <div><span>Face Mismatch</span><strong>{C.face_mismatch ?? 0}</strong></div>
                <div><span>Gaze Away</span><strong>{C.gaze_away_long ?? 0}</strong></div>
                <div><span>No Blink</span><strong>{C.no_blink ?? 0}</strong></div>
                <div><span>Static Face</span><strong>{C.static_face ?? 0}</strong></div>
                <div><span>Nodding</span><strong>{C.excessive_nodding_long ?? 0}</strong></div>
                <div><span>Scanning</span><strong>{C.head_scanning_long ?? 0}</strong></div>
                <div><span>Stress</span><strong>{C.stress_movement ?? 0}</strong></div>
                <div><span>Tab Switch</span><strong>{C.tab_switch ?? 0}</strong></div>
            </div>

            <h5>Latest Anomaly</h5>
            {live.anomalies.length > 0 ? (
                <div>{live.anomalies.at(-1)?.msg || live.anomalies.at(-1)}</div>
            ) : (
                <div className="muted">No anomalies</div>
            )}
        </div>
    );
}

export default React.memo(LiveInsightsPanel);
