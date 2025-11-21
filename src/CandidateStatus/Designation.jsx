import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { API_BASE } from "@/utils/constants";
import "./Designation.css";

const Designation = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchJDHistory = async () => {
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history`);
            const data = await res.json();
            setJobs(data.history || []);
        } catch (err) {
            console.error("Failed to load JD list", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchJDHistory();
    }, []);

    return (
        <div className="designation-container">
            <h2 className="heading">
                <span>📄</span> Job Designations
            </h2>

            {loading ? (
                <p>Loading…</p>
            ) : jobs.length === 0 ? (
                <p>No JD available.</p>
            ) : (
                jobs.map((item) => (
                    <Link
                        to={`/candidate-status/${item.id}`}
                        key={item.id}
                        className="designation-card"
                    >
                        <div className="card-content">
                            <h3 className="jd-title">{item.designation}</h3>
                            <p className="sub-info">{item.match_count} Matches</p>
                        </div>

                        <ChevronRight size={20} className="arrow-icon" />
                    </Link>
                ))
            )}
        </div>
    );
};

export default Designation;
