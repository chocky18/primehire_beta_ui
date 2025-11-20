import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import "./Designation.css";

const data = [
    { id: 1, title: "Java Full Stack", candidates: 22 },
    { id: 2, title: "SCM Consultant", candidates: 20 },
    { id: 3, title: "Salesforce Developer", candidates: 19 },
    { id: 4, title: "Oracle Developer", candidates: 18 },
];

const Designation = () => {
    return (
        <div className="designation-container">
            <h2 className="heading">
                <span>📄</span> Designation
            </h2>

            {data.map((item) => (
                <Link
                    to={`/candidate-status/${item.id}`}
                    key={item.id}
                    className="designation-card"
                >
                    <div className="card-content">
                        <h3 className="jd-title">{item.title}</h3>
                    </div>

                    <ChevronRight size={20} className="arrow-icon" />
                </Link>
            ))}
        </div>
    );
};

export default Designation;