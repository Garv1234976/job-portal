import Swal from "sweetalert2";
import API from "../services/api";
import { useState, useEffect } from "react";

function JobCard({ job }) {
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

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
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveJob = async () => {
    if (saving) return;

    setSaving(true);

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
    } finally {
      setSaving(false);
    }
  };

  const getDaysAgo = (date) => {
    const diff = Math.floor(
      (new Date() - new Date(date)) / (1000 * 60 * 60 * 24)
    );

    if (diff === 0) return "Today";
    if (diff === 1) return "1 day ago";
    return `${diff} days ago`;
  };

  return (
    <div className="p-3 mb-3 border rounded shadow-sm bg-white job-card">
      <div className="d-flex justify-content-between align-items-start">

        {/* LEFT */}
        <div className="d-flex">
          <img
            src={
              job.logo
                ? `https://server.budes.online/public/storage/${job.logo}`
                : "/assets/img/default.png"
            }
            alt="logo"
            style={{ width: 60, height: 60, objectFit: "cover" }}
            className="rounded border"
          />

          <div className="ms-3">

            {/* TITLE */}
            <h5 className="fw-bold mb-1">{job.job_title}</h5>

            {/* META */}
            <div className="text-muted small mb-1">
              <i className="fa-solid fa-briefcase me-1"></i>
              {job.experience} Years

              <span className="mx-2">|</span>

              ₹ {job.salary_range}

              <span className="mx-2">|</span>

              <i className="fa-solid fa-location-dot me-1"></i>
              {job.location}
            </div>

            {/* DESC */}
            <div className="text-muted small mb-1">
              {job.job_description?.slice(0, 120)}...
            </div>

            {/* DATE */}
            <div className="text-muted small">
              <i className="fa-regular fa-clock me-1"></i>
              {getDaysAgo(job.created_at)}
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="text-end">

          {/* SAVE BUTTON */}
          <button
            className="btn btn-sm btn-light border mb-2"
            onClick={toggleSaveJob}
          >
            <i
              className={`fa ${
                saved ? "fa-solid fa-bookmark text-primary" : "fa-regular fa-bookmark"
              } me-1`}
            ></i>
            {saving ? "Saving..." : saved ? "Saved" : "Save"}
          </button>

          <br />

          {/* APPLY BUTTON */}
          <button
            className={`btn btn-sm ${
              applied ? "btn-success" : "btn-primary"
            }`}
            onClick={applyJob}
            disabled={applied || loading}
          >
            {loading ? "Applying..." : applied ? "Applied" : "Apply"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default JobCard;