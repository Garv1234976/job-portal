import React, { useEffect, useState } from "react";
import api from "../../services/api";

import CandidateSidebar from "../../components/candidate/CandidateSidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function LastViewed() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const perPage = 5;

  // 🔥 FETCH LAST VIEWED
  const fetchJobs = async () => {
    try {
      const res = await api.get("/last-viewed-jobs", {
        params: { search, page, per_page: perPage },
      });

      setJobs(res.data.data || []);
      setTotalPages(res.data.last_page || 1);
      setTotal(res.data.total || 0);
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

              <h4 className="mb-3">Last Viewed Jobs ({total})</h4>

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
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Location</th>
                      <th>Salary</th>
                      <th>Viewed At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {jobs.length > 0 ? (
                      jobs.map((job, i) => (
                        <tr key={job.id}>
                          <td>{(page - 1) * perPage + i + 1}</td>
                          <td>{job.job_title}</td>
                          <td>{job.company_name || "N/A"}</td>
                          <td>{job.location}</td>
                          <td>₹ {job.salary_range || "N/A"}</td>
                          <td>
                            {new Date(job.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No recently viewed jobs
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
                    Page <strong>{page}</strong> of{" "}
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