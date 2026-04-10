import { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

function JobListSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    API.get("/jobs")
      .then((res) => {
        setJobs(res.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // ✅ APPLY JOB
  const applyJob = async (jobId, applied) => {
    if (applied) return;

    try {
      const res = await API.post("/apply-job", {
        job_id: jobId,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
      });

      // 🔥 refresh jobs to update applied status
      fetchJobs();

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">

        <h1 className="text-center mb-5">Job Listing</h1>

        {loading && <p className="text-center">Loading...</p>}

        {!loading && jobs.length === 0 && (
          <p className="text-center">No jobs found</p>
        )}

        {!loading &&
          jobs.map((job) => (
            <div className="job-item p-4 mb-4 shadow-sm rounded" key={job.id}>
              <div className="row g-4">

                {/* LEFT */}
                <div className="col-md-8 d-flex align-items-center">
                  <img
                    className="img-fluid border rounded"
                    src={
                      job.logo
                        ? `https://server.budes.online/storage/${job.logo}`
                        : "/assets/img/default.png"
                    }
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />

                  <div className="ps-4">
                    <h5>{job.job_title}</h5>

                    <span>{job.location || "N/A"}</span> |{" "}
                    <span>{job.employment_type || "Full Time"}</span> |{" "}
                    <span>{job.salary_range || "Not Disclosed"}</span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="col-md-4 text-end">

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

      </div>
    </div>
  );
}

export default JobListSection;