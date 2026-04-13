import { useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";

function JobCard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

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

        {/* SEARCH */}
        <div className="row mb-4">
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
                    className="rounded"
                  />

                  <div className="ms-3">
                    <h5>{job.job_title}</h5>

                    <div className="text-muted small">
                      <i className="fa fa-briefcase"></i> {job.experience} Years |{" "}
                      ₹ {job.salary_range} Lakhs |{" "}
                      <i className="fa fa-map-marker"></i> {job.location}
                    </div>

                    <div className="text-muted small">
                      <i className="fa fa-file-text"></i>{" "}
                      {job.job_description?.slice(0, 150)}...
                    </div>

                    <div className="text-muted small">
                      <i className="fa fa-clock-o"></i>{" "}
                      {getDaysAgo(job.created_at)}
                    </div>
                  </div>
                </div>

                <div className="text-end">

                  {/* SAVE */}
                  <button
                    className="btn border-0 bg-transparent"
                    onClick={() => toggleSaveJob(job)}
                  >
                    <i
                      className={`fa ${
                        job.saved
                          ? "fa-bookmark text-primary"
                          : "fa-bookmark-o"
                      }`}
                    ></i>
                    <small>{job.saved ? " Saved" : " Save"}</small>
                  </button>

                  <br />

                  {/* APPLY */}
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
        {!loading && lastPage > 1 && (
          <div className="text-center mt-3">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
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
  );
}

export default JobCard;