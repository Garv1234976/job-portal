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

  // 🔗 FULL URL (important)
  const getResumeUrl = () => {
    if (!resume) return null;
    return `https://server.budes.online/public/${resume}`;
  };

  const resumeUrl = getResumeUrl();

  // 📄 CHECK TYPE
  const isPDF = resumeUrl?.endsWith(".pdf");
  const isImage =
    resumeUrl?.endsWith(".jpg") ||
    resumeUrl?.endsWith(".jpeg") ||
    resumeUrl?.endsWith(".png");

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
                <>
                  {/* PREVIEW SECTION */}
                  <div className="mb-4">

                    {isPDF && (
                      <iframe
                        src={resumeUrl}
                        title="Resume Preview"
                        width="100%"
                        height="500px"
                        style={{ border: "1px solid #ddd" }}
                      />
                    )}

                    {isImage && (
                      <img
                        src={resumeUrl}
                        alt="Resume"
                        className="img-fluid border"
                      />
                    )}

                    {!isPDF && !isImage && (
                      <div className="alert alert-info">
                        Preview not supported. Please download the file.
                      </div>
                    )}

                  </div>

                  {/* DOWNLOAD BUTTON */}
                  <a
                    href={resumeUrl}
                    download
                    className="btn btn-success"
                  >
                    ⬇ Download Resume
                  </a>
                </>
              ) : (
                <div className="text-center text-muted">
                  <p>No resume uploaded yet.</p>
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