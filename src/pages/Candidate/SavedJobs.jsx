import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import CandidateSidebar from "../../components/candidate/CandidateSidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const perPage = 5;
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const res = await api.get("/saved-jobs", {
        params: { search, page, per_page: perPage },
      });

      setJobs(res.data.data || []);
      setTotalPages(res.data.last_page || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    }
  };

  //  UPDATED REMOVE FUNCTION WITH SWEETALERT
  const handleRemove = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this saved job",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.post("/unsave-job", { job_id: id });

      Swal.fire("Removed!", "Job removed successfully", "success");

      fetchJobs();
    } catch (err) {
      Swal.fire("Error", "Failed to remove job", "error");
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

              <h4 className="mb-3">Saved Jobs ({total})</h4>

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
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {jobs.length > 0 ? (
                      jobs.map((job, i) => (
                        <tr
                          key={job.id}
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/job/${job.id}`)}
                        >
                          <td>{(page - 1) * perPage + i + 1}</td>

                          <td>{job.job_title}</td>

                          <td>{job.company_name || "N/A"}</td>

                          <td>{job.location}</td>

                          <td>₹ {job.salary_range || "N/A"}</td>

                          <td>
                            {new Date(job.created_at).toLocaleDateString()}
                          </td>

                          {/* ACTION */}
                          <td>
                            <div className="d-flex gap-2">

                              {/* VIEW */}
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/job/${job.id}`);
                                }}
                              >
                                View
                              </button>

                              {/* REMOVE (UPDATED) */}
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemove(job.id);
                                }}
                              >
                                Remove
                              </button>

                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No saved jobs
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">

                  <div>
                    Showing page <strong>{page}</strong> of{" "}
                    <strong>{totalPages}</strong>
                  </div>

                  <div className="d-flex gap-2">

                    <button
                      className="btn btn-sm btn-outline-primary"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        className={`btn btn-sm ${
                          page === i + 1
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      className="btn btn-sm btn-outline-primary"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </button>

                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}