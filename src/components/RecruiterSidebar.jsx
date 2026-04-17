import { useNavigate, useLocation } from "react-router-dom";

export default function RecruiterSidebar({ handlePostJob }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", icon: "fa-home", path: "/recruiter/dashboard" },
    { name: "Post Job", icon: "fa-plus-circle", action: handlePostJob },
    { name: "My Jobs", icon: "fa-briefcase", path: "/recruiter/jobs" },
    { name: "Applications", icon: "fa-users", path: "/recruiter/applications" },
    { name: "Closed Jobs", icon: "fa-times-circle", path: "/recruiter/closed-jobs" },
    { name: "Plans", icon: "fa-credit-card", path: "/recruiter/plans" },
  ];

  // ✅ Better active check (handles sub routes also)
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className="bg-white shadow-sm rounded p-3 h-100 position-sticky"
      style={{ top: "80px" }}
    >
      <h5 className="mb-3 fw-bold">Recruiter Panel</h5>

      <ul className="list-unstyled">

        {menu.map((item, i) => (
          <li key={i} className="mb-2">

            <div
              className={`d-flex align-items-center justify-content-between p-2 rounded sidebar-item ${
                item.path && isActive(item.path) ? "active" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  navigate(item.path);
                }
              }}
            >
              <div className="d-flex align-items-center">
                <i className={`fa ${item.icon} me-2`}></i>
                <span>{item.name}</span>
              </div>

              {/* 👉 Optional indicator */}
              {item.path && isActive(item.path) && (
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

          .sidebar-item.active i {
            color: #fff;
          }
        `}
      </style>
    </div>
  );
}