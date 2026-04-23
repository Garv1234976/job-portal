import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RecruiterSidebar from "../../components/RecruiterSidebar";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const navigate = useNavigate();

  // ✅ FETCH JOBS
  const fetchJobs = () => {
    API.get("/my-jobs", {
      params: { page, search, location, salary }
    })
      .then((res) => {
        setJobs(res.data.data.data || []);
        setLastPage(res.data.data.last_page || 1);
      })
      .catch(() => setJobs([]));
  };

  useEffect(() => {
    fetchJobs();
  }, [page, search, location, salary]);

  // ✅ VIEW JOB
  const handleView = (id) => {
    window.open(`https://budes.online/job/${id}`, "_blank");
  };

  // ✅ EDIT JOB
  const handleEdit = (id) => {
    navigate(`/recruiter/edit-job/${id}`);
  };

  // ✅ VIEW APPLICATIONS (NEW 🔥)
  const handleApplications = (id) => {
    navigate(`/recruiter/job-applications/${id}`);
  };

  // ✅ CLOSE JOB
  const closeJob = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This job will be closed",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, close it",
    });

    if (!result.isConfirmed) return;

    try {
      await API.post(`/close-job/${id}`);
      Swal.fire("Closed!", "Job has been closed.", "success");
      fetchJobs();
    } catch {
      Swal.fire("Error", "Failed", "error");
    }
  };

  // ✅ REOPEN JOB
  const reopenJob = async (id) => {
    try {
      await API.post(`/reopen-job/${id}`);
      Swal.fire("Success", "Job reopened", "success");
      fetchJobs();
    } catch {
      Swal.fire("Error", "Failed", "error");
    }
  };

  // ✅ PAGINATION
  const renderPagination = () => {
    let pages = [];

    let start = Math.max(1, page - 1);
    let end = Math.min(lastPage, page + 1);

    // PREV
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

    // PAGE NUMBERS
    for (let i = start; i <= end; i++) {
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

    // NEXT
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
          <div className="col-md-3 col-lg-2 mb-3">
            <RecruiterSidebar />
          </div>

          {/* MAIN CONTENT */}
          <div className="col-md-9 col-lg-10">
            <div className="container">

              <h2 className="mb-3">My Jobs</h2>

              {/* FILTERS */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <input
                    className="form-control"
                    placeholder="Search job title..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>

                <div className="col-md-4">
                  <input
                    className="form-control"
                    placeholder="Filter by location"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>

                <div className="col-md-4">
                  <input
                    className="form-control"
                    placeholder="Filter by salary"
                    value={salary}
                    onChange={(e) => {
                      setSalary(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              </div>

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
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {jobs.length > 0 ? (
                      jobs.map((job, index) => {
                        const isClosed = job.is_closed;

                        return (
                          <tr key={job.id}>
                            <td>{(page - 1) * 5 + index + 1}</td>

                            <td>{job.job_title}</td>
                            <td>{job.location}</td>
                            <td>{job.salary_range}</td>
                            <td>{job.openings}</td>

                            <td>
                              {isClosed ? (
                                <span className="badge bg-danger">Closed</span>
                              ) : (
                                <span className="badge bg-success">Active</span>
                              )}
                            </td>

                            <td>
                              {new Date(job.created_at).toLocaleDateString()}
                            </td>

                            {/* ACTION BUTTONS */}
                            <td>
                              <button
                                className="btn btn-info btn-sm me-2"
                                onClick={() => handleView(job.id)}
                              >
                                View
                              </button>

                              <button
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => handleEdit(job.id)}
                              >
                                Edit
                              </button>

                              {/* ✅ NEW BUTTON */}
                              <button
                                className="btn btn-dark btn-sm me-2"
                                onClick={() => handleApplications(job.id)}
                              >
                                Applications
                              </button>

                              {!isClosed ? (
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => closeJob(job.id)}
                                >
                                  Close
                                </button>
                              ) : (
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => reopenJob(job.id)}
                                >
                                  Reopen
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No jobs found
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