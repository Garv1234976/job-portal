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

  // 🔥 FETCH FUNCTION
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

  // ✅ TAB CHANGE
  useEffect(() => {
    if (activeTab === "applied" || activeTab === "dashboard") {
      fetchAppliedJobs();
    }
  }, [activeTab]);

  // ✅ SEARCH (LIVE WITH DEBOUNCE)
  useEffect(() => {
    if (activeTab === "applied") {
      const delay = setTimeout(() => {
        fetchAppliedJobs();
      }, 400);

      return () => clearTimeout(delay);
    }
  }, [search, page]);

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

  useEffect(() => {
    if (activeTab === "applied" || activeTab === "dashboard") {
      fetchAppliedJobs();
    }

    if (activeTab === "saved") {
      fetchSavedJobs();
    }
  }, [activeTab]);

  // 🔥 SEARCH + PAGINATION
  useEffect(() => {
    const delay = setTimeout(() => {
      if (activeTab === "applied") fetchAppliedJobs();
      if (activeTab === "saved") fetchSavedJobs();
    }, 400);

    return () => clearTimeout(delay);
  }, [search, page]);

  // ✅ CONTENT
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

      // ✅ APPLIED JOBS TABLE
      case "applied":
        return (
          <>
            <h5 className="mb-3">Applied Jobs</h5>

            {/* 🔍 SEARCH */}
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

            {/* 📋 TABLE */}
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
                          <span
                            className={`badge ${
                              item.status === "pending"
                                ? "bg-warning text-dark"
                                : item.status === "applied"
                                  ? "bg-success"
                                  : "bg-danger"
                            }`}
                          >
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

            {/* 📄 PAGINATION */}
            <div className="d-flex justify-content-end mt-3 gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>

              <span className="align-self-center">
                Page {page} of {totalPages}
              </span>

              <button
                className="btn btn-sm btn-outline-primary"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </>
        );

      case "saved":
        return (
          <>
            <h5 className="mb-3">Saved Jobs</h5>

            {/* 🔍 SEARCH */}
            <div className="mb-3 d-flex justify-content-between">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search job, company..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* TABLE */}
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Salary</th>
                    <th>Saved Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {savedJobs.length > 0 ? (
                    savedJobs.map((item, index) => (
                      <tr key={item.id}>
                        <td>{(page - 1) * perPage + index + 1}</td>

                        <td>{item.job?.job_title}</td>
                        <td>{item.job?.company_name || "N/A"}</td>
                        <td>{item.job?.location}</td>
                        <td>₹ {item.job?.salary_range || "N/A"}</td>

                        <td>
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>

                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleUnsave(item.job?.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No saved jobs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="d-flex justify-content-end mt-3 gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>

              <span className="align-self-center">
                Page {page} of {totalPages}
              </span>

              <button
                className="btn btn-sm btn-outline-primary"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </>
        );

      case "lastViewed":
        return <div className="empty-box">No recently viewed jobs.</div>;

      case "profile":
        return (
          <div className="card p-4">
            <h5>Edit Profile</h5>
            <p className="text-muted">Update your profile here.</p>
          </div>
        );

      case "resume":
        return (
          <div className="card p-4">
            <h5>Resume</h5>
            <p className="text-muted">Upload or update your resume.</p>
          </div>
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

      {/* ✅ STYLE */}
      <style>
        {`
          .dashboard-box {
            cursor: pointer;
            border-radius: 12px;
            transition: 0.3s;
            border: 1px solid #eee;
          }

          .dashboard-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }

          .empty-box {
            padding: 40px;
            text-align: center;
            background: #f8fafc;
            border-radius: 10px;
            color: #6b7280;
          }
        `}
      </style>
    </>
  );
}
