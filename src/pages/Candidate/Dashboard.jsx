import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

import CandidateSidebar from "../../components/candidate/CandidateSidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CandidateDashboard() {

  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const [totalApplied, setTotalApplied] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // 🔥 FETCH APPLIED
  const fetchAppliedJobs = async () => {
    try {
      const res = await api.get("/applied-jobs", {
        params: { search, page, per_page: perPage },
      });

      setAppliedJobs(res.data.data || []);
      setTotalApplied(res.data.total || 0);
      setTotalPages(res.data.last_page || 1);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 FETCH SAVED
  const fetchSavedJobs = async () => {
    try {
      const res = await api.get("/saved-jobs", {
        params: { search, page, per_page: perPage },
      });

      setSavedJobs(res.data.data || []);
      setTotalSaved(res.data.total || 0);
      setTotalPages(res.data.last_page || 1);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 LOAD DATA
  useEffect(() => {
    if (currentPath === "/candidate/dashboard") {
      fetchAppliedJobs();
      fetchSavedJobs();
    }

    if (currentPath.includes("applied")) fetchAppliedJobs();
    if (currentPath.includes("saved")) fetchSavedJobs();

  }, [currentPath]);

  // 🔍 SEARCH + PAGINATION
  useEffect(() => {
    const delay = setTimeout(() => {
      if (currentPath.includes("applied")) fetchAppliedJobs();
      if (currentPath.includes("saved")) fetchSavedJobs();
    }, 400);

    return () => clearTimeout(delay);
  }, [search, page]);

  // ❌ UNSAVE
  const handleUnsave = async (jobId) => {
    try {
      await api.post("/unsave-job", { job_id: jobId });
      fetchSavedJobs();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 CONTENT
  const renderContent = () => {

    // DASHBOARD
    if (currentPath === "/candidate/dashboard") {
      return (
        <div className="row g-4">

          <div className="col-md-4">
            <div
              className="card dashboard-box p-4 text-center"
              onClick={() => navigate("/candidate/applied")}
              style={{ cursor: "pointer" }}
            >
              <h5>Applied Jobs</h5>
              <h2 className="text-primary">{totalApplied}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card dashboard-box p-4 text-center"
              onClick={() => navigate("/candidate/saved")}
              style={{ cursor: "pointer" }}
            >
              <h5>Saved Jobs</h5>
              <h2 className="text-success">{totalSaved}</h2>
            </div>
          </div>

        </div>
      );
    }

    // ✅ APPLIED JOBS (FULL TABLE)
    if (currentPath.includes("applied")) {
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
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Salary</th>
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
                      <td>₹ {item.job?.salary_range || "N/A"}</td>
                      <td>{item.status}</td>
                      <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            <span>Page {page} of {totalPages}</span>

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
    }

    // ✅ SAVED JOBS (FULL TABLE)
    if (currentPath.includes("saved")) {
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
                      <td>{item.job_title}</td>
                      <td>{item.company_name || "N/A"}</td>
                      <td>{item.location}</td>
                      <td>₹ {item.salary_range || "N/A"}</td>
                      <td>{new Date(item.created_at).toLocaleDateString()}</td>

                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleUnsave(item.id)}
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
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            <span>Page {page} of {totalPages}</span>

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
    }

    return null;
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-4 mb-5">
        <div className="row">

          <div className="col-md-3 col-lg-2">
            <CandidateSidebar />
          </div>

          <div className="col-md-9 col-lg-10">
            <div className="bg-white shadow-lg rounded p-4">

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