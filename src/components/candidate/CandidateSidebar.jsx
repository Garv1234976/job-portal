import {
  FaBriefcase,
  FaBookmark,
  FaHistory,
  FaUser,
  FaFileAlt,
  FaHomeimport {
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
    <div className="bg-white shadow-sm rounded p-3 h-100 position-sticky" style={{ top: "80px" }}>

      <h5 className="mb-4 fw-bold text-center">
        Candidate Panel
      </h5>

      {menu.map((tab) => (
        <div
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`d-flex align-items-center justify-content-between p-2 mb-2 rounded sidebar-item ${
            activeTab === tab.id ? "active" : ""
          }`}
          style={{ cursor: "pointer" }}
        >
          <div className="d-flex align-items-center gap-2">
            {tab.icon}
            <span>{tab.name}</span> {/* ✅ FIXED */}
          </div>

          {activeTab === tab.id && (
            <i className="fa fa-chevron-right small"></i>
          )}
        </div>
      ))}

      {/* ✅ STYLING */}
      <style>
        {`
          .sidebar-item {
            transition: all 0.2s ease;
            border: 1px solid transparent;
          }

          .sidebar-item:hover {
            background: #f5f7fa;
            transform: translateX(3px);
          }

          .sidebar-item.active {
            background: #0d6efd;
            color: #fff;
            font-weight: 500;
            border-color: #0d6efd;
          }

          .sidebar-item.active svg {
            color: #fff;
          }
        `}
      </style>

    </div>
  );
}
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

      {menu.map((tab) => (
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