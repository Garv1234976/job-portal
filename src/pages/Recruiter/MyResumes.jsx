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

  useEffect(() => {
    API.get("/my-resumes")
      .then((res) => {
        console.log("API Response:", res.data);

        //  FIX: correct data mapping
        setResumes(res.data || []);
      })
      .catch(() => setResumes([]))
      .finally(() => setLoading(false));
  }, []);

  //  Safe URL handler (VERY IMPORTANT)
  const getFullUrl = (url) => {
    if (!url) return "#";
    return url.startsWith("http")
      ? url
      : `${window.location.origin}/${url}`;
  };

  // Handle View click
  const handleView = (url) => {
    const fullUrl = getFullUrl(url);
    window.open(fullUrl, "_blank"); // avoids React router issue
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
                    const isPDF = file.name?.toLowerCase().endsWith(".pdf");

                    return (
                      <div className="col-md-4 mb-4" key={i}>
                        <div className="card shadow-sm border-0 h-100">
                          <div className="card-body d-flex flex-column text-center">

                            {/* ICON */}
                            <div className="mb-3">
                              <i
                                className={`fa ${
                                  isPDF ? "fa-file-pdf-o text-danger" : "fa-file-word-o text-primary"
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

                            {/* VIEW BUTTON ONLY */}
                            <div className="mt-auto pt-3">
                              <button
                                onClick={() => handleView(file.url)}
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