import React, { useState, useEffect } from "react";
import api from "../../services/api";

import CandidateSidebar from "../../components/candidate/CandidateSidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [totalApplied, setTotalApplied] = useState(0);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [savedJobs, setSavedJobs] = useState([]);
  const [totalSaved, setTotalSaved] = useState(0);

  // 🔥 FETCH APPLIED
  const fetchAppliedJobs = async () => {
    try {
      const res = await api.get("/applied-jobs", {
        params: {
          search,
          page,
          per_page: perPage,
        },
      });

      setAppliedJobs(res.data.data || []);
      setTotalPages(res.data.last_page || 1);
      setTotalApplied(res.data.total || 0);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 FETCH SAVED
  const fetchSavedJobs = async () => {
    try {
      const res = await api.get("/saved-jobs", {
        params: {
          search,
          page,
          per_page: perPage,
        },
      });

      setSavedJobs(res.data.data || []);
      setTotalPages(res.data.last_page || 1);
      setTotalSaved(res.data.total || 0);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 UNSAVE
  const handleUnsave = async (jobId) => {
    try {
      await api.post("/unsave-job", { job_id: jobId });
      fetchSavedJobs();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ TAB CHANGE (KEEPED)
  useEffect(() => {
    if (activeTab === "applied" || activeTab === "dashboard") {
      fetchAppliedJobs();
    }
  }, [activeTab]);

  // ✅ SEARCH APPLIED (KEEPED BUT SAFE)
  useEffect(() => {
    if (activeTab === "applied") {
      const delay = setTimeout(() => {
        fetchAppliedJobs();
      }, 400);

      return () => clearTimeout(delay);
    }
  }, [search, page]);

  // ✅ YOUR EXISTING EFFECT (IMPROVED CONTROL)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (activeTab === "applied" || activeTab === "dashboard") {
        fetchAppliedJobs();
      }

      if (activeTab === "saved" || activeTab === "dashboard") {
        fetchSavedJobs();
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [activeTab, search, page]);

  // ✅ EXTRA CONTROL (FIXED DUPLICATE CALL ISSUE)
  useEffect(() => {
    if (activeTab === "saved") {
      const delay = setTimeout(() => {
        fetchSavedJobs();
      }, 400);

      return () => clearTimeout(delay);
    }
  }, [search, page]);

  // ✅ CONTENT
  const renderContent = () => {
    switch (activeTab) {

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

      case "applied":
        return (
          <>
            <h5 className="mb-3">Applied Jobs</h5>

            <div className="mb-3 d-flex justify-content-between">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search job..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {appliedJobs.length > 0 ? (
                    appliedJobs.map((item, index) => (
                      <tr key={item.id}>
                        <td>{(page - 1) * perPage + index + 1}</td>
                        <td>{item.job?.job_title}</td>
                        <td>{item.job?.company_name || "N/A"}</td>
                        <td>{item.job?.location}</td>

                        <td>
                          <span className={`badge ${
                            item.status === "pending"
                              ? "bg-warning text-dark"
                              : item.status === "applied"
                              ? "bg-success"
                              : "bg-danger"
                          }`}>
                            {item.status}
                          </span>
                        </td>

                        <td>
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        );

      case "saved":
        return (
          <>
            <h5 className="mb-3">Saved Jobs</h5>

            <div className="mb-3 d-flex justify-content-between">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search job..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {savedJobs.map((item, i) => (
                    <tr key={item.id}>
                      <td>{i + 1}</td>
                      <td>{item.job?.job_title}</td>
                      <td>{item.job?.company_name}</td>

                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleUnsave(item.job?.id)}
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
        return null;
    }
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-4 mb-5">
        <div className="row">
          <div className="col-md-3 col-lg-2 mb-3">
            <CandidateSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          <div className="col-md-9 col-lg-10">
            <div className="bg-white shadow-lg rounded p-4 min-h-[500px]">
              <div className="mb-4">
                <h3 className="fw-bold">Candidate Dashboard</h3>
                <p className="text-muted">
                  Manage your jobs, profile and resume
                </p>
              </div>

              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}