import React, { useState, useEffect } from "react";

export default function MCQ({ questions = [], onComplete }) {
    const [submitted, setSubmitted] = useState(false);

    if (!questions || questions.length === 0)
        return <div>Loading MCQ...</div>;

    if (submitted) return null;

    return (
        <div className="mcq-box">
            <h2>Multiple Choice Round</h2>

            {questions.map((q, idx) => (
                <div key={idx} className="mcq-question-block">
                    <h3>Q{idx + 1}. {q.question}</h3>

                    {q.options.map((opt, i) => (
                        <p key={i}>{opt}</p>
                    ))}
                </div>
            ))}

            <button
                className="mcq-submit"
                onClick={() => {
                    setSubmitted(true);
                    onComplete();
                }}
            >
                Submit MCQ
            </button>
        </div>
    );
}
