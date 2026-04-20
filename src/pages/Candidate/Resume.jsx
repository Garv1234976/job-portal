import React, { useEffect, useState } from "react";
import api from "../../services/api";

import CandidateSidebar from "../../components/candidate/CandidateSidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Resume() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      const data = res.data.data;
      setResume(data?.cv || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔗 FIX URL
  const resumeUrl = resume?.startsWith("http")
    ? resume
    : resume
    ? `https://server.budes.online/public/${resume}`
    : null;

  // 📄 FILE NAME
  const fileName = resume ? resume.split("/").pop() : "";

  // 📄 FILE TYPE CHECK
  const isPDF = resumeUrl?.toLowerCase().endsWith(".pdf");

  // ❌ REMOVE RESUME
  const handleRemove = async () => {
    if (!window.confirm("Are you sure you want to remove resume?")) return;

    try {
      await api.post("/resume/remove");
      setResume(null);
    } catch (err) {
      console.error(err);
    }
  };

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
            <div className="bg-white p-4 shadow rounded">
              <h4 className="fw-bold mb-4">My Resume</h4>

              {loading ? (
                <p>Loading...</p>
              ) : resume ? (
                <div className="card p-4 shadow-sm">

                  {/* FILE INFO */}
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <div>
                      <h6 className="mb-1">{fileName}</h6>
                      <small className="text-muted">Uploaded Resume</small>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="d-flex gap-2">
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-primary btn-sm"
                      >
                        View
                      </a>

                      <a
                        href={resumeUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-success btn-sm"
                      >
                        Download
                      </a>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={handleRemove}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* PREVIEW SECTION */}
                  <div style={{ border: "1px solid #ddd" }}>
                    {isPDF ? (
                      <iframe
                        src={resumeUrl}
                        title="Resume Preview"
                        width="100%"
                        height="500px"
                      />
                    ) : (
                      <div className="text-center p-5 bg-light">
                        <i className="fa fa-file fa-3x text-secondary mb-3"></i>
                        <h6 className="mb-2">Preview not available</h6>
                        <p className="text-muted">
                          This file type cannot be previewed. Please download to view.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No resume uploaded</p>

                  <button
                    className="btn btn-primary"
                    onClick={() => (window.location.href = "/profile")}
                  >
                    Upload Resume
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}