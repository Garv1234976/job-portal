import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Swal from "sweetalert2";
import { BASE_URL } from "../../config/constants";

import {
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillAlt,
  FaUserTie,
  FaCalendarAlt,
  FaBuilding,
} from "react-icons/fa";

function JobDetailSection() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    portfolio: "",
    cover_letter: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/job/${id}`);
      const jobData = res.data.data;

      setJob(jobData);
      setAlreadyApplied(jobData.applied || false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleApply = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first to apply",
      }).then(() => {
        window.location.href = "/login";
      });
      return;
    }

    try {
      const profileRes = await api.get("/profile");
      const user = profileRes.data?.data;

      if (!user?.cv) {
        Swal.fire({
          icon: "warning",
          title: "Resume Required",
          text: "Please upload your resume before applying",
        }).then(() => {
          window.location.href = "/candidate/resume";
        });
        return;
      }
    } catch (err) {
      console.log(err);
    }

    let newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.post("/apply-job", {
        job_id: job.id,
        ...form,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
      });

      setAlreadyApplied(true);

      setForm({
        name: "",
        email: "",
        portfolio: "",
        cover_letter: "",
      });
    } catch (err) {
      if (err.response?.status === 401) {
        Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: "Please login first",
        }).then(() => {
          window.location.href = "/login";
        });
      } else if (err.response?.data?.limit_reached) {
        Swal.fire({
          icon: "warning",
          title: "Job Closed",
          text: "This job is no longer accepting applications",
        });
      } else if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Something went wrong",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!job) return <p className="text-center">Job not found</p>;

  const isJobClosed =
    job.status === "closed" || job.application_count >= job.application_limit;

  const isRecruiter = job.is_recruiter;

  const remainingVacancy = isJobClosed
    ? 0
    : Math.max(0, job.application_limit - job.application_count);

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row gy-5 gx-4">

          {/* LEFT */}
          <div className="col-lg-8">

            {/* HEADER */}
            <div className="d-flex align-items-center mb-5">
              <img
                src={
                  job.logo
                    ? `${BASE_URL}/public/storage/${job.logo}`
                    : "/assets/img/default.png"
                }
                style={{ width: 80, height: 80 }}
                alt=""
                className="border rounded"
              />

              <div className="ps-4">
                <h3>{job.job_title}</h3>

                <small className="text-muted">
                  <FaBuilding className="me-1" />
                  {job.company_name || "Company"}
                </small>

                <div className="mt-2">
                  <span className="me-3">
                    <FaMapMarkerAlt className="me-2 text-primary" />
                    {job.location}
                  </span>

                  <span className="me-3">
                    <FaClock className="me-2 text-primary" />
                    {job.employment_type || "N/A"}
                  </span>

                  <span>
                    <FaMoneyBillAlt className="me-2 text-primary" />
                    ₹ {job.salary_range}
                  </span>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-5">
              <h4 className="mb-3">Job Description</h4>
              <p>{job.job_description}</p>
            </div>

            {/* 🔥 NEW CLEAN JOB HIGHLIGHTS UI */}
            <div className="mb-5">
              <h4 className="mb-3 fw-bold">Job Highlights</h4>

              <div className="row g-3">

                {job.key_skills && (
                  <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                      <small className="text-muted">Key Skills</small>
                      <div className="mt-2">
                        {job.key_skills.split(",").map((s, i) => (
                          <span key={i} className="badge bg-primary-subtle text-dark me-1">
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {job.experience && (
                  <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                      <small className="text-muted">Experience</small>
                      <div className="fw-semibold">{job.experience}</div>
                    </div>
                  </div>
                )}

                {job.education && (
                  <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                      <small className="text-muted">Education</small>
                      <div className="fw-semibold">{job.education}</div>
                    </div>
                  </div>
                )}

                {job.gender && (
                  <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                      <small className="text-muted">Gender</small>
                      <div className="fw-semibold">{job.gender}</div>
                    </div>
                  </div>
                )}

                {job.working_hours && (
                  <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                      <small className="text-muted">Working Hours</small>
                      <div className="fw-semibold">{job.working_hours}</div>
                    </div>
                  </div>
                )}

                {job.openings && (
                  <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                      <small className="text-muted">Openings</small>
                      <div className="fw-semibold">{job.openings}</div>
                    </div>
                  </div>
                )}

                {job.interview_mode && (
                  <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                      <small className="text-muted">Interview Mode</small>
                      <div className="fw-semibold">{job.interview_mode}</div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* APPLY SECTION (UNCHANGED) */}
            <div>
              {isJobClosed ? (
                <div className="alert alert-danger text-center">🚫 Job Closed</div>
              ) : isRecruiter ? (
                <div className="alert alert-info text-center">
                  You can view this job but cannot apply
                </div>
              ) : alreadyApplied ? (
                <div className="alert alert-success">
                  You have already applied for this job
                </div>
              ) : (
                <>
                  <h4 className="mb-4">Apply For The Job</h4>
                  <form onSubmit={handleApply}>
                    <div className="row g-3">
                      <div className="col-6">
                        <input name="name" className="form-control" value={form.name} onChange={handleChange} />
                      </div>
                      <div className="col-6">
                        <input name="email" className="form-control" value={form.email} onChange={handleChange} />
                      </div>
                      <div className="col-12">
                        <button className="btn btn-primary w-100">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>

          </div>

          {/* RIGHT SIDE UNCHANGED */}
          <div className="col-lg-4">
            <div className="bg-light rounded p-4 mb-4">
              <h4>Job Summary</h4>
              <p>Vacancy: {remainingVacancy}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default JobDetailSection;