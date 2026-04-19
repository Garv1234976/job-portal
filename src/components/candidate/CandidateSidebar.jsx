import {
  FaBriefcase,
  FaBookmark,
  FaHistory,
  FaUser,
  FaFileAlt,
  FaHome
} from "react-icons/fa";

export default function CandidateSidebar({ activeTab, setActiveTab }) {

 const menu = [
  { id: "dashboard", name: "Dashboard", icon: <FaHome /> },

  { id: "applied", name: "Applied Jobs", icon: <FaBriefcase /> },
  { id: "saved", name: "Saved Jobs", icon: <FaBookmark /> },
  { id: "lastViewed", name: "Last Viewed", icon: <FaHistory /> },

  { id: "profile", name: "Edit Profile", icon: <FaUser /> },
  { id: "resume", name: "Resume", icon: <FaFileAlt /> },
];

  return (
    <div className="bg-white shadow-sm rounded p-3 h-100">

      <h5 className="mb-4 fw-bold text-center">
        Candidate Panel
      </h5>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`d-flex align-items-center gap-2 p-2 mb-2 rounded ${
            activeTab === tab.id
              ? "bg-primary text-white"
              : "bg-light"
          }`}
          style={{ cursor: "pointer" }}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </div>
      ))}

    </div>
  );
}