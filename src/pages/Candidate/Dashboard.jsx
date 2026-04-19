import React, { useState, useEffect } from "react";
import api from "../../services/api";

import CandidateSidebar from "../../components/candidate/CandidateSidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [totalApplied, setTotalApplied] = useState(0);

  const [savedJobs, setSavedJobs] = useState([]);
  const [totalSaved, setTotalSaved] = useState(0);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // 🔥 FETCH APPLIED JOBS
  const fetchAppliedJobs = async () => {
    try {
      const res = await api.get("/applied-jobs", {
        params: { search, page, per_page: perPage },
      });

      setAppliedJobs(res.data.data || []);
      setTotalPages(res.data.last_page || 1);
      setTotalApplied(res.data.total || 0);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 FETCH SAVED JOBS
  const fetchSavedJobs = async () => {
    try {
      const res = await api.get("/saved-jobs", {
        params: { search, page, per_page: perPage },
      });

      setSavedJobs(res.data.data || []);
      setTotalPages(res.data.last_page || 1);
      setTotalSaved(res.data.total || 0);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 LOAD DATA (IMPORTANT FIX)
  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchAppliedJobs();
      fetchSavedJobs(); // ✅ FIXED
    }

    if (activeTab === "applied") {
      fetchAppliedJobs();
    }

    if (activeTab === "saved") {
      fetchSavedJobs();
    }
  }, [activeTab]);

  // 🔍 SEARCH + PAGINATION
  useEffect(() => {
    const delay = setTimeout(() => {
      if (activeTab === "applied") fetchAppliedJobs();
      if (activeTab === "saved") fetchSavedJobs();
    }, 400);

    return () => clearTimeout(delay);
  }, [search, page]);

  // ❌ REMOVE SAVED JOB
  const handleUnsave = async (jobId) => {
    try {
      await api.post("/unsave-job", { job_id: jobId });

      fetchSavedJobs(); // refresh list
      fetchSavedJobs(); // refresh count
    } catch (err) {
      console.error(err);
    }
  };

  // UI CONTENT
  const renderContent = () => {
    switch (activeTab) {

      // 🔥 DASHBOARD
      case "dashboard":
        return (
          <div className="row g-4">

            <div className="col-md-4">
              <div
                className="card dashboard-box p-4 text-center"
                onClick={() => setActiveTab("applied")}
              >
                <h5>Applied Jobs</h5>
                <h2 className="text-primary">{totalApplied}</h2>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card dashboard-box p-4 text-center"
                onClick={() => setActiveTab("saved")}
              >
                <h5>Saved Jobs</h5>
                <h2 className="text-success">{totalSaved}</h2>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card dashboard-box p-4 text-center"
                onClick={() => setActiveTab("profile")}
              >
                <h5>Profile</h5>
                <p className="text-muted">Complete your profile</p>
              </div>
            </div>

          </div>
        );

      // ✅ APPLIED
      case "applied":
        return (
          <>
            <h5 className="mb-3">Applied Jobs</h5>

            <input
              type="text"
              className="form-control w-50 mb-3"
              placeholder="Search job..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {appliedJobs.map((item, i) => (
                    <tr key={item.id}>
                      <td>{i + 1}</td>
                      <td>{item.job?.job_title}</td>
                      <td>{item.job?.company_name}</td>
                      <td>{item.job?.location}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      // ✅ SAVED
      case "saved":
        return (
          <>
            <h5 className="mb-3">Saved Jobs</h5>

            <input
              type="text"
              className="form-control w-50 mb-3"
              placeholder="Search job..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {savedJobs.map((item, i) => (
                    <tr key={item.id}>
                      <td>{i + 1}</td>
                      <td>{item.job_title}</td>
                      <td>{item.company_name}</td>
                      <td>{item.location}</td>

                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleUnsave(item.id)} // ✅ FIXED
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      default:
        return <div>No data</div>;
    }
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-4 mb-5">
        <div className="row">

          <div className="col-md-3">
            <CandidateSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          <div className="col-md-9">
            <div className="bg-white p-4 rounded shadow">
              {renderContent()}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}