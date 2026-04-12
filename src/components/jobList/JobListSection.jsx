import { useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";

function JobListSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  // 🔥 FILTERS
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [page, jobType, salary]);

  const fetchJobs = () => {
    setLoading(true);

    API.get(
      `/jobs?page=${page}&search=${search}&location=${location}&type=${jobType}&salary=${salary}`
    )
      .then((res) => {
        setJobs(res.data.data.data || []);
        setLastPage(res.data.data.last_page || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // ✅ APPLY
  const applyJob = async (jobId, applied) => {
    if (applied) return;

    try {
      const res = await API.post("/apply-job", { job_id: jobId });
      Swal.fire("Success", res.data.message, "success");
      fetchJobs();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Error", "error");
    }
  };

  // ❤️ SAVE JOB
  const saveJob = async (jobId) => {
    try {
      await API.post("/save-job", { job_id: jobId });
      Swal.fire("Saved", "Job saved successfully", "success");
    } catch {
      Swal.fire("Error", "Failed to save job", "error");
    }
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">

        <h2 className="mb-4 fw-bold">Find Jobs</h2>

        <div className="row">

          {/* 🔥 SIDEBAR FILTER */}
          <div className="col-md-3">
            <div className="bg-white p-3 shadow-sm rounded">

              <h5>Filters</h5>

              <hr />

              <label>Job Type</label>
              <select
                className="form-control mb-3"
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="">All</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
              </select>

              <label>Salary</label>
              <select
                className="form-control"
                onChange={(e) => setSalary(e.target.value)}
              >
                <option value="">All</option>
                <option value="0-20000">0-20k</option>
                <option value="20000-50000">20k-50k</option>
                <option value="50000+">50k+</option>
              </select>

            </div>
          </div>

          {/* 🔥 JOB LIST */}
          <div className="col-md-9">

            {/* SEARCH */}
            <div className="row g-2 mb-4">
              <div className="col-md-5">
                <input
                  className="form-control"
                  placeholder="Search jobs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-5">
                <input
                  className="form-control"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <button className="btn btn-primary w-100" onClick={fetchJobs}>
                  Search
                </button>
              </div>
            </div>

            {loading && <p>Loading...</p>}

            {!loading &&
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3 mb-3 bg-white shadow-sm rounded"
                >
                  <div className="d-flex justify-content-between">

                    {/* LEFT */}
                    <div className="d-flex">
                      <img
                        src={
                          job.logo
                            ? `https://server.budes.online/storage/${job.logo}`
                            : "/assets/img/default.png"
                        }
                        style={{ width: 60, height: 60 }}
                      />

                      <div className="ms-3">
                        <h6>{job.job_title}</h6>
                        <small className="text-muted">
                          {job.location} | {job.salary_range}
                        </small>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="text-end">

                      <button
                        className="btn btn-light me-2"
                        onClick={() => saveJob(job.id)}
                      >
                        ❤️
                      </button>

                      <button
                        className={`btn ${
                          job.applied ? "btn-success" : "btn-primary"
                        }`}
                        disabled={job.applied}
                        onClick={() => applyJob(job.id, job.applied)}
                      >
                        {job.applied ? "Applied" : "Apply"}
                      </button>

                    </div>
                  </div>
                </div>
              ))}

            {/* PAGINATION */}
            <div className="d-flex justify-content-center mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="btn btn-outline-primary me-2"
              >
                Prev
              </button>

              <span>
                {page} / {lastPage}
              </span>

              <button
                disabled={page === lastPage}
                onClick={() => setPage(page + 1)}
                className="btn btn-outline-primary ms-2"
              >
                Next
              </button>
            </div>

          </div>
        </div>
      </div>
    </div> 
  );
}

export default JobListSection;