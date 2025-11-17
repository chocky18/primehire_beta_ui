// import React, { useState, useEffect } from "react";
// import { Mail, MessageSquare, Bot } from "lucide-react";
// import { sendMailMessage, sendWhatsAppMessage } from "@/utils/api";
// import { API_BASE } from "@/utils/constants";

// const ProfileTable = ({ data, index }) => {
//   const [filterQuery, setFilterQuery] = useState("");
//   const [minScoreFilter, setMinScoreFilter] = useState(0);
//   const [sortConfig, setSortConfig] = useState({ key: "scores.final_score", direction: "desc" });
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [responses, setResponses] = useState({});
//   const [whatsappAvailable, setWhatsappAvailable] = useState(true); // ✅ Added WhatsApp availability state

//   // ✅ Move the filter function inside the component to access state variables
//   const sortAndFilterMatches = (matches) => {
//     if (!Array.isArray(matches)) return [];

//     const getNestedValue = (obj, key) =>
//       key.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);

//     const filtered = matches.filter((m) => {
//       // min score filter - now using component state
//       if (typeof m?.scores?.final_score === "number" && m.scores.final_score < minScoreFilter) return false;
//       // text filter - now using component state
//       if (!filterQuery) return true;
//       const q = filterQuery.toLowerCase();
//       const nameOk = (m.name || "").toLowerCase().includes(q);
//       const skillsOk = (Array.isArray(m.skills) ? m.skills.join(", ") : (m.skills || "")).toLowerCase().includes(q);
//       return nameOk || skillsOk;
//     });

//     // sort
//     const sorted = filtered.sort((a, b) => {
//       const aVal = getNestedValue(a, sortConfig.key) ?? 0;
//       const bVal = getNestedValue(b, sortConfig.key) ?? 0;
//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });

//     return sorted;
//   };

//   // Fetch WhatsApp responses and check availability
//   useEffect(() => {
//     const fetchResponses = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/mcp/tools/match/whatsapp/responses`);
//         if (res.ok) {
//           const data = await res.json();
//           setResponses(data);
//         }
//       } catch (err) {
//         console.error("❌ Failed to fetch WhatsApp responses:", err);
//         setWhatsappAvailable(false); // ✅ Disable WhatsApp if responses fail
//       }
//     };

//     fetchResponses();
//     const interval = setInterval(fetchResponses, 20000);
//     return () => clearInterval(interval);
//   }, []);

//   const displayedMatches = sortAndFilterMatches(data || []);

//   const summary = { best: 0, good: 0, partial: 0 };
//   displayedMatches.forEach(item => {
//     const autoScore = calculateAutoScore(item);
//     item.autoScore = autoScore;

//     if (autoScore >= 85) summary.best++;
//     else if (autoScore >= 60) summary.good++;
//     else summary.partial++;
//   });

//   return (
//     <div key={index} className="overflow-x-auto bg-white rounded-xl shadow p-4 my-4">
//       <div className="flex items-center justify-between mb-3">
//         <h2 className="text-lg font-semibold">🎯 Profile Matches</h2>
//         <div className="flex gap-2 items-center">
//           <input
//             type="text"
//             placeholder="Filter by name or skill..."
//             className="border rounded px-3 py-1 min-w-[200px]"
//             value={filterQuery}
//             onChange={(e) => setFilterQuery(e.target.value)}
//           />
//           <input
//             type="number"
//             min={0}
//             max={100}
//             step={1}
//             placeholder="Min Score"
//             className="border rounded px-3 py-1 w-24"
//             value={minScoreFilter}
//             onChange={(e) => setMinScoreFilter(Number(e.target.value))}
//           />
//           <button
//             className="border rounded px-3 py-1"
//             onClick={() => setSortConfig(prev => ({
//               key: prev.key,
//               direction: prev.direction === "asc" ? "desc" : "asc"
//             }))}
//           >
//             Sort: {sortConfig.direction === "asc" ? "▲" : "▼"}
//           </button>
//         </div>
//       </div>

