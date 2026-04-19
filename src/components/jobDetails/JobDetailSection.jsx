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
  FaFileUpload,
} from "react-icons/fa";

function JobDetailSection() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="text-center">Loading...</p>;
  if (!job) return <p className="text-center">Job not found</p>;

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row gy-5 gx-4">

          {/* LEFT SIDE */}
          <div className="col-lg-8">

            {/* HEADER */}
            <div className="d-flex align-items-center mb-5">
              <img
                className="img-fluid border rounded"
                src={
                  job.logo
                    ? `https://server.budes.online//public/storage/${job.logo}`
                    : "/assets/img/default.png"
                }
                style={{ width: 80, height: 80 }}
                alt="logo"
              />

              <div className="ps-4">
                <h3>{job.job_title}</h3>

                <span className="me-3">
                  <FaMapMarkerAlt className="text-primary me-2" />
                  {job.location}
                </span>

                <span className="me-3">
                  <FaClock className="text-primary me-2" />
                  {job.employment_type}
                </span>

                <span>
                  <FaMoneyBillAlt className="text-primary me-2" />
                  ₹ {job.salary_range}
                </span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-5">
              <h4 className="mb-3">Job Description</h4>
              <p>{job.job_description}</p>
            </div>

            {/* APPLY FORM */}
            <div>
              <h4 className="mb-4">Apply For The Job</h4>

              <form>
                <div className="row g-3">

                  <div className="col-12 col-sm-6">
                    <input
                      className="form-control"
                      placeholder="Your Name"
                    />
                  </div>

                  <div className="col-12 col-sm-6">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your Email"
                    />
                  </div>

                  <div className="col-12 col-sm-6">
                    <input
                      className="form-control"
                      placeholder="Portfolio Website"
                    />
                  </div>

                  <div className="col-12 col-sm-6">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaFileUpload />
                      </span>
                      <input type="file" className="form-control bg-white" />
                    </div>
                  </div>

                  <div className="col-12">
                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Cover Letter"
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <button className="btn btn-primary w-100">
                      Apply Now
                    </button>
                  </div>

                </div>
              </form>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-4">

            {/* JOB SUMMARY */}
            <div className="bg-light rounded p-4 mb-4">
              <h4 className="mb-4">Job Summary</h4>

              <p>
                <FaCalendarAlt className="text-primary me-2" />
                Posted: {job.created_at}
              </p>

              <p>
                <FaUserTie className="text-primary me-2" />
                Vacancy: {job.vacancy || "N/A"}
              </p>

              <p>
                <FaClock className="text-primary me-2" />
                Job Type: {job.employment_type}
              </p>

              <p>
                <FaMoneyBillAlt className="text-primary me-2" />
                Salary: ₹ {job.salary_range}
              </p>

              <p>
                <FaMapMarkerAlt className="text-primary me-2" />
                Location: {job.location}
              </p>
            </div>

            {/* COMPANY */}
            <div className="bg-light rounded p-4">
              <h4 className="mb-4">
                <FaBuilding className="me-2 text-primary" />
                Company Detail
              </h4>

              <p>{job.company_name || "No company info available"}</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default JobDetailSection;