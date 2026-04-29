import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaSignOutAlt,
  FaList,
  FaHome,
  FaCog,
  FaDatabase,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

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
    {
      name: "Dropdown Management",
      icon: <FaDatabase />,
      path: "/admin/master-data",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/admin/settings",
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login/admin");
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="d-md-none d-flex justify-content-between align-items-center p-2 bg-dark text-white">
        <button className="btn text-white" onClick={() => setOpen(true)}>
          <FaBars />
        </button>
        <span>Admin Panel</span>
      </div>

      {/* OVERLAY */}
      {open && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      )}

      {/* SIDEBAR */}
      <div className={`admin-sidebar ${open ? "open" : ""}`}>
        
        {/* CLOSE BUTTON (MOBILE) */}
        <div className="d-md-none text-end p-2">
          <button className="btn text-white" onClick={() => setOpen(false)}>
            <FaTimes />
          </button>
        </div>

        {/* HEADER */}
        <div className="sidebar-header text-center">
          <h4 className="fw-bold mb-0">Admin Panel</h4>
        </div>

        {/* MENU */}
        <div className="sidebar-menu flex-grow-1">
          {menu.map((item, index) => {
            const isActive =
              item.path && location.pathname.startsWith(item.path);

            return (
              <div
                key={index}
                className={`sidebar-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  if (item.path) navigate(item.path);
                  else item.action();
                  setOpen(false);
                }}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.name}</span>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="sidebar-footer mt-auto">
          <div className="sidebar-item logout" onClick={handleLogout}>
            <span className="icon">
              <FaSignOutAlt />
            </span>
            <span className="label">Logout</span>
          </div>
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 250px;
          min-width: 250px;
          background: #0f172a;
          color: white;
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .admin-sidebar.open {
          transform: translateX(0);
        }

        /* DESKTOP FIX */
        @media (min-width: 768px) {
          .admin-sidebar {
            transform: translateX(0);
          }
        }

        .sidebar-header {
          padding: 15px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .sidebar-menu {
          padding: 10px;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar-item:hover {
          background: rgba(255,255,255,0.1);
          transform: translateX(4px);
        }

        .sidebar-item.active {
          background: #2563eb;
        }

        .sidebar-item.logout {
          color: #f87171;
        }

        .icon {
          font-size: 16px;
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 999;
        }
      `}</style>
    </>
  );
}