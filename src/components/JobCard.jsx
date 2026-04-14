import Swal from "sweetalert2";
import API from "../services/api";
import { useState, useEffect } from "react";

function JobCard({ job }) {
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setApplied(job.applied || false);
    setSaved(job.saved || false);
  }, [job]);

  const applyJob = async () => {
    if (loading || applied) return;

    setLoading(true);

    try {
      const res = await API.post("/apply-job", {
        job_id: job.id,
      });

      setApplied(true);
      Swal.fire("Success", res.data.message, "success");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Error", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveJob = async () => {
    try {
      if (saved) {
        await API.post("/unsave-job", { job_id: job.id });
        setSaved(false);
      } else {
        await API.post("/save-job", { job_id: job.id });
        setSaved(true);
      }
    } catch {
      Swal.fire("Error", "Action failed", "error");
    }
  };

  const getDaysAgo = (date) => {
    const diffDays = Math.floor(
      (new Date() - new Date(date)) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  return (
    <div className="p-3 mb-3 border rounded shadow-sm">
      <div className="d-flex justify-content-between">
        {/* LEFT */}
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
              <i className="fa fa-briefcase"></i> {job.experience} Years | ₹{" "}
              {job.salary_range} | <i className="fa fa-map-marker"></i>{" "}
              {job.location}
            </div>

            <div className="text-muted small">
              {job.job_description?.slice(0, 120)}...
            </div>

            <div className="text-muted small">
              <i className="fa fa-clock-o"></i> {getDaysAgo(job.created_at)}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="text-end">
          {/* SAVE ICON */}
          <button
            className="btn border-0 bg-transparent"
            onClick={() => toggleSaveJob(job)}
          >
            <i
              className={`fa ${
                job.saved ? "fa-bookmark text-primary" : "fa-bookmark-o"
              }`}
            ></i>
            <small>{job.saved ? " Saved" : " Save"}</small>
          </button>

          <br />

          <button
            className={`btn mt-2 ${applied ? "btn-success" : "btn-primary"}`}
            onClick={applyJob}
            disabled={applied}
          >
            {applied ? "Applied" : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}


export default JobCard;
