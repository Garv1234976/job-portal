import { useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";

function JobListSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Search states
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  // 📄 Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = () => {
    setLoading(true);

    API.get(`/jobs?page=${page}&search=${search}&location=${location}`)
      .then((res) => {
        setJobs(res.data.data.data || []);
        setLastPage(res.data.data.last_page || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const applyJob = async (jobId, applied) => {
    if (applied) return;

    try {
      const res = await API.post("/apply-job", { job_id: jobId });

      Swal.fire("Success", res.data.message, "success");

      fetchJobs();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error",
      );
    }
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">
        {/* 🔥 TITLE */}
        <h1 className="text-center mb-4 fw-bold">Find Your Dream Job</h1>

        {/* 🔍 SEARCH BAR */}
        <div className="row g-3 mb-5 justify-content-center">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search job title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <button
              className="btn btn-primary w-100"
              onClick={() => {
                setPage(1);
                fetchJobs();
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* 🔄 LOADING */}
        {loading && <p className="text-center">Loading jobs...</p>}

        {/* ❌ EMPTY */}
        {!loading && jobs.length === 0 && (
          <p className="text-center text-muted">No jobs found</p>
        )}

        {/* 💼 JOB LIST */}
        {!loading &&
          jobs.map((job) => (
            <div
              className="job-item p-4 mb-4 shadow-sm rounded bg-white"
              key={job.id}
            >
              <div className="row align-items-center">
                {/* LEFT */}
                <div className="col-md-8 d-flex align-items-center">
                  <img
                    src={
                      job.logo
                        ? `https://server.budes.online/storage/${job.logo}`
                        : "/assets/img/default.png"
                    }
                    alt="logo"
                    className="rounded border"
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="ms-3">
                    <h5 className="mb-1">{job.job_title}</h5>

                    <div className="text-muted small">
                      📍 {job.location || "N/A"} &nbsp;|&nbsp; 💼{" "}
                      {job.employment_type || "Full Time"} &nbsp;|&nbsp; 💰{" "}
                      {job.salary_range || "Not Disclosed"}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  <button
                    className={`btn ${
                      job.applied ? "btn-success" : "btn-primary"
                    } px-4`}
                    disabled={job.applied}
                    onClick={() => applyJob(job.id, job.applied)}
                  >
                    {job.applied ? "Applied" : "Apply Now"}
                  </button>
                </div>
              </div>
            </div>
          ))}

        {/* 📄 PAGINATION */}
        {!loading && lastPage > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-outline-primary me-2"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            <span className="align-self-center">
              Page {page} of {lastPage}
            </span>

            <button
              className="btn btn-outline-primary ms-2"
              disabled={page === lastPage}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobListSection;