//       {displayedMatches.length === 0 ? (
//         <p className="text-muted-foreground">No profiles match current filters.</p>
//       ) : (
//         <table className="w-full table-auto border-collapse">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border px-4 py-2 text-left">Name</th>
//               <th className="border px-4 py-2 text-left">Designation</th>
//               <th className="border px-4 py-2 text-left">Location</th>
//               <th className="border px-4 py-2 text-left">Phone</th>
//               <th className="border px-4 py-2 text-left">Email</th>
//               <th className="border px-4 py-2 text-left">Experience</th>
//               <th className="border px-4 py-2 text-left">Skills</th>
//               <th className="border px-4 py-2 text-left">Actions</th>
//               <th className="border px-4 py-2 text-left cursor-pointer">Score</th>
//               <th className="border px-4 py-2">Available for Interview</th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayedMatches.map((item, idx) => (
//               <ProfileTableRow 
//                 key={idx} 
//                 item={item} 
//                 responses={responses}
//                 onSendMail={sendMailMessage}
//                 onSendWhatsApp={sendWhatsAppMessage}
//                 whatsappAvailable={whatsappAvailable} // ✅ Pass availability state
//               />
//             ))}
//           </tbody>
//         </table>
//       )}

//       {displayedMatches.length > 0 && (
//         <ReviewSummary 
//           summary={summary}
//           selectedCategory={selectedCategory}
//           onCategorySelect={setSelectedCategory}
//           displayedMatches={displayedMatches}
//           responses={responses}
//           whatsappAvailable={whatsappAvailable} // ✅ Pass availability state
//         />
//       )}
//     </div>
//   );
// };

// // ✅ UPDATED ProfileTableRow with WhatsApp availability check
// const ProfileTableRow = ({ item, responses, onSendMail, onSendWhatsApp, whatsappAvailable }) => {
//   const matchLevel = item.autoScore >= 85 ? "Best match" : item.autoScore >= 60 ? "Good match" : "Partial match";
//   const barWidth = Math.min(Math.max(item.autoScore, 5), 100) + "%";
//   const normalizedPhone = (item.phone || "").replace(/\D/g, "");
//   const whatsappResp = responses[normalizedPhone] || {};

//   const handleWhatsAppClick = async () => {
//     if (!whatsappAvailable) {
//       alert("WhatsApp service is currently unavailable. Please use email instead.");
//       return;
//     }

//     try {
//       await onSendWhatsApp(item);
//     } catch (error) {
//       // Error is already handled in the API function
//       console.log("WhatsApp send attempt failed:", error.message);
//     }
//   };

//   return (
//     <tr className="hover:bg-gray-50">
//       <td className="border px-4 py-2 flex items-center gap-3">
//         {/* <input type="checkbox" className="checkbox mt-2" />
//         <img
//           src={item.image || "https://static.vecteezy.com/system/resources/previews/013/317/241/non_2x/incognito-icon.jpg"}
//           alt={item.name}
//           className="profile-img"
//         /> */}
//         <div className="flex flex-col">
//           <div className="font-semibold">{item.name}</div>
//           <div className="text-xs text-muted">{item.designation}</div>
//           <div className={`match-label mt-1 px-2 py-0.5 rounded text-xs font-medium ${matchLevel === "Best match" ? "match-best" : matchLevel === "Good match" ? "match-good" : "match-partial"}`}>
//             {matchLevel}
//           </div>
//           <div className="match-bar mt-1 h-2 w-28 rounded-full bg-gray-200 overflow-hidden">
//             <div className={`bar-fill ${matchLevel === "Best match" ? "best" : matchLevel === "Good match" ? "good" : "partial"}`} style={{ width: barWidth, height: "100%" }} />
//           </div>
//         </div>
//       </td>
//       <td className="border px-4 py-2">{item.designation}</td>
//       <td className="border px-4 py-2">{item.location}</td>
//       <td className="border px-4 py-2">{item.phone || "—"}</td>
//       <td className="border px-4 py-2">{item.email || "—"}</td>
//       <td className="border px-4 py-2">{item.experience_years} yrs</td>
//       <td className="border px-4 py-2">{(item.skills || []).join(", ")}</td>
//       <td className="border px-4 py-2 text-center flex gap-2 justify-center">
//         <button title="Send Mail" className="text-blue-600 hover:text-blue-800" onClick={() => onSendMail(item)}>
//           <Mail size={18} />
//         </button>
//         <button 
//           title={whatsappAvailable ? "Send WhatsApp" : "WhatsApp Unavailable"} 
//           className={`${whatsappAvailable ? "text-green-500 hover:text-green-700" : "text-gray-400 cursor-not-allowed"}`}
//           onClick={handleWhatsAppClick}
//           disabled={!whatsappAvailable}
//         >
//           <MessageSquare size={18} />
//         </button>
//         <button title="Interview Bot" className="text-purple-600 hover:text-purple-800">
//           <Bot size={18} />
//         </button>
//       </td>
//       <td className="border px-4 py-2 font-semibold">{item.autoScore}/100</td>
//       <td className="border px-4 py-2 text-center">
//         {whatsappResp.type === "button" ? whatsappResp.payload : "—"}
//       </td>
//     </tr>
//   );
// };

