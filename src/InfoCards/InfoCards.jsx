import React, { useRef, useState } from "react";
import {
    Link as LinkIcon,
    Brain as BrainIcon,
    Cpu as CpuIcon,
    Mail as MailIcon,
    Video as VideoIcon,
    Upload as UploadIcon,
    FileText as FileTextIcon,
    Search as SearchIcon,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import "./InfoCards.css";

import ZohoBridge from "../ZohoBridge/ZohoLoginButton";
import MailMindButton from "../MailMind/MailMindButton";
import InterviewBot from "../InterviewBot/InterviewBot";
import PrimeHireBrain from "../PrimeHireBrain/PrimeHireBrain";
import UploadUI from "../chat/UploadUI";
import JDTaskUI from "../pages/JDTaskUI";
import LinkedInPosterButton from "../LinkedInPoster/LinkedInPosterButton";
import Designation from "../CandidateStatus/Designation";
import ChatContainer from "../chat/ChatContainer";

export default function InfoCards() {
    const scrollRef = useRef(null);

    const [selectedFeature, setSelectedFeature] = useState(null);
    const BackButton = () => (
        <button className="back-btn" onClick={() => setSelectedFeature(null)}>
            ← Back to Features
        </button>
    );

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 340;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const handleCardClick = (title) => {
        console.log("Card clicked:", title);

        setSelectedFeature(title);
    };

    if (selectedFeature === "ZohoBridge") {
        return (
            <>
                <BackButton />
                <ZohoBridge />
            </>
        );
    }

    if (selectedFeature === "MailMind") {
        return (
            <>
                <BackButton />
                <MailMindButton />
            </>
        );
    }

    if (selectedFeature === "InterviewBot") {
        return (
            <>
                <BackButton />
                <InterviewBot />
            </>
        );
    }

    if (selectedFeature === "PrimeHireBrain") {
        return (
            <>
                <BackButton />
                <PrimeHireBrain />
            </>
        );
    }

    if (selectedFeature === "Upload Resumes") {
        return (
            <>
                <BackButton />
                <UploadUI />
            </>
        );
    }

    if (selectedFeature === "JD Creator") {
        return (
            <>
                <BackButton />
                <JDTaskUI />
            </>
        );
    }

    if (
        selectedFeature === "ChatContainer" ||
        selectedFeature === "ChatInput" ||
        selectedFeature === "Profile Matcher"
    ) {
        return (
            <>
                <BackButton />
                <ChatContainer />
            </>
        );
    }

    if (selectedFeature === "LinkedInPoster") {
        return (
            <>
                <BackButton />
                <LinkedInPosterButton />
            </>
        );
    }

    if (selectedFeature === "CandidateStatus") {
        return (
            <>
                <BackButton />
                <Designation />
            </>
        );
    }

    const cards = [
        {
            icon: <LinkIcon size={36} />,
            title: "ZohoBridge",
            description:
                "Connects seamlessly with Zoho Recruit to fetch, update, and sync candidate or job data using Zoho’s API.",
            triggers: [
                "Fetch Zoho candidates",
                "Update job status",
                "Sync Zoho records",
            ],
        },
        {
            icon: <MailIcon size={36} />,
            title: "MailMind",
            description:
                "Extracts candidate resumes and emails from Outlook or HR inboxes for easy data collection and parsing.",
            triggers: [
                "Extract candidate emails",
                "Parse resumes from inbox",
                "Analyze mail portal data",
            ],
        },
        {
            icon: <VideoIcon size={36} />,
            title: "InterviewBot",
            description:
                "Conducts AI-driven interviews with ID validation and generates evaluation reports automatically.",
            triggers: [
                "Run AI interview",
                "Simulate interview questions",
                "Evaluate candidate performance",
            ],
        },
        {
            icon: <CpuIcon size={36} />,
            title: "PrimeHireBrain",
            description:
                "The central AI-powered candidate database storing all resumes and insights from multiple sources.",
            triggers: [
                "Search candidates in database",
                "Analyze skill gaps",
                "View all uploaded resumes",
            ],
        },
        {
            icon: <UploadIcon size={36} />,
            title: "Upload Resumes",
            description:
                "Upload PDF or DOC resumes directly into PostgreSQL + Pinecone vector database for quick access.",
            triggers: ["Upload candidate resumes", "Bulk upload resumes from folder"],
        },
        {
            icon: <FileTextIcon size={36} />,
            title: "JD Creator",
            description:
                "AI-powered job description generator that asks clarifying questions and creates shareable JDs.",
            triggers: [
                "Create JD for Data Scientist",
                "Generate perfect job post",
                "Refine job description",
            ],
        },
        {
            icon: <SearchIcon size={36} />,
            title: "Profile Matcher",
            description:
                "Matches JDs to best-fit candidate profiles using semantic search and vector embeddings.",
            triggers: [
                "Find best candidates",
                "Match profiles to JD",
                "Compare resumes and job role",
            ],
        },
        {
            icon: <BrainIcon size={36} />,
            title: "LinkedInPoster",
            description:
                "Connect your company’s LinkedIn Page to share openings and posts using the LinkedIn Pages API.",
            triggers: [
                "Post job on LinkedIn",
                "Share on LinkedIn Page",
                "Manage LinkedIn job posts",
            ],
        },
        {
            icon: <LinkIcon size={36} />,
            title: "CandidateStatus",
            description:
                "Connects seamlessly with Zoho Recruit to fetch, update, and sync candidate or job data using Zoho’s API.",
            triggers: [
                "Fetch Zoho candidates",
                "Update job status",
                "Sync Zoho records",
            ],
        },
    ];

    return (
        <div className="info-section">
            <h1 className="section-title">Our Intelligent Recruitment Features</h1>

            {/* Scroll Buttons */}
            <button className="scroll-btn left" onClick={() => scroll("left")}>
                <ChevronLeft size={20} />
            </button>
            <button className="scroll-btn right" onClick={() => scroll("right")}>
                <ChevronRight size={20} />
            </button>

            {/* Scrollable container */}
            <div ref={scrollRef} className="cards-container scrollable">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="info-card"
                        onClick={() => handleCardClick(card.title)}
                    >
                        <div className="card-icon">{card.icon}</div>
                        <h2 className="card-title">{card.title}</h2>
                        <p className="card-description">{card.description}</p>
                        <ul className="card-points">
                            {card.triggers.map((t, i) => (
                                <li key={i}>{t}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
