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
    <div
      className="bg-white shadow-sm rounded p-3 h-100 position-sticky"
      style={{ top: "80px" }}
    >
      <h5 className="mb-3 fw-bold">Candidate Panel</h5>

      <ul className="list-unstyled">

        {menu.map((item, i) => (
          <li key={i} className="mb-2">

            <div
              className={`d-flex align-items-center justify-content-between p-2 rounded sidebar-item ${
                activeTab === item.id ? "active" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="d-flex align-items-center gap-2">
                {item.icon}
                <span>{item.name}</span>
              </div>

              {activeTab === item.id && (
                <i className="fa fa-chevron-right small"></i>
              )}
            </div>

          </li>
        ))}

      </ul>

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

          .sidebar-item svg {
            min-width: 18px;
          }
        `}
      </style>
    </div>
  );
}