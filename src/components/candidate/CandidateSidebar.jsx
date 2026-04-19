import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBriefcase,
  FaBookmark,
  FaHistory,
  FaUser,
  FaFileAlt,
  FaHome
} from "react-icons/fa";

export default function CandidateSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", icon: <FaHome />, path: "/candidate/dashboard" },
    { name: "Applied Jobs", icon: <FaBriefcase />, path: "/candidate/applied" },
    { name: "Saved Jobs", icon: <FaBookmark />, path: "/candidate/saved" },
    { name: "Last Viewed", icon: <FaHistory />, path: "/candidate/last-viewed" },
    { name: "Edit Profile", icon: <FaUser />, path: "/profile" },
    { name: "Resume", icon: <FaFileAlt />, path: "/candidate/resume" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white shadow-sm rounded p-3 h-100">

      <h5 className="mb-4 fw-bold text-center">
        Candidate Panel
      </h5>

      {menu.map((item, i) => (
        <div
          key={i}
          onClick={() => navigate(item.path)}
          className={`d-flex align-items-center gap-2 p-2 mb-2 rounded ${
            isActive(item.path) ? "active-sidebar" : "bg-light"
          }`}
          style={{ cursor: "pointer" }}
        >
          {item.icon}
          <span>{item.name}</span>
        </div>
      ))}

      <style>
        {`
          .active-sidebar {
            background: #28a745;
            color: #fff;
            font-weight: 500;
          }

          .active-sidebar i {
            color: #fff;
          }
        `}
      </style>
    </div>
  );
}