// const ReviewSummary = ({ summary, selectedCategory, onCategorySelect, displayedMatches, responses, whatsappAvailable }) => (
//   <div className="final-review-box mt-6">
//     <div className="review-cards flex gap-4">
//       {["best", "good", "partial"].map((type) => (
//         <div
//           key={type}
//           className={`review-card cursor-pointer border-2 border-${type === "best" ? "green" : type === "good" ? "yellow" : "red"}-500 p-3 rounded ${selectedCategory === type ? "shadow-lg" : ""}`}
//           onClick={() => onCategorySelect(type)}
//         >
//           <h4>{type === "best" ? "🏆 Best Match" : type === "good" ? "👍 Good Match" : "⚙️ Partial Match"}</h4>
//           <p>{summary[type]} profiles</p>
//         </div>
//       ))}
//     </div>

//     {selectedCategory && (
//       <CategoryTable 
//         category={selectedCategory}
//         displayedMatches={displayedMatches}
//         responses={responses}
//         whatsappAvailable={whatsappAvailable} // ✅ Pass availability state
//       />
//     )}
//   </div>
// );

// const CategoryTable = ({ category, displayedMatches, responses, whatsappAvailable }) => {
//   const filteredMatches = displayedMatches.filter(item => {
//     if (category === "best") return item.autoScore >= 85;
//     if (category === "good") return item.autoScore >= 60 && item.autoScore < 85;
//     return item.autoScore < 60;
//   });

//   return (
//     <div className="match-details-table mt-6">
//       <h4 className="text-lg font-semibold mb-2">
//         {category === "best" ? "🏆 Best Match Profiles" : category === "good" ? "👍 Good Match Profiles" : "⚙️ Partial Match Profiles"}
//       </h4>
//       <table className="w-full table-auto border-collapse">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border px-4 py-2">Name</th>
//             <th className="border px-4 py-2">Designation</th>
//             <th className="border px-4 py-2">Location</th>
//             <th className="border px-4 py-2">Phone</th>
//             <th className="border px-4 py-2">Email</th>
//             <th className="border px-4 py-2">Experience</th>
//             <th className="border px-4 py-2">Skills</th>
//             <th className="border px-4 py-2">Actions</th>
//             <th className="border px-4 py-2">Score</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredMatches.map((item, idx) => (
//             <ProfileTableRow 
//               key={idx} 
//               item={item} 
//               responses={responses}
//               onSendMail={sendMailMessage}
//               onSendWhatsApp={sendWhatsAppMessage}
//               whatsappAvailable={whatsappAvailable} // ✅ Pass availability state
//             />
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // ✅ Move utility functions outside the component
// const calculateAutoScore = (item) => {
//   if (item.experience_years >= 6) return Math.floor(Math.random() * 10) + 90;
//   if (item.experience_years >= 2 && item.experience_years <= 3) return Math.floor(Math.random() * 10) + 60;
//   if (item.experience_years === 0) return Math.floor(Math.random() * 20) + 30;
//   return Math.floor(Math.random() * 20) + 50;
// };

// export default ProfileTable;

import React, { useState, useEffect } from "react";
import { Mail, MessageSquare, Bot } from "lucide-react";
import { sendMailMessage, sendWhatsAppMessage } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import "./ProfileTable.css";

