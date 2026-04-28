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
        text: "Please upgrade your plan",
      }).then(() => {
        navigate("/recruiter/plans");
      });
    } else {
      navigate("/recruiter/create-job");
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      icon: "warning",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.clear();
        navigate("/login");
      }
    });
  };

  // ✅ UPDATED MENU (added path for Post Job)
  const menu = [
    { name: "Dashboard", icon: "fa-home", path: "/recruiter/dashboard" },
    {
      name: "Post Job",
      icon: "fa-plus-circle",
      path: "/recruiter/create-job",
      action: handlePostJob,
    },
    { name: "My Jobs", icon: "fa-briefcase", path: "/recruiter/jobs" },
    { name: "Closed Jobs", icon: "fa-times-circle", path: "/recruiter/closed-jobs" },
    { name: "Plans", icon: "fa-credit-card", path: "/recruiter/plans" },
  ];

  // ✅ UPDATED ACTIVE CHECK
  const isActive = (path) => {
    if (!path) return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="sidebar-container">

      {/* HEADER */}
      <div className="sidebar-header">
        <h5>Recruiter Panel</h5>
        <p>Manage your jobs</p>
      </div>

      {/* MENU */}
      <div className="sidebar-menu">
        {menu.map((item, i) => (
          <div
            key={i}
            className={`sidebar-item ${
              item.path && isActive(item.path) ? "active" : ""
            }`}
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
        ))}
      </div>

      {/* PLAN CARD */}
      {activePlan && (
        <div className="plan-card">
          <p>Remaining Jobs</p>
          <h4>{activePlan.jobs_remaining}</h4>
        </div>
      )}

      {/* LOGOUT */}
      <div className="logout-btn" onClick={handleLogout}>
        <i className="fa fa-sign-out"></i>
        <span>Logout</span>
      </div>

      <style>{`
        .sidebar-container {
          width: 250px;
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          position: sticky;
          top: 80px;
          height: fit-content;
        }

        .sidebar-header {
          margin-bottom: 25px;
        }

        .sidebar-header h5 {
          font-weight: 600;
          margin: 0;
          color: #222;
        }

        .sidebar-header p {
          font-size: 13px;
          color: #888;
          margin: 4px 0 0;
        }

        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s ease;
          color: #555;
        }

        .sidebar-item i {
          font-size: 15px;
          color: #888;
        }

        .sidebar-item:hover {
          background: #f5f7fb;
          transform: translateX(5px);
        }

        .sidebar-item:hover i {
          color: #0d6efd;
        }

        .sidebar-item.active {
          background: linear-gradient(135deg, #0d6efd, #4f8cff);
          color: #fff;
          box-shadow: 0 5px 15px rgba(13,110,253,0.2);
        }

        .sidebar-item.active i {
          color: #fff;
        }

        .plan-card {
          margin-top: 25px;
          padding: 15px;
          border-radius: 12px;
          background: #f8f9fc;
          text-align: center;
        }

        .plan-card p {
          margin: 0;
          font-size: 13px;
          color: #777;
        }

        .plan-card h4 {
          margin: 5px 0 0;
          color: #0d6efd;
          font-weight: 600;
        }

        .logout-btn {
          margin-top: 20px;
          padding: 12px;
          border-radius: 10px;
          background: #fff0f0;
          color: #dc3545;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: 0.2s;
          font-weight: 500;
        }

        .logout-btn:hover {
          background: #ffe5e5;
        }
      `}</style>
    </div>
  );
}