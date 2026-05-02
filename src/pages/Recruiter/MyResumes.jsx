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
        console.log('res',res.data);
        setResumes(res.data || []);
      })
      .catch(() => setResumes([]))
      .finally(() => setLoading(false));
  }, []);

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
                  {resumes.map((file, i) => (
                    <div className="col-md-4 mb-4" key={i}>
                      <div className="card shadow-sm border-0 h-100">
                        <div className="card-body d-flex flex-column">
                          {/* ICON */}
                          <div className="mb-3 text-center">
                            <i
                              className="fa fa-file-pdf-o"
                              style={{ fontSize: "40px", color: "#dc3545" }}
                            ></i>
                          </div>

                          {/* NAME */}
                          <h6 className="text-truncate">
                            {file.name}
                          </h6>

                          {/* META */}
                          <small className="text-muted">
                            {file.time}
                          </small>

                          {/* ACTIONS */}
                          <div className="mt-auto d-flex gap-2 pt-3">
                            <a
                              href={file.url}
                              target="_blank"
                              className="btn btn-sm btn-outline-primary w-50"
                            >
                              View
                            </a>

                            <a
                              href={file.url}
                              download
                              className="btn btn-sm btn-primary w-50"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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