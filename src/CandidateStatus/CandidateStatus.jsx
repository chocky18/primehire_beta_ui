import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./CandidateStatus.css";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { API_BASE } from "@/utils/constants";

const CandidateStatus = () => {
    const { id } = useParams(); // jd_id
    const [jdData, setJDData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchJDDetails = async () => {
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history/${id}`);
            const data = await res.json();
            setJDData(data);
        } catch (err) {
            console.error("Failed to load JD details:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchJDDetails();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (!jdData) return <p>JD not found.</p>;

    const matches = jdData.matches || [];

    // Chart values
    const chartData = [
        { name: "Matched", value: matches.length },
        { name: "Shortlisted", value: matches.filter(m => m.scores.final_score >= 75).length },
        { name: "Moderate", value: matches.filter(m => m.scores.final_score >= 50 && m.scores.final_score < 75).length },
        { name: "Low Fit", value: matches.filter(m => m.scores.final_score < 50).length },
    ];

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">
                Candidate Status — <span style={{ color: "#4a90e2" }}>{jdData.designation}</span>
            </h2>

            {/* Stats */}
            <div className="stats-container">
                <div className="stat-card">
                    <p>Total Matched Candidates</p>
                    <h3>{matches.length}</h3>
                </div>

                <div className="stat-card">
                    <p>High Match Score</p>
                    <h3>{chartData[1].value}</h3>
                </div>

                <div className="stat-card">
                    <p>Moderate Fit</p>
                    <h3>{chartData[2].value}</h3>
                </div>

                <div className="stat-card">
                    <p>Low Fit</p>
                    <h3>{chartData[3].value}</h3>
                </div>

                <div className="search-box">
                    <input type="text" placeholder="Search candidates…" />
                </div>
            </div>

            {/* Bottom Section */}
            <div className="bottom-section">
                {/* Chart */}
                <div className="chart-box">
                    <h3>Match Distribution</h3>

                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#102a43" />
                            <YAxis stroke="#102a43" />
                            <Tooltip />
                            <Bar dataKey="value" fill="#4a90e2" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Candidate Table */}
                <div className="table-box">
                    <h3>Matched Candidates</h3>

                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Designation</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Score</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {matches.map((m, i) => (
                                <tr key={i}>
                                    <td>{m.name}</td>
                                    <td>{m.designation}</td>
                                    <td>{m.phone || "—"}</td>
                                    <td>{m.email || "—"}</td>
                                    <td>{m.scores?.final_score}</td>
                                    <td>
                                        <Link
                                            to={`/candidate-overview/${m.candidate_id}`}
                                            className="candidate-link"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {matches.length === 0 && (
                        <p style={{ padding: "12px", color: "gray" }}>No matched candidates.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CandidateStatus;