const ProfileTable = ({ data, index }) => {
  const [filterQuery, setFilterQuery] = useState("");
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: "scores.final_score",
    direction: "desc",
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [responses, setResponses] = useState({});
  const [whatsappAvailable, setWhatsappAvailable] = useState(true);

  // ⭐ Checkboxes State
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // ⭐ Dropdown state
  const [showSendMenu, setShowSendMenu] = useState(false);

  // ⭐ Select All Logic
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(displayedMatches.map((item) => item));
    }
    setSelectAll(!selectAll);
  };

  // ⭐ Single Row Checkbox
  const handleRowSelect = (item) => {
    const exists = selectedRows.find((x) => x.phone === item.phone);

    if (exists) {
      setSelectedRows(selectedRows.filter((x) => x.phone !== item.phone));
    } else {
      setSelectedRows([...selectedRows, item]);
    }
  };

  // ⭐ Bulk Send Handling
  const handleBulkSend = async (type) => {
    if (selectedRows.length === 0)
      return alert("Please select at least one candidate.");

    for (const item of selectedRows) {
      try {
        if (type === "email") await sendMailMessage(item);
        if (type === "whatsapp") await sendWhatsAppMessage(item);
      } catch (err) {
        console.error("Send failed:", err);
      }
    }

    alert(
      `Successfully sent ${type} to ${selectedRows.length} candidate(s)`
    );
    setShowSendMenu(false);
  };

  // ⭐ Sorting + Filtering
  const sortAndFilterMatches = (matches) => {
    if (!Array.isArray(matches)) return [];

    const getNestedValue = (obj, key) =>
      key.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);

    const filtered = matches.filter((m) => {
      if (
        typeof m?.scores?.final_score === "number" &&
        m.scores.final_score < minScoreFilter
      )
        return false;

      if (!filterQuery) return true;

      const q = filterQuery.toLowerCase();
      const nameOk = (m.name || "").toLowerCase().includes(q);
      const skillsOk = (Array.isArray(m.skills)
        ? m.skills.join(", ")
        : m.skills || ""
      )
        .toLowerCase()
        .includes(q);

      return nameOk || skillsOk;
    });

    const sorted = filtered.sort((a, b) => {
      const aVal = getNestedValue(a, sortConfig.key) ?? 0;
      const bVal = getNestedValue(b, sortConfig.key) ?? 0;

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  // ⭐ Fetch WhatsApp responses
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/mcp/tools/match/whatsapp/responses`
        );
        if (res.ok) {
          const data = await res.json();
          setResponses(data);
        }
      } catch {
        setWhatsappAvailable(false);
      }
    };

    fetchResponses();
    const interval = setInterval(fetchResponses, 20000);
    return () => clearInterval(interval);
  }, []);

  // ⭐ First sort/filter all data
  let displayedMatches = sortAndFilterMatches(data || []);

  // ⭐ Apply category filter
  if (selectedCategory) {
    displayedMatches = displayedMatches.filter((item) => {
      const score = item.autoScore;
      if (selectedCategory === "best") return score >= 85;
      if (selectedCategory === "good") return score >= 60 && score < 85;
      if (selectedCategory === "partial") return score < 60;
      return true;
    });
  }

  // ⭐ Summary counts
  const summary = { best: 0, good: 0, partial: 0 };
  data.forEach((item) => {
    const autoScore = calculateAutoScore(item);
    item.autoScore = autoScore;

    if (autoScore >= 85) summary.best++;
    else if (autoScore >= 60) summary.good++;
    else summary.partial++;
  });

  return (
    <div key={index} className="profile-box">
      <div className="filters-row">
        <h2 className="title">🎯 Profile Matches</h2>

        <div className="filter-inputs">
          <input
            type="text"
            placeholder="Filter name or skill..."
            className="input-box"
            value={filterQuery}
            onChange={(e) => {
              setFilterQuery(e.target.value);
              setSelectedCategory(null);
            }}
          />

          <input
            type="number"
            min={0}
            max={100}
            step={1}
            placeholder="Min Score"
            className="input-box small"
            value={minScoreFilter}
            onChange={(e) => {
              setMinScoreFilter(Number(e.target.value));
              setSelectedCategory(null);
            }}
          />

          <button
            className="sort-btn"
            onClick={() =>
              setSortConfig((prev) => ({
                key: prev.key,
                direction: prev.direction === "asc" ? "desc" : "asc",
              }))
            }
          >
            Sort: {sortConfig.direction === "asc" ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* ========================= SEND BUTTON DROPDOWN ========================= */}
      <div className="bulk-send-container">
        <div className="bulk-send-wrapper">
          <button
            className="bulk-send-btn"
            onClick={() => setShowSendMenu((prev) => !prev)}
          >
            Send ({selectedRows.length})
          </button>
          {showSendMenu && (
            <div className="send-dropdown">

              <button
                className="send-option action-style"
                onClick={() => handleBulkSend("email")}
              >
                <Mail size={16} />
                <span>Email</span>
              </button>

              <button
                className="send-option action-style"
                onClick={() => handleBulkSend("whatsapp")}
              >
                <MessageSquare size={16} />
                <span>WhatsApp</span>
              </button>

            </div>
          )}

        </div>
      </div>

      {selectedCategory && (
        <button
          className="clear-category"
          onClick={() => setSelectedCategory(null)}
        >
          ❌ Clear Category Filter
        </button>
      )}

      {displayedMatches.length === 0 ? (
        <p>No matching profiles.</p>
      ) : (
        <table className="profiles-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>

              <th>Name</th>
              <th>Designation</th>
              <th>Location</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Exp</th>
              <th>Skills</th>
              <th>Actions</th>
              <th>Score</th>
              <th>Interview</th>
            </tr>
          </thead>

          <tbody>
            {displayedMatches.map((item, idx) => (
              <ProfileTableRow
                key={idx}
                item={item}
                responses={responses}
                onSendMail={sendMailMessage}
                onSendWhatsApp={sendWhatsAppMessage}
                whatsappAvailable={whatsappAvailable}
                onRowSelect={handleRowSelect}
                isSelected={selectedRows.some(
                  (x) => x.phone === item.phone
                )}
              />
            ))}
          </tbody>
        </table>
      )}

      <ReviewSummary
        summary={summary}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
    </div>
  );
};

// ========================= ROW COMPONENT =========================

const ProfileTableRow = ({
  item,
  responses,
  onSendMail,
  onSendWhatsApp,
  whatsappAvailable,
  onRowSelect,
  isSelected,
}) => {
  const matchLevel =
    item.autoScore >= 85
      ? "Best match"
      : item.autoScore >= 60
        ? "Good match"
        : "Partial match";

  const barWidth = Math.min(Math.max(item.autoScore, 5), 100) + "%";

  const normalizedPhone = (item.phone || "").replace(/\D/g, "");
  const whatsappResp = responses[normalizedPhone] || {};

  const handleWhatsAppClick = async () => {
    if (!whatsappAvailable)
      return alert("WhatsApp not available now. Try email.");
    try {
      await onSendWhatsApp(item);
    } catch { }
  };

  return (
    <tr>
      {/* Checkbox Column */}
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onRowSelect(item)}
        />
      </td>

      <td>
        <div className="name-cell">
          <span className="name">{item.name}</span>
          <span
            className={`match-label ${matchLevel === "Best match"
              ? "match-best"
              : matchLevel === "Good match"
                ? "match-good"
                : "match-partial"
              }`}
          >
            {matchLevel}
          </span>

          <div className="match-bar">
            <div
              className={`bar-fill ${matchLevel === "Best match"
                ? "best"
                : matchLevel === "Good match"
                  ? "good"
                  : "partial"
                }`}
              style={{ width: barWidth }}
            />
          </div>
        </div>
      </td>

      <td>{item.designation}</td>
      <td>{item.location}</td>
      <td>{item.phone || "—"}</td>
      <td>{item.email || "—"}</td>
      <td>{item.experience_years} yrs</td>
      <td>{(item.skills || []).join(", ")}</td>

      <td className="actions-cell">
        <div className="action-group">
          <button
            className="action-btn mail"
            onClick={() => onSendMail(item)}
          >
            <Mail size={16} /> Mail
          </button>

          <button
            className={`action-btn whatsapp ${!whatsappAvailable ? "disabled" : ""
              }`}
            onClick={handleWhatsAppClick}
            disabled={!whatsappAvailable}
          >
            <MessageSquare size={16} /> WhatsApp
          </button>

          <button className="action-btn bot">
            <Bot size={16} /> AI
          </button>
        </div>
      </td>

      <td className="score">{item.autoScore}/100</td>

      <td>{whatsappResp?.type === "button" ? whatsappResp.payload : "—"}</td>
    </tr>
  );
};

// ========================= SUMMARY =========================

const ReviewSummary = ({
  summary,
  selectedCategory,
  onCategorySelect,
}) => (
  <div className="summary-box">
    <div className="review-cards">
      {["best", "good", "partial"].map((type) => (
        <div
          key={type}
          className={`review-card ${selectedCategory === type ? "active" : ""
            }`}
          onClick={() => onCategorySelect(type)}
        >
          <h4>
            {type === "best"
              ? "🏆 Best Matches"
              : type === "good"
                ? "👍 Good Matches"
                : "⚙ Partial Matches"}
          </h4>
          <p>{summary[type]} profiles</p>
        </div>
      ))}
    </div>
  </div>
);

const calculateAutoScore = (item) => {
  if (item.experience_years >= 6)
    return Math.floor(Math.random() * 10) + 90;
  if (item.experience_years >= 2 && item.experience_years <= 3)
    return Math.floor(Math.random() * 10) + 60;
  if (item.experience_years === 0)
    return Math.floor(Math.random() * 20) + 30;
  return Math.floor(Math.random() * 20) + 50;
};

export default ProfileTable;