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

  return (
    <div className="bg-white shadow-sm rounded p-3 h-100 position-sticky" style={{ top: "80px" }}>
      <h5 className="mb-3">Recruiter Panel</h5>

      <ul className="list-unstyled">

        {menu.map((item, i) => (
          <li key={i} className="mb-2">

            <div
              className={`d-flex align-items-center p-2 rounded sidebar-item ${
                location.pathname === item.path ? "active" : ""
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
              <i className={`fa ${item.icon} me-2`}></i>
              {item.name}
            </div>

          </li>
        ))}

      </ul>
    </div>
  );
}