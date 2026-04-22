import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RecruiterSidebar from "../../components/RecruiterSidebar";

export default function ClosedJobs() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  // ✅ FETCH
  const fetchJobs = () => {
    API.get("/closed-jobs", {
      params: { page, search },
    })
      .then((res) => {
        const data = res.data.data;
        setJobs(data.data || []);
        setLastPage(data.last_page || 1);
      })
      .catch(() => setJobs([]));
  };

  useEffect(() => {
    fetchJobs();
  }, [page, search]);

  // ✅ PAGINATION
  const renderPagination = () => {
    if (lastPage <= 1) return null;

    let pages = [];

    pages.push(
      <button
        key="prev"
        className="btn btn-light border"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </button>
    );

    for (let i = 1; i <= lastPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn ${page === i ? "btn-dark" : "btn-light border"}`}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        className="btn btn-light border"
        disabled={page === lastPage}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    );

    return pages;
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-4 mb-5">
        <div className="row">

          {/* SIDEBAR */}
          <div className="col-md-3 col-lg-2">
            <RecruiterSidebar />
          </div>

          {/* MAIN */}
          <div className="col-md-9 col-lg-10">
            <div className="container">

              <h3 className="mb-3">Closed Jobs</h3>

              {/* SEARCH */}
              <input
                className="form-control mb-3"
                placeholder="Search job title or location..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />

              {/* TABLE */}
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Location</th>
                      <th>Salary</th>
                      <th>Openings</th>
                      <th>Closed Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {jobs.length > 0 ? (
                      jobs.map((job, i) => (
                        <tr key={job.id}>
                          <td>{(page - 1) * 5 + i + 1}</td>

                          <td>{job.job_title}</td>
                          <td>{job.location}</td>
                          <td>{job.salary_range || "-"}</td>
                          <td>{job.openings || "-"}</td>

                          {/* ✅ FIXED DATE */}
                          <td>
                            {job.closed_at
                              ? new Date(job.closed_at).toLocaleDateString()
                              : job.closed_date
                              ? job.closed_date
                              : "-"}
                          </td>

                          <td>
                            <span className="badge bg-danger">
                              Closed
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No closed jobs found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              {lastPage > 1 && (
                <div className="d-flex justify-content-center mt-4 gap-2 flex-wrap">
                  {renderPagination()}
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