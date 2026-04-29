import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "../../components/Category.css";

import {
  FaUsers,
  FaBriefcase,
  FaFileAlt
} from "react-icons/fa";

import AdminLayout from "./Layout";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
  });

  useEffect(() => {
    API.get("/admin/dashboard")
      .then((res) => {
        setStats(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const chartData = [
    { name: "Users", value: stats.users },
    { name: "Jobs", value: stats.jobs },
    { name: "Applications", value: stats.applications },
  ];

  return (
    <AdminLayout>
      <div className="container-fluid">

        {/* HEADER */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <h3 className="fw-bold mb-2 mb-md-0">Admin Dashboard</h3>
        </div>

        {/* CARDS */}
        <div className="row g-3 g-md-4 mb-4">

          {/* USERS */}
          <div className="col-12 col-sm-6 col-lg-4">
            <div
              className="dashboard-card clickable"
              onClick={() => navigate("/admin/users")}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Total Users</p>
                  <h2 className="fw-bold mb-0">{stats.users}</h2>
                </div>
                <div className="icon-box bg-primary">
                  <FaUsers />
                </div>
              </div>
            </div>
          </div>

          {/* JOBS */}
          <div className="col-12 col-sm-6 col-lg-4">
            <div
              className="dashboard-card clickable"
              onClick={() => navigate("/admin/jobs")}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Total Jobs</p>
                  <h2 className="fw-bold mb-0">{stats.jobs}</h2>
                </div>
                <div className="icon-box bg-success">
                  <FaBriefcase />
                </div>
              </div>
            </div>
          </div>

          {/* APPLICATIONS */}
          <div className="col-12 col-sm-6 col-lg-4">
            <div
              className="dashboard-card clickable"
              onClick={() => navigate("/admin/applications")}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Applications</p>
                  <h2 className="fw-bold mb-0">{stats.applications}</h2>
                </div>
                <div className="icon-box bg-warning">
                  <FaFileAlt />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* CHART */}
        <div className="dashboard-card">
          <h5 className="mb-3 fw-bold">Overview</h5>

          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* EXTRA STYLES */}
      <style>{`
        .dashboard-card {
          background: #fff;
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
          transition: all 0.25s ease;
        }

        .dashboard-card.clickable:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          cursor: pointer;
        }

        .icon-box {
          width: 55px;
          height: 55px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
        }

        /* MOBILE FIX */
        @media (max-width: 576px) {
          .dashboard-card {
            padding: 14px;
          }

          .icon-box {
            width: 45px;
            height: 45px;
            font-size: 18px;
          }

          h2 {
            font-size: 22px;
          }
        }
      `}</style>
    </AdminLayout>
  );
}