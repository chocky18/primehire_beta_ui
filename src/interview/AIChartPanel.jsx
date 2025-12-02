// AIChartPanel.jsx
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./AIChartPanel.css";

/**
 * Props:
 *  - transcript: array of conversation objects (each may include .analysis.confidence and .analysis.superficial_detection)
 *
 * Example transcript item:
 * {
 *   sender: "user",
 *   text: "...",
 *   timestamp: "2025-xx-xxT..Z",
 *   analysis: {
 *     confidence: { wpm: 120, filler_count: 1, confidence_score: 85 },
 *     superficial_detection: { buzzword_hits: 1, depth_score: 80, is_superficial: false }
 *   }
 * }
 */

export default function AIChartPanel({ transcript = [] }) {
    const lineRef = useRef(null);
    const barRef = useRef(null);
    const lineChart = useRef(null);
    const barChart = useRef(null);

    // Helper: extract analysis from transcript (only user answers have analysis)
    const extractMetrics = (items) => {
        const metrics = items
            .filter((it) => it.analysis && it.analysis.confidence)
            .map((it) => {
                const ts = it.timestamp || "";
                const conf = it.analysis.confidence || {};
                const sup = it.analysis.superficial_detection || {};
                return {
                    timestamp: ts,
                    confidence_score: conf.confidence_score ?? null,
                    wpm: conf.wpm ?? null,
                    filler_count: conf.filler_count ?? null,
                    depth_score: sup.depth_score ?? null,
                    buzzword_hits: sup.buzzword_hits ?? null,
                };
            });
        return metrics;
    };

    useEffect(() => {
        const metrics = extractMetrics(transcript);

        // Prepare data for confidence-over-time
        const labels = metrics.map((m, i) => {
            // short label: HH:MM or index if missing
            try {
                const d = m.timestamp ? new Date(m.timestamp) : null;
                return d ? `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}` : `#${i + 1}`;
            } catch (e) {
                return `#${i + 1}`;
            }
        });
        const confidences = metrics.map((m) => (m.confidence_score == null ? null : Number(m.confidence_score)));
        const wpms = metrics.map((m) => (m.wpm == null ? null : Math.round(Number(m.wpm))));
        const fillerCounts = metrics.map((m) => (m.filler_count == null ? null : Number(m.filler_count)));

        // Latest superficial metrics (fallback to zeros)
        const latest = metrics.length ? metrics[metrics.length - 1] : null;
        const latestDepth = latest?.depth_score ?? 0;
        const latestBuzz = latest?.buzzword_hits ?? 0;

        // ----- Line chart: confidence over time -----
        if (lineChart.current) {
            lineChart.current.destroy();
            lineChart.current = null;
        }
        if (lineRef.current) {
            lineChart.current = new Chart(lineRef.current, {
                type: "line",
                data: {
                    labels,
                    datasets: [
                        {
                            label: "Confidence",
                            data: confidences,
                            borderWidth: 2,
                            tension: 0.25,
                            fill: true,
                            yAxisID: "y",
                        },
                        {
                            label: "WPM",
                            data: wpms,
                            borderDash: [6, 4],
                            borderWidth: 1.5,
                            tension: 0.25,
                            pointRadius: 2,
                            yAxisID: "y1",
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: true, position: "top" } },
                    scales: {
                        y: {
                            type: "linear",
                            position: "left",
                            min: 0,
                            max: 100,
                            ticks: { stepSize: 10 },
                            title: { display: true, text: "Confidence (%)" },
                        },
                        y1: {
                            type: "linear",
                            position: "right",
                            grid: { drawOnChartArea: false },
                            min: 0,
                            suggestedMax: 250,
                            title: { display: true, text: "WPM" },
                        },
                    },
                },
            });
        }

        // ----- Bar chart: superficial detection (latest answer) -----
        if (barChart.current) {
            barChart.current.destroy();
            barChart.current = null;
        }
        if (barRef.current) {
            barChart.current = new Chart(barRef.current, {
                type: "bar",
                data: {
                    labels: ["Depth Score", "Buzzword Hits"],
                    datasets: [
                        {
                            label: "Latest answer",
                            data: [latestDepth, latestBuzz],
                            barThickness: 22,
                            borderRadius: 6,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: "x",
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { ticks: { beginAtZero: true } },
                        y: {
                            beginAtZero: true,
                            suggestedMax: Math.max(100, latestBuzz * 2, latestDepth),
                        },
                    },
                },
            });
        }

        // cleanup on unmount
        return () => {
            if (lineChart.current) {
                lineChart.current.destroy();
                lineChart.current = null;
            }
            if (barChart.current) {
                barChart.current.destroy();
                barChart.current = null;
            }
        };
    }, [transcript]);

    return (
        <div className="ai-chart-panel-root">
            <div className="ai-chart-header">
                <div className="ai-chart-title">AI Video / Confidence</div>
                <div className="ai-chart-sub">Confidence trend and superficial detection</div>
            </div>

            <div className="ai-chart-body">
                <div className="chart-left">
                    <canvas ref={lineRef} />
                </div>

                <div className="chart-right">
                    <canvas ref={barRef} />
                    <div className="chart-note">
                        Latest answer metrics
                    </div>
                </div>
            </div>
        </div>
    );
}
