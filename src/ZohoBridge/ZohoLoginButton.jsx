// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { CheckCircle } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// const ZOHO_AUTH_URL = `https://accounts.zoho.com/oauth/v2/auth?client_id=1000.7EDK5QI3TSUU214UOL80N0VMWKMKYO&response_type=code&scope=ZohoRecruit.modules.ALL&redirect_uri=http://54.167.210.32:8000/callback&access_type=offline&prompt=consent`;

// export default function ZohoLoginButton() {
//     const [activeButton, setActiveButton] = useState("");
//     const [candidates, setCandidates] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [isConnected, setIsConnected] = useState(false);
//     const popupRef = useRef(null);

//     useEffect(() => {
//         const listener = (event) => {
//             if (event.origin !== window.location.origin) return;

//             if (event.data === "ZOHO_AUTH_SUCCESS") {
//                 setIsConnected(true);
//                 setActiveButton("");
//                 alert("✅ Zoho connected successfully!");
//                 if (popupRef.current) popupRef.current.close();
//             }
//         };

//         window.addEventListener("message", listener);
//         return () => window.removeEventListener("message", listener);
//     }, []);

//     const handleLogin = () => {
//         setActiveButton("connect");
//         const width = 600;
//         const height = 700;
//         const left = window.screen.width / 2 - width / 2;
//         const top = window.screen.height / 2 - height / 2;

//         popupRef.current = window.open(
//             ZOHO_AUTH_URL,
//             "Zoho Login",
//             `width=${width},height=${height},top=${top},left=${left}`
//         );

//         const timer = setInterval(() => {
//             if (!popupRef.current || popupRef.current.closed) {
//                 clearInterval(timer);
//                 setActiveButton("");
//             }
//         }, 500);
//     };

//     const fetchCandidates = async () => {
//         setActiveButton("fetch");
//         setLoading(true);
//         setError("");
//         try {
//             const res = await fetch(
//                 "http://54.167.210.32:8000/fetch_candidates?email=director@nirmataneurotech.com&page=1&per_page=50"
//             );
//             if (!res.ok) throw new Error("Failed to fetch candidates");
//             const data = await res.json();
//             setCandidates(data.candidates || []);
//         } catch (err) {
//             console.error(err);
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex flex-col items-center mt-8 space-y-4">
//             <AnimatePresence>
//                 <motion.div
//                     initial={{ scale: 0.8, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     exit={{ scale: 0.8, opacity: 0 }}
//                     transition={{ duration: 0.3 }}
//                 >
//                     <Button
//                         variant={
//                             isConnected
//                                 ? "default"
//                                 : activeButton === "connect"
//                                     ? "default"
//                                     : "outline"
//                         }
//                         className={`rounded-full flex items-center gap-2 px-6 py-2 ${
//                             isConnected
//                                 ? "bg-green-600 hover:bg-green-700 text-white"
//                                 : "bg-white text-black hover:bg-gray-100"
//                         }`}
//                         onClick={handleLogin}
//                         disabled={isConnected}
//                     >
//                         {isConnected && <CheckCircle size={16} />}
//                         {isConnected ? "Connected" : "Connect Zoho"}
//                     </Button>
//                 </motion.div>
//             </AnimatePresence>

//             <Button
//                 variant={activeButton === "fetch" ? "default" : "outline"}
//                 className="rounded-full"
//                 onClick={fetchCandidates}
//             >
//                 Fetch Candidates
//             </Button>

//             {loading && <p className="mt-4">Loading candidates...</p>}
//             {error && <p className="mt-4 text-red-600">{error}</p>}

//             {candidates.length > 0 && (
//                 <div className="overflow-x-auto mt-4 w-full">
//                     <table className="min-w-full bg-white border border-gray-300">
//                         <thead>
//                             <tr className="bg-gray-200">
//                                 <th className="border px-4 py-2">Name</th>
//                                 <th className="border px-4 py-2">Email</th>
//                                 <th className="border px-4 py-2">Current Employer</th>
//                                 <th className="border px-4 py-2">Job Title</th>
//                                 <th className="border px-4 py-2">Experience</th>
//                                 <th className="border px-4 py-2">Status</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {candidates.map((c) => (
//                                 <tr key={c.id}>
//                                     <td className="border px-4 py-2">{c.Full_Name || "No Name"}</td>
//                                     <td className="border px-4 py-2">{c.Email || "-"}</td>
//                                     <td className="border px-4 py-2">{c.Current_Employer || "-"}</td>
//                                     <td className="border px-4 py-2">{c.Current_Job_Title || "-"}</td>
//                                     <td className="border px-4 py-2">{c.Experience_in_Years ?? "-"}</td>
//                                     <td className="border px-4 py-2">{c.Candidate_Status || "-"}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// }
import React, { useState, useEffect, useRef } from "react";
import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./ZohoLoginButton.css";

const ZOHO_AUTH_URL = `https://accounts.zoho.com/oauth/v2/auth?client_id=1000.7EDK5QI3TSUU214UOL80N0VMWKMKYO&response_type=code&scope=ZohoRecruit.modules.ALL&redirect_uri=https://primehire.nirmataneurotech.com/callback&access_type=offline&prompt=consent`;

export default function ZohoLoginButton() {
  const [activeButton, setActiveButton] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const listener = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data === "ZOHO_AUTH_SUCCESS") {
        setIsConnected(true);
        setActiveButton("");
        alert("✅ Zoho connected successfully!");
        if (popupRef.current) popupRef.current.close();
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);

  const handleLogin = () => {
    setActiveButton("connect");
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    popupRef.current = window.open(
      ZOHO_AUTH_URL,
      "Zoho Login",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const timer = setInterval(() => {
      if (!popupRef.current || popupRef.current.closed) {
        clearInterval(timer);
        setActiveButton("");
      }
    }, 500);
  };

  const fetchCandidates = async () => {
    setActiveButton("fetch");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        "https://primehire.nirmataneurotech.com/fetch_candidates?email=director@nirmataneurotech.com&page=1&per_page=50"
      );
      if (!res.ok) throw new Error("Failed to fetch candidates");
      const data = await res.json();
      setCandidates(data.candidates || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
      setActiveButton("");
    }
  };

  return (
    <div className="zoho-container">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            className={`zoho-btn ${isConnected ? "connected" : ""}`}
            onClick={handleLogin}
            disabled={isConnected}
          >
            {isConnected && <CheckCircle size={16} />}
            {isConnected ? "Connected" : "Connect Zoho"}
          </button>
        </motion.div>
      </AnimatePresence>

      <button
        className={`fetch-btn ${activeButton === "fetch" ? "loading" : ""}`}
        onClick={fetchCandidates}
        disabled={loading}
      >
        {loading ? "Fetching..." : "Fetch Candidates"}
      </button>

      {loading && <p className="loading-text">Loading candidates...</p>}
      {error && <p className="error-text">{error}</p>}

      {candidates.length > 0 && (
        <div className="table-container">
          <table className="zoho-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Current Employer</th>
                <th>Job Title</th>
                <th>Experience</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.id}>
                  <td data-label="Name">{c.Full_Name || "No Name"}</td>
                  <td data-label="Email">{c.Email || "-"}</td>
                  <td data-label="Current Employer">{c.Current_Employer || "-"}</td>
                  <td data-label="Job Title">{c.Current_Job_Title || "-"}</td>
                  <td data-label="Experience">{c.Experience_in_Years ?? "-"}</td>
                  <td data-label="Status">{c.Candidate_Status || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
