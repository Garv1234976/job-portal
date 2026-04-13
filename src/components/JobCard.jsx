import Swal from "sweetalert2";
import API from "../services/api";
import React, { useState, useEffect } from "react";

function JobCard({ job }) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setApplied(job.applied || false);
    setSaved(job.saved || false);
  }, [job]);

  // ✅ APPLY JOB
  const applyJob = async () => {
    if (loading || applied) return;

    if (!job?.id) {
      Swal.fire("Error", "Invalid Job ID", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/apply-job", {
        job_id: job.id,
      });

      setApplied(true);

      Swal.fire("Success", res.data.message || "Applied successfully", "success");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAVE / UNSAVE
  const toggleSave = async () => {
    try {
      if (saved) {
        await API.post("/unsave-job", { job_id: job.id });
        setSaved(false);
      } else {
        await API.post("/save-job", { job_id: job.id });
        setSaved(true);
      }
    } catch {
      Swal.fire("Error", "Unable to save job", "error");
    }
  };

  return (
    <div className="job-item p-4 mb-4 border rounded shadow-sm hover-shadow">
      <div className="row g-4">

        {/* LEFT */}
        <div className="col-sm-12 col-md-8 d-flex align-items-center">
          <img
            className="flex-shrink-0 img-fluid border rounded"
            src={
              job.logo
                ? `https://server.budes.online/public/storage/${job.logo}`
                : "/assets/img/default.png"
            }
            alt="Company Logo"
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />

          <div className="text-start ps-4">
            <h5 className="mb-2">{job.job_title}</h5>

            <div className="text-muted small">

              <span className="me-3">
                <i className="fa fa-map-marker-alt text-primary me-2"></i>
                {job.location || "N/A"}
              </span>

              <span className="me-3">
                <i className="fa fa-briefcase text-primary me-2"></i>
                {job.employment_type || "Full Time"}
              </span>

              <span>
                ₹ {job.salary_range || "Not Disclosed"}
              </span>

            </div>

            <div className="text-muted small mt-1">
              <i className="fa fa-clock text-primary me-2"></i>
              {job.experience || "0-2 Years"}
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">

          <div className="d-flex mb-3">

            {/* ❤️ SAVE ICON */}
            <button
              className="btn btn-light btn-square me-2"
              onClick={toggleSave}
            >
              <i
                className={`fa ${
                  saved ? "fa-heart text-danger" : "fa-heart-o"
                }`}
              ></i>
            </button>

            {/* APPLY BUTTON */}
            <button
              className={`btn ${
                applied ? "btn-success" : "btn-primary"
              }`}
              onClick={applyJob}
              disabled={loading || applied}
            >
              {loading ? "Applying..." : applied ? "Applied" : "Apply Now"}
            </button>
          </div>

          <small className="text-muted">
            <i className="fa fa-calendar text-primary me-2"></i>
            Deadline:{" "}
            {job.apply_deadline
              ? new Date(job.apply_deadline).toLocaleDateString()
              : "N/A"}
          </small>

        </div>

      </div>
    </div>
  );
}

export default JobCard;