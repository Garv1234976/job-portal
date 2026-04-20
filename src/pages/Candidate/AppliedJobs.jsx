import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

import CandidateSidebar from "../../components/candidate/CandidateSidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AppliedJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const perPage = 5;
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const res = await api.get("/applied-jobs", {
        params: { search, page, per_page: perPage },
      });

      setJobs(res.data.data || []);
      setTotalPages(res.data.last_page || 1);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  useEffect(() => {
    const delay = setTimeout(fetchJobs, 400);
    return () => clearTimeout(delay);
  }, [search]);

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-4 mb-5">
        <div className="row">

          {/* SIDEBAR */}
          <div className="col-md-3 col-lg-2">
            <CandidateSidebar />
          </div>

          {/* MAIN */}
          <div className="col-md-9 col-lg-10">
            <div className="bg-white p-4 shadow rounded">

              <h4 className="mb-3">Applied Jobs</h4>

              {/* SEARCH */}
              <input
                className="form-control w-50 mb-3"
                placeholder="Search job..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />

              {/* TABLE */}
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Location</th>
                      <th>Salary</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {jobs.length > 0 ? (
                      jobs.map((item, i) => (
                        <tr
                          key={item.id}
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/job/${item.job?.id}`)}
                        >
                          <td>{(page - 1) * perPage + i + 1}</td>

                          <td>{item.job?.job_title}</td>

                          <td>{item.job?.company_name || "N/A"}</td>

                          <td>{item.job?.location}</td>

                          <td>₹ {item.job?.salary_range || "N/A"}</td>

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

                          {/* ACTION BUTTON */}
                          <td>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={(e) => {
                                e.stopPropagation(); // prevent row click conflict
                                navigate(`/job/${item.job?.id}`);
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="d-flex justify-content-end gap-2 align-items-center">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="btn btn-sm btn-outline-primary"
                >
                  Prev
                </button>

                <span>
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="btn btn-sm btn-outline-primary"
                >
                  Next
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}