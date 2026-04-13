import { useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";

function JobListSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState(0);
  const [savedFilter, setSavedFilter] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [page]);

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
        saved: savedFilter,
      },
    })
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
      Swal.fire("Error", err.response?.data?.message || "Error", "error");
    }
  };

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

  const getDaysAgo = (date) => {
    const diffDays = Math.floor(
      (new Date() - new Date(date)) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
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

              {/* SAVED FILTER */}
              <h6>Saved Jobs</h6>

              <div>
                <input
                  type="radio"
                  name="saved"
                  value=""
                  checked={savedFilter === ""}
                  onChange={(e) => setSavedFilter(e.target.value)}
                /> All Jobs
              </div>

              <div>
                <input
                  type="radio"
                  name="saved"
                  value="saved"
                  checked={savedFilter === "saved"}
                  onChange={(e) => setSavedFilter(e.target.value)}
                /> Saved Jobs
              </div>

              <div>
                <input
                  type="radio"
                  name="saved"
                  value="unsaved"
                  checked={savedFilter === "unsaved"}
                  onChange={(e) => setSavedFilter(e.target.value)}
                /> Unsaved Jobs
              </div>

              <hr />

              {/* WORK MODE */}
              <h6>Work Mode</h6>

              <div>
                <input type="radio" name="type" value="office"
                  checked={jobType === "office"}
                  onChange={(e) => setJobType(e.target.value)} /> Office
              </div>

              <div>
                <input type="radio" name="type" value="remote"
                  checked={jobType === "remote"}
                  onChange={(e) => setJobType(e.target.value)} /> Remote
              </div>

              <div>
                <input type="radio" name="type" value="hybrid"
                  checked={jobType === "hybrid"}
                  onChange={(e) => setJobType(e.target.value)} /> Hybrid
              </div>

              <hr />

              {/* EXPERIENCE */}
              <h6>Experience</h6>
              <div className="small">Selected: {experience} Years</div>

              <input
                type="range"
                min="0"
                max="10"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="form-range"
              />

              <hr />

              {/* SALARY */}
              <h6>Salary</h6>

              <div>
                <input type="radio" name="salary" value="0-3"
                  checked={salary === "0-3"}
                  onChange={(e) => setSalary(e.target.value)} /> 0-3 Lakhs
              </div>

              <div>
                <input type="radio" name="salary" value="3-6"
                  checked={salary === "3-6"}
                  onChange={(e) => setSalary(e.target.value)} /> 3-6 Lakhs
              </div>

              <div>
                <input type="radio" name="salary" value="6-10"
                  checked={salary === "6-10"}
                  onChange={(e) => setSalary(e.target.value)} /> 6-10 Lakhs
              </div>

              <hr />

              {/* APPLY */}
              <button
                className="btn btn-primary w-100"
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
                  setSavedFilter("");
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
            <div className="row mb-3">
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
                <button className="btn btn-primary w-100"
                  onClick={() => {
                    setPage(1);
                    fetchJobs(1);
                  }}>
                  Search
                </button>
              </div>
            </div>

            {loading && <p>Loading...</p>}

            {!loading && jobs.length === 0 && (
              <p>No jobs found</p>
            )}

            {/* JOB CARDS */}
            {jobs.map((job) => (
              <div key={job.id} className="p-3 mb-3 border rounded shadow-sm">

                <div className="d-flex justify-content-between">

                  <div className="d-flex">
                    <img
                      src={
                        job.logo
                          ? `https://server.budes.online/public/storage/${job.logo}`
                          : "/assets/img/default.png"
                      }
                      style={{ width: 60, height: 60 }}
                    />

                    <div className="ms-3">
                      <h5>{job.job_title}</h5>

                      <div className="small text-muted">
                        ₹ {job.salary_range} | {job.location}
                      </div>

                      <div className="small text-muted">
                        {job.job_description?.slice(0, 60)}...
                      </div>

                      <div className="small text-muted">
                        {getDaysAgo(job.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="text-end">

                    <button
                      className="btn btn-light"
                      onClick={() => toggleSaveJob(job)}
                    >
                      {job.saved ? "Saved" : "Save"}
                    </button>

                    <br />

                    <button
                      className={`btn mt-2 ${
                        job.applied ? "btn-success" : "btn-primary"
                      }`}
                      onClick={() => applyJob(job.id, job.applied)}
                      disabled={job.applied}
                    >
                      {job.applied ? "Applied" : "Apply"}
                    </button>

                  </div>

                </div>
              </div>
            ))}

            {/* PAGINATION */}
            {lastPage > 1 && (
              <div className="text-center mt-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Prev
                </button>

                <span className="mx-2">{page} / {lastPage}</span>

                <button
                  disabled={page === lastPage}
                  onClick={() => setPage(page + 1)}
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