import React from "react";
import "./CandidateStatus.css";

// 📊 Recharts
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";

const CandidateStatus = () => {
    // Bar chart data
    const chartData = [
        { name: "Applied", value: 250 },
        { name: "Shortlisted", value: 70 },
        { name: "Interview", value: 25 },
        { name: "Onboarding", value: 12 },
    ];

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Candidate Status Dashboard</h2>

            {/* Stats Section */}
            <div className="stats-container">
                <div className="stat-card">
                    <p>Total Candidates</p>
                    <h3>432</h3>
                </div>
                <div className="stat-card">
                    <p>Pending Screening</p>
                    <h3>24</h3>
                </div>
                <div className="stat-card">
                    <p>Offers Released</p>
                    <h3>6</h3>
                </div>
                <div className="stat-card">
                    <p>Profile Match Score</p>
                    <h3>75%</h3>
                </div>

                {/* Search */}
                <div className="search-box">
                    <input type="text" placeholder="Search..." />
                </div>
            </div>

            {/* Bottom Section */}
            <div className="bottom-section">
                {/* Chart Section */}
                <div className="chart-box">
                    <h3>Candidate Status</h3>

                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#102a43" />
                            <YAxis stroke="#102a43" />
                            <Tooltip />
                            <Bar dataKey="value" fill="#4a90e2" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Table Section */}
                <div className="table-box">
                    <h3>Candidates</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Interview Round</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <Link to="/candidate-overview" className="candidate-link">
                                        Jane Smith
                                    </Link>
                                </td>
                                <td>janesmith@example.com</td>
                                <td>(123) 456-7830</td>
                                <td>Round 2</td>
                                <td className="status-shortlisted">Shortlisted</td>
                            </tr>
                            <tr>
                                <td>John Doe</td>
                                <td>johndoe@example.com</td>
                                <td>(997) 654-3210</td>
                                <td>Applied</td>
                                <td>Applied</td>
                            </tr>
                            <tr>
                                <td>Emily Johns</td>
                                <td>emilyj@example.com</td>
                                <td>(555) 123-4567</td>
                                <td>Reported</td>
                                <td className="status-completed">Interview Completed</td>
                            </tr>
                            <tr>
                                <td>Michael Brown</td>
                                <td>mbrown@example.com</td>
                                <td>(444) 567-8801</td>
                                <td>Round 1</td>
                                <td>Applied</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CandidateStatus;