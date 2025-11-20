import React from "react";
import "./CandidateStatus.css";
import { MoreVertical } from "lucide-react";

const candidates = [
    {
        id: 1,
        name: "Adison Vaccaro",
        status: "In progress",
        invited: "Wed Jun 19 2024",

    },
    {
        id: 2,
        name: "Kaiya Gouse",
        status: "In progress",
        invited: "Wed Jun 15 2024",

    },
    {
        id: 3,
        name: "Alena Lipshutz",
        status: "Rejected",
        invited: "Wed Jun 15 2024",

    },
    {
        id: 4,
        name: "Miracle Schleifer",
        status: "Hired",
        invited: "Wed Jun 15 2024",

    },
    {
        id: 5,
        name: "Kaiya Ekstrom Bothman",
        status: "Rejected",
        invited: "Wed Jun 19 2024",

    },
    {
        id: 6,
        name: "Ann Bergson",
        status: "Hired",
        invited: "Wed Jun 15 2024",

    },
];

const CandidateStatus = () => {
    return (
        <div className="candidates-container">

            {/* Tabs */}
            <div className="status-tabs">
                <button className="active">All Candidates (125)</button>
                <button>Experienced (10)</button>
                <button>Most Fit (23)</button>
                <button>Recently Contacted (56)</button>
            </div>

            {/* Search + Add Button */}
            <div className="actions-header">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search Candidates"
                />
                <button className="add-btn">+ Add Candidate</button>
            </div>

            {/* Table */}
            <table className="candidates-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" /></th>
                        <th>Candidate name</th>
                        <th>Status</th>
                        <th>Invited</th>
                        <th>Quick actions</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map((c) => (
                        <tr key={c.id}>
                            <td><input type="checkbox" /></td>
                            <td className="name-col">

                                <span>{c.name}</span>
                            </td>
                            <td>
                                <span className={`status-badge ${c.status.toLowerCase()}`}>
                                    {c.status}
                                </span>
                            </td>
                            <td>{c.invited}</td>
                            <td>
                                <button className="actions-btn">
                                    Actions <MoreVertical size={15} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default CandidateStatus;