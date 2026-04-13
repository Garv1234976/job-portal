import { useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";

function JobListSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  // Filters
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState(0);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Pagination auto load
  useEffect(() => {
    fetchJobs();
  }, [page]);

  // API
  const fetchJobs = (customPage = page) => {
    setLoading(true);

    API.get(`/jobs`, {
      params: {
        page: customPage,
        search,
        location,
        salary,
        type: jobType,
        experience,
      },
    })
      .then((res) => {
        setJobs(res.data.data.data || []);
        console.log("aaaa", res.data.data);
        setLastPage(res.data.data.last_page || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // APPLY
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

  // DAYS AGO
  const getDaysAgo = (date) => {
    const created = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  // SAVE
  const toggleSaveJob = async (job) => {
    try {
      if (job.saved) {
        await API.post("/unsave-job", { job_id: job.id });
        job.saved = false;
      } else {
        await API.post("/save-job", { job_id: job.id });
        job.saved = true;
      }
      setJobs([...jobs]);
    } catch {
      Swal.fire("Error", "Action failed", "error");
    }
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <h2 className="fw-bold mb-4">Find Jobs</h2>

        <div className="row">
          {/* SIDEBAR */}
          <div className="col-md-3">
            <div className="bg-white p-3 shadow-sm rounded">
              <h5>All Filters</h5>
              <hr />

              {/* Work Mode */}
              <h6>Work Mode</h6>
              <input
                type="radio"
                name="type"
                value="office"
                checked={jobType === "office"}
                onChange={(e) => setJobType(e.target.value)}
              />
              <input
                type="radio"
                name="type"
                value="remote"
                checked={jobType === "remote"}
                onChange={(e) => setJobType(e.target.value)}
              />
              <input
                type="radio"
                name="type"
                value="hybrid"
                checked={jobType === "hybrid"}
                onChange={(e) => setJobType(e.target.value)}
              />

              <hr />

              {/* Experience */}
              <h6>Experience</h6>

              <div className="mb-2 text-muted small">
                Selected: <strong>{experience} Years</strong>
              </div>

              <input
                type="range"
                min="0"
                max="10"
                value={experience}
                className="form-range"
                onChange={(e) => setExperience(e.target.value)}
              />

              <div className="d-flex justify-content-between small">
                <span>0</span>
                <span>10</span>
              </div>

              <div className="small text-muted">
                {experience == 0 ? "Fresher" : `${experience}+ Years`}
              </div>

              <hr />

              {/* Salary */}
              <h6>Salary</h6>
              <input
                type="radio"
                name="salary"
                value="0-3"
                checked={salary === "0-3"}
                onChange={(e) => setSalary(e.target.value)}
              />
              <input
                type="radio"
                name="salary"
                value="3-6"
                checked={salary === "3-6"}
                onChange={(e) => setSalary(e.target.value)}
              />
              <input
                type="radio"
                name="salary"
                value="6-10"
                checked={salary === "6-10"}
                onChange={(e) => setSalary(e.target.value)}
              />

              <hr />

              {/* APPLY FILTER */}
              <button
                className="btn btn-primary w-100 mt-2"
                onClick={() => {
                  setPage(1);
                  fetchJobs(1);
                }}
              >
                Apply Filters
              </button>

              {/* RESET */}
              <button
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={() => {
                  setJobType("");
                  setSalary("");
                  setExperience(0);
                  setSearch("");
                  setLocation("");
                  setPage(1);
                  fetchJobs(1);

                  
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* JOB LIST */}
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
                <button
                  className="btn btn-primary w-100"
                  onClick={() => {
                    setPage(1);
                    fetchJobs(1);
                  }}
                >
                  Search
                </button>
              </div>
            </div>

            {loading && <p>Loading jobs...</p>}

            {!loading && jobs.length === 0 && (
              <p className="text-muted">No jobs found</p>
            )}

            {/* JOB CARDS */}
            {!loading &&
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 mb-3 bg-white shadow-sm rounded border"
                >
                  <div className="d-flex justify-content-between">
                    <div className="d-flex">
                      <img
                        src={
                          job.logo
                            ? `https://server.budes.online/public/storage/${job.logo}`
                            : "/assets/img/default.png"
                        }
                        style={{ width: 60, height: 60 }}
                        className="rounded"
                      />

                      <div className="ms-3">
                        <h5>{job.job_title}</h5>

                        <div className="text-muted small">
                          <i className="fa fa-briefcase"></i>{" "}
                          {job.experience || "0-2 Yrs"} | ₹ {job.salary_range} |
                          <i className="fa fa-map-marker"></i> {job.location}
                        </div>

                        <div className="text-muted small">
                          {job.job_description?.slice(0, 80)}...
                        </div>

                        <div className="text-muted small">{job.key_skills}</div>

                        <div className="text-muted small">
                          <i className="fa fa-clock-o"></i>{" "}
                          {getDaysAgo(job.created_at)}
                        </div>
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        className="btn border-0 bg-transparent"
                        onClick={() => toggleSaveJob(job)}
                      >
                        <i
                          className={`fa ${job.saved ? "fa-bookmark text-primary" : "fa-bookmark-o"}`}
                        ></i>
                        <small>{job.saved ? "Saved" : "Save"}</small>
                      </button>

                      <br />

                      <button
                        className={`btn mt-2 ${job.applied ? "btn-success" : "btn-primary"}`}
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
            {!loading && lastPage > 1 && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobListSection;
