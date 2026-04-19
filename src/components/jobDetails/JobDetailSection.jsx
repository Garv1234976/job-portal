import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

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

  const [form, setForm] = useState({
    name: "",
    email: "",
    portfolio: "",
    cover_letter: ""
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/job/${id}`);
      setJob(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setErrors({
      ...errors,
      [e.target.name]: ""
    });
  };

  const handleApply = async (e) => {
    e.preventDefault();

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
        ...form
      });

      alert(res.data.message);
      setForm({
        name: "",
        email: "",
        portfolio: "",
        cover_letter: ""
      });

    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        alert(err.response?.data?.message || "Error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!job) return <p className="text-center">Job not found</p>;

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row gy-5 gx-4">

          {/* LEFT */}
          <div className="col-lg-8">

            <div className="d-flex align-items-center mb-5">
              <img
                src={
                  job.logo
                    ? `https://server.budes.online/public/storage/${job.logo}`
                    : "/assets/img/default.png"
                }
                style={{ width: 80, height: 80 }}
                alt=""
                className="border rounded"
              />

              <div className="ps-4">
                <h3>{job.job_title}</h3>

                <span className="me-3">
                  <FaMapMarkerAlt className="me-2 text-primary" />
                  {job.location}
                </span>

                <span className="me-3">
                  <FaClock className="me-2 text-primary" />
                  {job.employment_type}
                </span>

                <span>
                  <FaMoneyBillAlt className="me-2 text-primary" />
                  ₹ {job.salary_range}
                </span>
              </div>
            </div>

            {/* APPLY FORM */}
            <div>
              <h4 className="mb-4">Apply For The Job</h4>

              <form onSubmit={handleApply}>
                <div className="row g-3">

                  <div className="col-6">
                    <input
                      name="name"
                      className="form-control"
                      placeholder="Name *"
                      value={form.name}
                      onChange={handleChange}
                    />
                    {errors.name && <small className="text-danger">{errors.name}</small>}
                  </div>

                  <div className="col-6">
                    <input
                      name="email"
                      className="form-control"
                      placeholder="Email *"
                      value={form.email}
                      onChange={handleChange}
                    />
                    {errors.email && <small className="text-danger">{errors.email}</small>}
                  </div>

                  <div className="col-6">
                    <input
                      name="portfolio"
                      className="form-control"
                      placeholder="Portfolio"
                      value={form.portfolio}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <textarea
                      name="cover_letter"
                      className="form-control"
                      rows="4"
                      placeholder="Cover Letter"
                      value={form.cover_letter}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={submitting}
                    >
                      {submitting ? "Applying..." : "Apply Now"}
                    </button>
                  </div>

                </div>
              </form>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default JobDetailSection;