import Swal from "sweetalert2";
import API from "../services/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ React Icons
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaBookmark,
  FaRegBookmark
} from "react-icons/fa";

function JobCard({ job }) {
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setApplied(job.applied || false);
    setSaved(job.saved || false);
  }, [job]);

  // ✅ JOB CLOSED LOGIC
  const isJobClosed =
    job.application_count >= job.application_limit;

  // ✅ OPTIONAL ROLE CHECK (adjust if needed)
  const isRecruiter = job.is_recruiter || false;

  // ✅ SAVE / UNSAVE
  const toggleSaveJob = async (e) => {
    e.stopPropagation();

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

  // ✅ DAYS AGO
  const getDaysAgo = (date) => {
    const diff = Math.floor(
      (new Date() - new Date(date)) / (1000 * 60 * 60 * 24)
    );

    if (diff === 0) return "Today";
    if (diff === 1) return "1 day ago";
    return `${diff} days ago`;
  };

  return (
    <div
      className="p-3 mb-3 border rounded shadow-sm bg-white job-card"
      onClick={() => navigate(`/job/${job.id}`)} // ✅ Always allow view
      style={{ cursor: "pointer" }}
    >
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

            {/* ✅ CLOSED BADGE */}
            {isJobClosed && (
              <span className="badge bg-danger mb-1">Closed</span>
            )}

            {/* TITLE */}
            <h5 className="fw-bold mb-1">{job.job_title}</h5>

            {/* META */}
            <div className="text-muted small mb-1 d-flex flex-wrap align-items-center gap-2">
              <span>
                <FaBriefcase className="me-1" /> {job.experience} Years
              </span>
              <span>|</span>
              <span>₹ {job.salary_range}</span>
              <span>|</span>
              <span>
                <FaMapMarkerAlt className="me-1" /> {job.location}
              </span>
            </div>

            {/* DESC */}
            <div className="text-muted small mb-1">
              {job.job_description?.slice(0, 120)}...
            </div>

            {/* DATE */}
            <div className="text-muted small">
              <FaClock className="me-1" />
              {getDaysAgo(job.created_at)}
            </div>

            {/* ✅ TEXT STATUS (NO ALERT) */}
            {isJobClosed && (
              <div className="text-danger small mt-1">
                🚫 Job Closed 
              </div>
            )}

          </div>
        </div>

        {/* RIGHT */}
        <div className="text-end">

          {/* SAVE */}
          <button
            className="btn btn-sm btn-light border mb-2"
            onClick={toggleSaveJob}
          >
            {saved ? (
              <FaBookmark className="me-1 text-primary" />
            ) : (
              <FaRegBookmark className="me-1" />
            )}
            {saving ? "Saving..." : saved ? "Saved" : "Save"}
          </button>

          <br />

          {/* APPLY / VIEW BUTTON */}
          {isRecruiter ? (
            <button className="btn btn-sm btn-secondary" disabled>
              View Only
            </button>
          ) : isJobClosed ? (
            <button className="btn btn-sm btn-danger" disabled>
              Job Closed
            </button>
          ) : (
            <button
              className={`btn btn-sm ${
                applied ? "btn-success" : "btn-primary"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/job/${job.id}`);
              }}
            >
              {applied ? "View Applied" : "View Details"}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

export default JobCard;