import React from "react";
import "./CandidateOverview.css";

const CandidateOverview = () => {
    return (
        <div className="candidate-status-container">
            <h2 className="title">CANDIDATE STATUS</h2>

            <div className="status-card">
                {/* Profile Section */}
                <div className="profile-section">
                    <img
                        src="/profile.jpg"
                        alt="Candidate"
                        className="profile-img"
                    />
                    <h3 className="candidate-name">John Doe</h3>
                    <p className="candidate-role">Software Engineer</p>

                    <div className="interview-score">
                        <span>Interviewed</span>
                        <span className="score">Score: 85</span>
                    </div>

                    <p className="contact-email">johndoe@example.com</p>
                    <p className="contact-phone">(123) 456-7880</p>
                </div>

                {/* Right Content Section */}
                <div className="content-section">
                    {/* JD Details */}
                    <div className="box">
                        <h4>JD Details</h4>
                        <div className="info-grid">
                            <p>jd_id</p><span>1234</span>
                            <p>Designation</p><span>Software Engineer</span>
                            <p>jd_text</p>
                            <span>Design, implement and maintain software applications</span>
                        </div>
                    </div>

                    {/* Interview Progress */}
                    <div className="box">
                        <h4>Interview Progress</h4>
                        <div className="progress-bar">
                            <div className="step active"></div>
                            <div className="step active"></div>
                            <div className="step"></div>
                        </div>
                        <div className="progress-labels">
                            <span>Screening</span>
                            <span>Interview</span>
                            <span>Offer</span>
                        </div>
                    </div>

                    {/* Profile Match */}
                    <div className="box half">
                        <h4>Profile Match</h4>
                        <div className="progress-wrapper">
                            <div className="line"></div>
                            <span>95%</span>
                        </div>

                        <h5>Profile Match Breakdown</h5>
                        <p>Skills <span>90</span></p>
                        <p>AI Questions <span>85</span></p>
                        <p>Manual Questions <span>85</span></p>
                    </div>

                    {/* Score Metrics */}
                    <div className="box half">
                        <h4>Score Metrics</h4>
                        <p>created_at <span>March 1, 2024</span></p>
                        <p>updated_at <span>March 1, 2024</span></p>
                        <p>Interview Access Token</p>
                        <span>abcdef123456</span>

                        <button className="resume-btn">Download Resume</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateOverview;