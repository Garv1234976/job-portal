import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaSignOutAlt
} from "react-icons/fa";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
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
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login/admin");
  };

  return (
    <div
      className="bg-dark text-white p-3 vh-100"
      style={{ width: "220px" }}
    >
      {/* LOGO */}
      <h4 className="text-center mb-4 fw-bold">Admin Panel</h4>

      {/* MENU */}
      <ul className="nav flex-column">

        {menu.map((item, index) => (
          <li key={index} className="nav-item mb-2">
            <button
              className={`btn w-100 text-start d-flex align-items-center gap-2 ${
                location.pathname === item.path
                  ? "btn-primary"
                  : "btn-dark"
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.name}
            </button>
          </li>
        ))}

        {/* LOGOUT */}
        <li className="nav-item mt-4">
          <button
            className="btn btn-danger w-100 d-flex align-items-center gap-2"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </li>

      </ul>
    </div>
  );
}