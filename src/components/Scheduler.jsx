import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "@/utils/constants";
import "./Scheduler.css";

export default function Scheduler() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const candidateId = params.get("candidateId");
    const candidateName = params.get("candidateName");
    const jdId = params.get("jd_id");

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");

    const timeSlots = [
        "09:00", "09:20", "09:40",
        "10:00", "10:20", "10:40",
        "11:00", "11:20", "11:40",
        "14:00", "14:20", "14:40",
        "15:00", "15:20", "15:40",
    ];

    const handleSubmit = async () => {
        if (!selectedDate || !selectedSlot)
            return alert("Select date and time slot");

        const start_iso = `${selectedDate}T${selectedSlot}:00Z`;

        const endDate = new Date(start_iso);
        endDate.setMinutes(endDate.getMinutes() + 20);
        const end_iso = endDate.toISOString();

        const payload = {
            candidate_id: candidateId,
            jd_id: parseInt(jdId),
            start_iso,
            end_iso,
            slot_minutes: 20,
        };

        const res = await fetch(`${API_BASE}/scheduler/schedule`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            console.error(await res.text());
            return alert("Failed to schedule interview");
        }

        alert("📅 Interview Scheduled Successfully!");

        navigate("/validation_panel", {
            replace: true,
            state: { candidateId, candidateName, jd_id: jdId },
        });
    };

    return (
        <div className="scheduler-container">
            <h2>Schedule Your Interview</h2>

            <div className="info-box">
                <p><b>Candidate:</b> {candidateName}</p>
                <p><b>ID:</b> {candidateId}</p>
                <p><b>JD ID:</b> {jdId}</p>
            </div>

            <label>Select Date</label>
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
            />

            <label>Select Slot (20 mins)</label>
            <div className="slot-grid">
                {timeSlots.map((t) => (
                    <button
                        key={t}
                        className={selectedSlot === t ? "slot selected" : "slot"}
                        onClick={() => setSelectedSlot(t)}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <button className="confirm-btn" onClick={handleSubmit}>
                Confirm Slot
            </button>
        </div>
    );
}
