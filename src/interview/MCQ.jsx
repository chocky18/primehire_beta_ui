import React, { useState, useEffect } from "react";

export default function MCQ({ onComplete }) {
    const [mcqs, setMcqs] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        setMcqs(window.generatedMCQ || []);
    }, []);

    function handleSubmit() {
        setSubmitted(true);
        onComplete();
    }

    if (!mcqs || mcqs.length === 0) return <div>Loading MCQ...</div>;
    if (submitted) return null;

    return (
        <div className="mcq-box">
            <h2>Multiple Choice Round</h2>

            {mcqs.map((q, idx) => (
                <div key={idx} className="mcq-question-block">
                    <h3>Q{idx + 1}. {q.question}</h3>

                    {q.options.map((opt, i) => (
                        <p key={i}>{opt}</p>
                    ))}
                </div>
            ))}

            <button className="mcq-submit" onClick={handleSubmit}>
                Submit MCQ
            </button>
        </div>
    );
}
