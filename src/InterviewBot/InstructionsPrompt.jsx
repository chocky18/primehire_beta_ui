
// import React, { useState } from "react";
// import {
//     Card,
//     CardHeader,
//     CardTitle,
//     CardContent,
//     CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useNavigate, useLocation } from "react-router-dom";
// import { ChevronRight } from "lucide-react"; //  ✅ Arrow icon
// import logo from "../assets/primehire_logo.png";
// import "./InstructionsPrompt.css";

// export default function InstructionsPrompt() {
//     const [checked, setChecked] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();

//     const candidateName = location.state?.candidateName || null;
//     const candidateId = location.state?.candidateId || null;

//     const handleStart = () => {
//         if (!candidateName || !candidateId) {
//             alert("❌ Missing candidate details. Please go back and validate again.");
//             return;
//         }

//         navigate("/webcam-recorder", { state: { candidateName, candidateId } });
//     };

//     return (
//         <div className="inst-wrapper">
//             <nav className="inst-navbar">
//                 <img src={logo} alt="PrimeHire Logo" className="inst-logo" />
//             </nav>

//             <Card className="inst-card">
//                 <CardHeader className="inst-header">
//                     <CardTitle className="inst-title">Interview Instructions</CardTitle>
//                 </CardHeader>

//                 <CardContent>
//                     <p className="inst-desc">
//                         Please read and accept the instructions before continuing.
//                     </p>

//                     <ul className="inst-list">
//                         <li><ChevronRight className="inst-arrow" /> Interview will be recorded (video + audio + responses).</li>
//                         <li><ChevronRight className="inst-arrow" /> Your data will be used for evaluation purposes.</li>
//                         <li><ChevronRight className="inst-arrow" /> Do not share personal or sensitive information.</li>
//                         <li><ChevronRight className="inst-arrow" /> Give honest answers without external help.</li>
//                         <li><ChevronRight className="inst-arrow" /> Ensure camera, mic, and internet are working properly.</li>
//                     </ul>

//                     <div className="inst-checkbox">
//                         <Checkbox id="agree" checked={checked} onCheckedChange={setChecked} />
//                         <label htmlFor="agree" className="inst-checkbox-label">
//                             I have read and agree to these instructions.
//                         </label>
//                     </div>
//                 </CardContent>

//                 <CardFooter className="inst-footer">
//                     <Button
//                         className="inst-start-btn"
//                         disabled={!checked}
//                         onClick={handleStart}
//                     >
//                         Start Interview
//                     </Button>
//                 </CardFooter>

//             </Card>

//             <div className="inst-debug">
//                 Debug: candidateName: {candidateName || "NULL"} | candidateId:{" "}
//                 {candidateId || "NULL"}
//             </div>
//         </div>
//     );
// }

// InstructionsPrompt.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation, useNavigate } from "react-router-dom";
import "./InstructionsPrompt.css";

export default function InstructionsPrompt() {
    const [checked, setChecked] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const candidateName = location.state?.candidateName;
    const candidateId = location.state?.candidateId;
    const jd_text = location.state?.jd_text || "";
    const jd_id = location.state?.jd_id || "";

    const handleStart = () => {
        navigate("/webcam-recorder", {
            state: {
                candidateName,
                candidateId,
                jd_text,
                jd_id,
            },
        });
    };

    return (
        <div>
            {/* original UI */}
            <Button onClick={handleStart} disabled={!checked}>Start Interview</Button>
        </div>
    );
}
