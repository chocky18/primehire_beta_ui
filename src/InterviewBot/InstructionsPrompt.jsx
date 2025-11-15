import React, { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import WebcamRecorder from "./WebcamRecorder";
import logo from "../assets/primehire_logo.png"; // Your logo
import "./InstructionsPrompt.css";

const InstructionsPrompt = () => {
    const [checked, setChecked] = useState(false);
    const [startInterview, setStartInterview] = useState(false);

    const handleStart = () => {
        setStartInterview(true);
    };

    if (startInterview) {
        return <WebcamRecorder />;
    }

    return (
        <div className="instructions-wrapper">
            {/* Navbar */}
            <nav className="instructions-navbar">
                <img src={logo} alt="PrimeHire Logo" className="navbar-logo" />
            </nav>

            {/* Card */}
            <Card className="instructions-card">
                <CardHeader className="instructions-header">
                    <CardTitle className="instructions-title header-title">
                        Interview Instructions
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <p className="instructions-text">
                        Please read and confirm the instructions before starting your
                        interview:
                    </p>

                    <ul className="instructions-list">
                        <li>Interview will be recorded (video + audio + responses).</li>
                        <li>Your data will be used for evaluation purposes.</li>
                        <li>Do not share personal or sensitive information.</li>
                        <li>Give honest answers without external help.</li>
                        <li>Ensure camera, mic, and internet are working properly.</li>
                    </ul>

                    <div className="confirm-checkbox">
                        <Checkbox
                            id="agree"
                            checked={checked}
                            onCheckedChange={setChecked}
                        />
                        <label htmlFor="agree">
                            I have read and agree to these instructions.
                        </label>
                    </div>
                </CardContent>

                <CardFooter>
                    <Button
                        className="instructions-btn"
                        disabled={!checked}
                        onClick={handleStart}
                    >
                        Start Interview
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default InstructionsPrompt;