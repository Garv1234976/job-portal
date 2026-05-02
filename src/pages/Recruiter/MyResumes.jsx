import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RecruiterSidebar from "../../components/RecruiterSidebar";

export default function MyResumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const BASE_URL = "https://server.budes.online";

  useEffect(() => {
    API.get("/my-resumes")
      .then((res) => {
        console.log("API Response:", res.data);

        const files = res.data?.data || [];

        const formatted = files.map((file) => {
          const cleanPath = file.url?.replace(/^\/+/, "");

          return {
            ...file,
            url: file.url?.startsWith("http")
              ? file.url
              : `${BASE_URL}/${cleanPath}`,
          };
        });

        setResumes(formatted);
      })
      .catch(() => setResumes([]))
      .finally(() => setLoading(false));
  }, []);

  // ✅ FINAL VIEW HANDLER
  const handleView = (url, name) => {
    if (!url) return;

    const isPDF = name?.toLowerCase().endsWith(".pdf");

    if (isPDF) {
      // PDF → open in new tab
      window.open(url, "_blank");
    } else {
      // DOCX → download (best practice)
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-4 mb-5">
        <div className="row">
          {/* SIDEBAR */}
          <div className="col-md-3">
            <RecruiterSidebar />
          </div>

          {/* MAIN */}
          <div className="col-md-9">
            <div className="container">
              <div className="d-flex justify-content-between mb-3">
                <h3>📄 My Downloaded Resumes</h3>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
              </div>

              {/* LOADING */}
              {loading ? (
                <div className="text-center py-5">Loading...</div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  No resumes found
                </div>
              ) : (
                <div className="row">
                  {resumes.map((file, i) => {
                    const isPDF = file.name
                      ?.toLowerCase()
                      .endsWith(".pdf");

                    return (
                      <div className="col-md-4 mb-4" key={i}>
                        <div className="card shadow-sm border-0 h-100">
                          <div className="card-body d-flex flex-column text-center">

                            {/* ICON */}
                            <div className="mb-3">
                              <i
                                className={`fa ${
                                  isPDF
                                    ? "fa-file-pdf-o text-danger"
                                    : "fa-file-word-o text-primary"
                                }`}
                                style={{ fontSize: "42px" }}
                              ></i>
                            </div>

                            {/* NAME */}
                            <h6 className="text-truncate" title={file.name}>
                              {file.name}
                            </h6>

                            {/* DATE */}
                            <small className="text-muted">
                              {file.time || "—"}
                            </small>

                            {/* VIEW BUTTON */}
                            <div className="mt-auto pt-3">
                              <button
                                onClick={() =>
                                  handleView(file.url, file.name)
                                }
                                className="btn btn-outline-primary w-100"
                              >
                                👁 View Resume
                              </button>
                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })}
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