import React from "react";
import ResumeTable from "@/chat/ResumeTable";
import { useUploadProgress } from "@/hooks/useUploadProgress";
import "./UploadUI.css";

export default function UploadUI() {
    const [files, setFiles] = React.useState([]);
    const [uploading, setUploading] = React.useState(false);
    const [uploadedData, setUploadedData] = React.useState([]);

    const { progressData, isProcessing } = useUploadProgress();

    // handler functions here...
    const handleFileChange = (e) => setFiles(Array.from(e.target.files));

    const handleUpload = async () => {
        if (!files.length) return;

        window.dispatchEvent(new Event("refresh_trigger"));
        setUploading(true);

        try {
            const formData = new FormData();
            files.forEach((f) => formData.append("files", f));

            await fetch(
                "https://primehire.nirmataneurotech.com/mcp/tools/resume/upload",
                { method: "POST", body: formData }
            );
        } finally {
            setUploading(false);
        }
    };

    React.useEffect(() => {
        if (
            progressData &&
            progressData.total > 0 &&
            progressData.processed === progressData.total
        ) {
            fetch("https://primehire.nirmataneurotech.com/mcp/tools/resume/recent")
                .then((r) => r.json())
                .then((d) => setUploadedData(d.recent_candidates || []));
        }
    }, [progressData]);

    const progressPercent =
        progressData && progressData.total
            ? Math.round((progressData.processed / progressData.total) * 100)
            : 0;

    return (
        <div className="upload-box mt-3">
            <input
                id="resume-upload"
                type="file"
                multiple
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
            />
            <label htmlFor="resume-upload" className="upload-label">
                Choose Files
            </label>

            {files.length > 0 && (
                <div className="selected-files">
                    <strong>{files.length} file(s) selected:</strong>
                    <ul>
                        {files.map((f, i) => (
                            <li key={i}>📄 {f.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {progressData && progressData.total > 0 && (
                <div className="upload-progress">
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>

                    <p className="progress-status">
                        {isProcessing ? (
                            <span className="processing">
                                Processing {progressData.processed}/{progressData.total}...
                            </span>
                        ) : (
                            <span className="success">✅ All resumes processed</span>
                        )}
                    </p>
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!files.length || uploading}
                className="upload-btn"
            >
                {uploading ? "Uploading..." : "Start Upload"}
            </button>

            {uploadedData.length > 0 && (
                <div className="mt-6">
                    <ResumeTable data={uploadedData} />
                </div>
            )}
        </div>
    );
}
