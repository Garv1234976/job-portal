import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function RecruiterSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activePlan, setActivePlan] = useState(null);

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => {
        setActivePlan(res.data.active_plan);
      })
      .catch(() => {});
  }, []);

  const handlePostJob = () => {
    if (!activePlan || activePlan.jobs_remaining <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Plan Required",
        text: "Please buy or upgrade your plan",
      }).then(() => {
        navigate("/recruiter/plans");
      });
    } else {
      navigate("/recruiter/create-job");
    }
  };

  const menu = [
    { name: "Dashboard", icon: "fa-home", path: "/recruiter/dashboard" },
    { name: "Post Job", icon: "fa-plus-circle", action: handlePostJob },
    { name: "My Jobs", icon: "fa-briefcase", path: "/recruiter/jobs" },
    { name: "Closed Jobs", icon: "fa-times-circle", path: "/recruiter/closed-jobs" },
    { name: "Plans", icon: "fa-credit-card", path: "/recruiter/plans" },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="sidebar-container">
      <h5 className="sidebar-title">Recruiter Panel</h5>

      <ul className="sidebar-menu">
        {menu.map((item, i) => (
          <li key={i}>
            <div
              className={`sidebar-item ${item.path && isActive(item.path) ? "active" : ""}`}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  navigate(item.path);
                }
              }}
            >
              <i className={`fa ${item.icon}`}></i>
              <span>{item.name}</span>
            </div>
          </li>
        ))}
      </ul>

      <style>{`
        .sidebar-container {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
          position: sticky;
          top: 80px;
        }

        .sidebar-title {
          font-weight: 600;
          margin-bottom: 20px;
          color: #333;
        }

        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 8px;
          color: #555;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.25s ease;
          margin-bottom: 6px;
        }

        .sidebar-item i {
          font-size: 16px;
          color: #888;
          transition: 0.2s;
        }

        .sidebar-item:hover {
          background: #f4f6f9;
          transform: translateX(4px);
        }

        .sidebar-item:hover i {
          color: #0d6efd;
        }

        .sidebar-item.active {
          background: rgba(13,110,253,0.1);
          color: #0d6efd;
          font-weight: 500;
          border-left: 4px solid #0d6efd;
        }

        .sidebar-item.active i {
          color: #0d6efd;
        }
      `}</style>
    </div>
  );
}