import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CandidateOverview.css";
import { API_BASE } from "@/utils/constants";

const CandidateOverview = () => {
    const { email } = useParams();
    const [candidate, setCandidate] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/mcp/tools/candidates/by_email/${email}`)
            .then((res) => res.json())
            .then((data) => setCandidate(data))
            .catch((err) => console.error("Fetch error:", err));
    }, [email]);

    if (!candidate) return <p>Loading candidate...</p>;

    return (
        <div className="candidate-status-container">
            <h2 className="title">CANDIDATE OVERVIEW</h2>

            <div className="status-card">
                <div className="profile-section">
                    <img src="/profile.jpg" className="profile-img" alt="Profile" />

                    <h3 className="candidate-name">{candidate.full_name}</h3>
                    <p className="candidate-role">{candidate.current_title}</p>

                    <p className="contact-email">{candidate.email}</p>
                    <p className="contact-phone">{candidate.phone}</p>
                </div>

                <div className="content-section">
                    <div className="box">
                        <h4>Candidate Details</h4>
                        <p>Experience <span>{candidate.years_of_experience} years</span></p>
                        <p>Location <span>{candidate.location}</span></p>
                        <p>Skills <span>{candidate.top_skills}</span></p>
                    </div>

                    <div className="box">
                        <h4>Resume</h4>
                        <a href={`${API_BASE}/${candidate.resume_link}`} className="resume-btn" download>
                            Download Resume
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateOverview;
