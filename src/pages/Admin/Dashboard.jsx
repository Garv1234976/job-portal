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

//  CHART
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

  //  CHART DATA
  const chartData = [
    { name: "Users", value: stats.users },
    { name: "Jobs", value: stats.jobs },
    { name: "Applications", value: stats.applications },
  ];

  return (
    <AdminLayout>

      <div className="container-fluid mt-3">

        <h3 className="mb-4 fw-bold">Admin Dashboard</h3>

        {/* CARDS */}
        <div className="row g-4 mb-4">

          {/* USERS */}
          <div className="col-md-4">
            <div
              className="dashboard-card clickable"
              onClick={() => navigate("/admin/users")}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Total Users</p>
                  <h2 className="fw-bold">{stats.users}</h2>
                </div>
                <div className="icon-box bg-primary">
                  <FaUsers />
                </div>
              </div>
            </div>
          </div>

          {/* JOBS */}
          <div className="col-md-4">
            <div
              className="dashboard-card clickable"
              onClick={() => navigate("/admin/jobs")}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Total Jobs</p>
                  <h2 className="fw-bold">{stats.jobs}</h2>
                </div>
                <div className="icon-box bg-success">
                  <FaBriefcase />
                </div>
              </div>
            </div>
          </div>

          {/* APPLICATIONS */}
          <div className="col-md-4">
            <div
              className="dashboard-card clickable"
              onClick={() => navigate("/admin/applications")}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Applications</p>
                  <h2 className="fw-bold">{stats.applications}</h2>
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

          <ResponsiveContainer width="100%" height={300}>
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

    </AdminLayout>
  );
}