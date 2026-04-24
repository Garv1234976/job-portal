import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaSignOutAlt,
  FaList,        // ✅ Categories
  FaHome         // ✅ Home
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
    {
      name: "Categories",              // ✅ NEW
      icon: <FaList />,
      path: "/admin/categories",
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login/admin");
  };

  const goToWebsite = () => {
    window.open("/", "_blank"); // ✅ open main site
  };

  return (
    <div
      className="bg-dark text-white p-3 d-flex flex-column justify-content-between"
      style={{ width: "220px", height: "100vh" }}
    >

      {/* TOP SECTION */}
      <div>

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

        </ul>

      </div>

      {/* BOTTOM SECTION */}
      <div>

        {/* GO TO WEBSITE */}
        <button
          className="btn btn-outline-light w-100 mb-2 d-flex align-items-center gap-2"
          onClick={goToWebsite}
        >
          <FaHome />
          Visit Website
        </button>

        {/* LOGOUT */}
        <button
          className="btn btn-danger w-100 d-flex align-items-center gap-2"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </div>
  );
}