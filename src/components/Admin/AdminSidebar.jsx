import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaSignOutAlt,
  FaList,
  FaHome
} from "react-icons/fa";

import "../../components/Category.css";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    {
      name: "Visit Website",
      icon: <FaHome />,
      action: () => window.open("/", "_blank"),
    },
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/admin/dashboard",
    },
    {
      name: "Users",
      icon: <FaUsers />,
      path: "/admin/users",
    },
    {
      name: "Jobs",
      icon: <FaBriefcase />,
      path: "/admin/jobs",
    },
    {
      name: "Applications",
      icon: <FaFileAlt />,
      path: "/admin/applications",
    },
    {
      name: "Categories",
      icon: <FaList />,
      path: "/admin/categories",
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login/admin");
  };

  return (
    <div className="admin-sidebar d-flex flex-column">

      {/* HEADER */}
      <div className="sidebar-header text-center">
        <h4 className="fw-bold mb-0">Admin Panel</h4>
      </div>

      {/* MENU */}
      <div className="sidebar-menu flex-grow-1">
        {menu.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <div
              key={index}
              className={`sidebar-item ${isActive ? "active" : ""}`}
              onClick={() =>
                item.path ? navigate(item.path) : item.action()
              }
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.name}</span>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="sidebar-footer mt-auto">
        <div
          className="sidebar-item logout"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span className="label">Logout</span>
        </div>
      </div>

    </div>
  );
}