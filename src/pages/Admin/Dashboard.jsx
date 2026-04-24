import { useEffect, useState } from "react";
import API from "../../services/api";
import { FaUsers, FaBriefcase, FaFileAlt } from "react-icons/fa";
import AdminLayout from "./Layout";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
  });

  useEffect(() => {
    API.get("/admin/dashboard").then((res) => {
      setStats(res.data.data);
    });
  }, []);

  return (
    <div className="container mt-4">

      <h3 className="mb-4 fw-bold">Admin Dashboard</h3>

      <div className="row g-4">

        {/* USERS */}
        <div className="col-md-4">
          <div className="card shadow p-4 text-center">
            <FaUsers size={30} className="text-primary mb-2" />
            <h5>Total Users</h5>
            <h3>{stats.users}</h3>
          </div>
        </div>

        {/* JOBS */}
        <div className="col-md-4">
          <div className="card shadow p-4 text-center">
            <FaBriefcase size={30} className="text-success mb-2" />
            <h5>Total Jobs</h5>
            <h3>{stats.jobs}</h3>
          </div>
        </div>

        {/* APPLICATIONS */}
        <div className="col-md-4">
          <div className="card shadow p-4 text-center">
            <FaFileAlt size={30} className="text-warning mb-2" />
            <h5>Applications</h5>
            <h3>{stats.applications}</h3>
          </div>
        </div>

      </div>

    </div>
  );
}