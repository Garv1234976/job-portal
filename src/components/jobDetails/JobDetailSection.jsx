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
  FaBriefcase,
  FaGraduationCap,
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

                {/* NEW: COMPANY + STATUS */}
                <div className="mt-1">
                  <small className="text-muted">
                    <FaBuilding className="me-1" />
                    {job.company_name || "Company"}
                  </small>
                </div>

                <div className="mt-2">
                  <span className="badge bg-primary me-2">Featured</span>
                  {isJobClosed ? (
                    <span className="badge bg-danger">Closed</span>
                  ) : (
                    <span className="badge bg-success">Active</span>
                  )}
                </div>

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

            {/* DESCRIPTION */}
            <div className="mb-5">
              <h4 className="mb-3">Job Description</h4>
              <p>{job.job_description}</p>
            </div>

            {/* NEW: SKILLS */}
            {job.skills && (
              <div className="mb-5">
                <h4 className="mb-3">Skills Required</h4>
                <div className="d-flex flex-wrap gap-2">
                  {job.skills.split(",").map((skill, i) => (
                    <span key={i} className="badge bg-light text-dark border">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* NEW: EXTRA DETAILS */}
            <div className="mb-5">
              <h4 className="mb-3">Additional Details</h4>

              <p>
                <FaUserTie className="me-2 text-primary" />
                Experience: {job.experience || "Not specified"}
              </p>

              <p>
                <FaGraduationCap className="me-2 text-primary" />
                Education: {job.education || "Not specified"}
              </p>
            </div>

            {/* APPLY SECTION (UNCHANGED) */}
            <div>
              {isJobClosed ? (
                <div className="alert alert-danger text-center">
                  🚫 Job Closed
                </div>
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
                        <label>Name *</label>
                        <input
                          name="name"
                          className={`form-control ${errors.name ? "is-invalid" : ""}`}
                          value={form.name}
                          onChange={handleChange}
                        />
                        {errors.name && <small className="text-danger">{errors.name}</small>}
                      </div>

                      <div className="col-6">
                        <label>Email *</label>
                        <input
                          name="email"
                          type="email"
                          className={`form-control ${errors.email ? "is-invalid" : ""}`}
                          value={form.email}
                          onChange={handleChange}
                        />
                        {errors.email && <small className="text-danger">{errors.email}</small>}
                      </div>

                      <div className="col-6">
                        <label>Portfolio</label>
                        <input
                          name="portfolio"
                          className="form-control"
                          value={form.portfolio}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-12">
                        <label>Cover Letter</label>
                        <textarea
                          name="cover_letter"
                          className="form-control"
                          rows="4"
                          value={form.cover_letter}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-12">
                        <button className="btn btn-primary w-100" disabled={submitting}>
                          {submitting ? "Applying..." : "Apply Now"}
                        </button>
                      </div>

                    </div>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-lg-4">

            <div className="bg-light rounded p-4 mb-4">
              <h4>Job Summary</h4>

              <p><FaCalendarAlt /> Posted: {new Date(job.created_at).toLocaleDateString()}</p>
              <p><FaUserTie /> Vacancy: {remainingVacancy}</p>
              <p><FaClock /> Job Type: {job.employment_type}</p>
              <p><FaMoneyBillAlt /> Salary: ₹ {job.salary_range}</p>
              <p><FaMapMarkerAlt /> Location: {job.location}</p>
            </div>

            <div className="bg-light rounded p-4">
              <h4>Company Detail</h4>
              <p>{job.company_name}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetailSection;