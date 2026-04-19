import React, { useState, useEffect } from "react";
import api from "../../services/api";

import CandidateSidebar from "../../components/candidate/CandidateSidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    if (activeTab === "applied" || activeTab === "dashboard") {
      fetchAppliedJobs();
    }
  }, [activeTab]);

  const fetchAppliedJobs = async () => {
    try {
      const res = await api.get("/applied-jobs");
      setAppliedJobs(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ CONTENT
  const renderContent = () => {
    switch (activeTab) {

      // 🔥 DASHBOARD
      case "dashboard":
        return (
          <div className="row g-4">

            <div className="col-md-4">
              <div
                className="card dashboard-box p-4 text-center"
                onClick={() => setActiveTab("applied")}
              >
                <h5>Applied Jobs</h5>
                <h2 className="text-primary">{appliedJobs.length}</h2>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card dashboard-box p-4 text-center"
                onClick={() => setActiveTab("saved")}
              >
                <h5>Saved Jobs</h5>
                <h2 className="text-success">0</h2>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card dashboard-box p-4 text-center"
                onClick={() => setActiveTab("profile")}
              >
                <h5>Profile</h5>
                <p className="text-muted">Complete your profile</p>
              </div>
            </div>

          </div>
        );

      // ✅ APPLIED JOBS
      case "applied":
        return (
          <>
            <h5 className="mb-3">Applied Jobs</h5>

            {appliedJobs.length > 0 ? (
              <div className="row g-3">
                {appliedJobs.map((item) => (
                  <div key={item.id} className="col-md-6">
                    <div className="card job-card p-3">

                      <h6 className="fw-bold">
                        {item.job?.job_title}
                      </h6>

                      <p className="text-muted mb-1">
                        📍 {item.job?.location}
                      </p>

                      <span
                        className={`badge ${
                          item.status === "pending"
                            ? "bg-warning text-dark"
                            : item.status === "applied"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {item.status}
                      </span>

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-box">No applied jobs yet.</div>
            )}
          </>
        );

      case "saved":
        return (
          <div className="empty-box">
            No saved jobs yet.
          </div>
        );

      case "lastViewed":
        return (
          <div className="empty-box">
            No recently viewed jobs.
          </div>
        );

      case "profile":
        return (
          <div className="card p-4">
            <h5>Edit Profile</h5>
            <p className="text-muted">Update your profile here.</p>
          </div>
        );

      case "resume":
        return (
          <div className="card p-4">
            <h5>Resume</h5>
            <p className="text-muted">
              Upload or update your resume.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      <div className="container-fluid mt-4 mb-5">
        <div className="row">

          {/* SIDEBAR */}
          <div className="col-md-3 col-lg-2 mb-3">
            <CandidateSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* CONTENT */}
          <div className="col-md-9 col-lg-10">
            <div className="bg-white shadow-lg rounded p-4 min-h-[500px]">

              <div className="mb-4">
                <h3 className="fw-bold">Candidate Dashboard</h3>
                <p className="text-muted">
                  Manage your jobs, profile and resume
                </p>
              </div>

              {renderContent()}

            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <Footer />

      {/* ✅ STYLE */}
      <style>
        {`
          .dashboard-box {
            cursor: pointer;
            border-radius: 12px;
            transition: 0.3s;
            border: 1px solid #eee;
          }

          .dashboard-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }

          .job-card {
            border-radius: 10px;
            transition: 0.3s;
            border: 1px solid #eee;
          }

          .job-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          }

          .empty-box {
            padding: 40px;
            text-align: center;
            background: #f8fafc;
            border-radius: 10px;
            color: #6b7280;
          }
        `}
      </style>
    </>
  );
}