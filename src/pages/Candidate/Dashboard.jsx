import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import CandidateSidebar from "../../components/candidate/CandidateSidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CandidateDashboard() {
  const navigate = useNavigate();

  const [totalApplied, setTotalApplied] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [profile, setProfile] = useState({});
  const [completion, setCompletion] = useState(0);
  const [missingFields, setMissingFields] = useState([]);

  // ✅ FETCH COUNTS
  const fetchCounts = async () => {
    try {
      const applied = await api.get("/applied-jobs");
      const saved = await api.get("/saved-jobs");

      setTotalApplied(applied.data.total || 0);
      setTotalSaved(saved.data.total || 0);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      const data = res.data.data || {};
      setProfile(data);

      calculateProfileCompletion(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ PROFILE COMPLETION LOGIC
  const calculateProfileCompletion = (data) => {
    const fields = [
      { key: "full_name", label: "Full Name" },
      { key: "phone", label: "Phone" },
      { key: "dob", label: "Date of Birth" },
      { key: "skills", label: "Skills" },
      { key: "qualification", label: "Qualification" },
      { key: "photo", label: "Profile Photo" },
      { key: "cv", label: "Resume" },
    ];

    let filled = 0;
    let missing = [];

    fields.forEach((field) => {
      if (data[field.key]) {
        filled++;
      } else {
        missing.push(field.label);
      }
    });

    const percent = Math.round((filled / fields.length) * 100);

    setCompletion(percent);
    setMissingFields(missing);
  };

  useEffect(() => {
    fetchCounts();
    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-4 mb-5">
        <div className="row">

          {/* SIDEBAR */}
          <div className="col-md-3 col-lg-2">
            <CandidateSidebar />
          </div>

          {/* MAIN */}
          <div className="col-md-9 col-lg-10">
            <div className="bg-white shadow-lg rounded p-4">

              {/* HEADER */}
              <div className="mb-4">
                <h3 className="fw-bold">Candidate Dashboard</h3>
                <p className="text-muted">
                  Manage your jobs, profile and resume
                </p>
              </div>

              <div className="row g-4">

                {/* PROFILE CARD */}
                <div className="col-md-4">
                  <div className="card shadow-sm p-4 text-center h-100">

                    <img
                      src={
                        profile.photo
                          ? `https://server.budes.online/public/${profile.photo}`
                          : "/assets/img/default.png"
                      }
                      className="rounded-circle mb-3"
                      style={{ width: 80, height: 80, objectFit: "cover" }}
                      alt=""
                    />

                    <h5 className="fw-bold">
                      {profile.full_name || "Your Name"}
                    </h5>

                    <p className="text-muted mb-2">
                      {profile.job_profile || "Add your job profile"}
                    </p>

                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate("/profile")}
                    >
                      Update Profile
                    </button>
                  </div>
                </div>

                {/* APPLIED JOBS */}
                <div className="col-md-4">
                  <div
                    className="card shadow-sm p-4 text-center dashboard-box"
                    onClick={() => navigate("/candidate/applied")}
                    style={{ cursor: "pointer" }}
                  >
                    <h6 className="text-muted">Applied Jobs</h6>
                    <h2 className="fw-bold text-primary">{totalApplied}</h2>
                  </div>
                </div>

                {/* SAVED JOBS */}
                <div className="col-md-4">
                  <div
                    className="card shadow-sm p-4 text-center dashboard-box"
                    onClick={() => navigate("/candidate/saved")}
                    style={{ cursor: "pointer" }}
                  >
                    <h6 className="text-muted">Saved Jobs</h6>
                    <h2 className="fw-bold text-success">{totalSaved}</h2>
                  </div>
                </div>

                {/* PROFILE COMPLETION */}
                <div className="col-md-6">
                  <div className="card shadow-sm p-4 h-100">
                    <h6 className="fw-bold mb-3">Profile Completion</h6>

                    <div className="progress mb-2" style={{ height: "10px" }}>
                      <div
                        className={`progress-bar ${
                          completion < 50
                            ? "bg-danger"
                            : completion < 80
                            ? "bg-warning"
                            : "bg-success"
                        }`}
                        style={{ width: `${completion}%` }}
                      ></div>
                    </div>

                    <p className="mb-2 fw-semibold">{completion}% Completed</p>

                    {missingFields.length > 0 && (
                      <small className="text-muted">
                        Missing: {missingFields.join(", ")}
                      </small>
                    )}
                  </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="col-md-6">
                  <div className="card shadow-sm p-4 h-100">
                    <h6 className="fw-bold mb-3">Quick Actions</h6>

                    <button
                      className="btn btn-outline-primary w-100 mb-2"
                      onClick={() => navigate("/jobs")}
                    >
                      Browse Jobs
                    </button>

                    <button
                      className="btn btn-outline-success w-100"
                      onClick={() => navigate("/resume")}
                    >
                      Update Resume
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}