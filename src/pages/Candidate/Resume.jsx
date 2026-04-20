import React, { useEffect, useState } from "react";
import api from "../../services/api";

import CandidateSidebar from "../../components/candidate/CandidateSidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Resume() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  // 🔗 URL
  const resumeUrl = resume?.startsWith("http")
    ? resume
    : resume
    ? `https://server.budes.online/public/${resume}`
    : null;

  const fileName = resume ? resume.split("/").pop() : "";
  const isPDF = resumeUrl?.toLowerCase().endsWith(".pdf");

  // 🔥 UPLOAD RESUME
  const handleUpload = async () => {
    if (!file) return alert("Please select file");

    const formData = new FormData();
    formData.append("cv", file);

    try {
      setUploading(true);
      await api.post("/resume/upload", formData);
      fetchProfile(); // refresh resume
      setFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // ❌ REMOVE
  const handleRemove = async () => {
    if (!window.confirm("Remove resume?")) return;

    try {
      await api.post("/resume/upload", { remove: 1 });
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
          <div className="col-md-3 col-lg-2">
            <CandidateSidebar />
          </div>

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

                    <div className="d-flex gap-2">
                      <a
                        href={`https://docs.google.com/gview?url=${encodeURIComponent(resumeUrl)}&embedded=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm"
                      >
                        View
                      </a>

                      <a
                        href={resumeUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
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

                  {/* PREVIEW */}
                  <div style={{ border: "1px solid #ddd" }}>
                    {isPDF ? (
                      <iframe
                        src={resumeUrl}
                        width="100%"
                        height="500px"
                        title="Resume"
                      />
                    ) : (
                      <div className="text-center p-5 bg-light">
                        <h6>Preview not available</h6>
                        <p className="text-muted">
                          Download to view file
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="card p-4 text-center">

                  <p className="text-muted mb-3">No resume uploaded</p>

                  {/* FILE INPUT */}
                  <input
                    type="file"
                    className="form-control mb-3"
                    onChange={(e) => setFile(e.target.files[0])}
                  />

                  <button
                    className="btn btn-primary"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload Resume"}
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