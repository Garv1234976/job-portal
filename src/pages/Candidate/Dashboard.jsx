import React, { useState, useEffect } from "react";
import api from "../../services/api";

import CandidateSidebar from "../../components/candidate/CandidateSidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CandidateDashboard() {
  // ✅ DEFAULT = DASHBOARD
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

      // 🔥 DASHBOARD (NEW)
      case "dashboard":
        return (
          <div className="row g-4">

            <div className="col-md-4">
              <div className="card shadow-sm p-4 text-center">
                <h5 className="fw-bold">Applied Jobs</h5>
                <h2 className="text-primary">{appliedJobs.length}</h2>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm p-4 text-center">
                <h5 className="fw-bold">Saved Jobs</h5>
                <h2 className="text-success">0</h2>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm p-4 text-center">
                <h5 className="fw-bold">Profile Status</h5>
                <p className="text-muted">Complete your profile</p>
              </div>
            </div>

          </div>
        );

      // ✅ APPLIED JOBS
      case "applied":
        return appliedJobs.length > 0 ? (
          <div className="row">
            {appliedJobs.map((item) => (
              <div key={item.id} className="col-md-6 mb-3">
                <div className="card shadow-sm h-100">
                  <div className="card-body">

                    <h5 className="fw-bold">
                      {item.job?.job_title}
                    </h5>

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
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No applied jobs yet.</p>
        );

      case "saved":
        return <p className="text-muted">No saved jobs.</p>;

      case "lastViewed":
        return <p className="text-muted">No recently viewed jobs.</p>;

      case "profile":
        return (
          <div>
            <h5 className="fw-bold mb-3">Edit Profile</h5>
            <p className="text-muted">
              Update your profile details here.
            </p>
          </div>
        );

      case "resume":
        return (
          <div>
            <h5 className="fw-bold mb-3">Resume</h5>
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
      {/* ✅ NAVBAR */}
      <Navbar />

      <div className="container-fluid mt-4 mb-5">
        <div className="row">

          {/* ✅ SIDEBAR */}
          <div className="col-md-3 col-lg-2 mb-3">
            <CandidateSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* ✅ MAIN CONTENT */}
          <div className="col-md-9 col-lg-10">
            <div className="bg-white shadow-lg rounded p-4 min-h-[500px]">

              {/* HEADER */}
              <div className="mb-4">
                <h3 className="fw-bold">Candidate Dashboard</h3>
                <p className="text-muted">
                  Manage your jobs, profile and resume
                </p>
              </div>

              {/* CONTENT */}
              {renderContent()}

            </div>
          </div>

        </div>
      </div>

      {/* ✅ FOOTER */}
      <Footer />
    </>
  );
}