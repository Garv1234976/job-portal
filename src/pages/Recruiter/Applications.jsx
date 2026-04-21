import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import Swal from "sweetalert2";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RecruiterSidebar from "../../components/RecruiterSidebar";

export default function Applications() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // ✅ FETCH APPLICATIONS
  const fetchApplications = () => {
    API.get(`/job-applications/${id}`, { params: { page } })
      .then((res) => {
        const data = res.data.data;

        setApplications(data.data || []);
        setLastPage(data.last_page || 1);
      })
      .catch(() => {
        setApplications([]);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, [id, page]);

  // ✅ UPDATE STATUS
  const updateStatus = async (appId, status) => {
    try {
      await API.post(`/application-status/${appId}`, { status });

      Swal.fire({
        title: "Success",
        text: `Candidate ${status}`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

      fetchApplications();
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  // ✅ PAGINATION UI
  const renderPagination = () => {
    if (lastPage <= 1) return null;

    let pages = [];

    pages.push(
      <button
        key="prev"
        className="btn btn-light border"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </button>
    );

    for (let i = 1; i <= lastPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn ${page === i ? "btn-dark" : "btn-light border"}`}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        className="btn btn-light border"
        disabled={page === lastPage}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    );

    return pages;
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-4">
        <div className="row">

          {/* SIDEBAR */}
          <div className="col-md-3">
            <RecruiterSidebar />
          </div>

          {/* MAIN */}
          <div className="col-md-9">
            <div className="container">

              {/* HEADER */}
              <div className="d-flex justify-content-between mb-3">
                <h3>Applications</h3>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
              </div>

              {/* TABLE */}
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Resume</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.length > 0 ? (
                    applications.map((app, i) => (
                      <tr key={app.id}>
                        {/* SERIAL */}
                        <td>{(page - 1) * 5 + i + 1}</td>

                        <td>{app.name}</td>
                        <td>{app.email}</td>

                        {/* PHONE + WHATSAPP */}
                        <td>
                          {app.phone ? (
                            <>
                              <div>{app.phone}</div>
                              <a
                                href={`https://wa.me/91${app.phone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-success btn-sm mt-1"
                              >
                                WhatsApp
                              </a>
                            </>
                          ) : (
                            <span className="text-muted">No Phone</span>
                          )}
                        </td>

                        {/* RESUME */}
                        <td>
                          {app.resume_url ? (
                            <>
                              <button
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => setResumeUrl(app.resume_url)}
                              >
                                View
                              </button>

                              <a
                                href={app.resume_url}
                                download
                                className="btn btn-success btn-sm"
                              >
                                Download
                              </a>
                            </>
                          ) : (
                            <span className="text-danger">No Resume</span>
                          )}
                        </td>

                        {/* STATUS */}
                        <td>
                          <span
                            className={`badge ${
                              app.status === "accepted"
                                ? "bg-success"
                                : app.status === "rejected"
                                ? "bg-danger"
                                : "bg-warning"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td>
                          <button
                            className="btn btn-success btn-sm me-2"
                            disabled={app.status === "accepted"}
                            onClick={() =>
                              updateStatus(app.id, "accepted")
                            }
                          >
                            Accept
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            disabled={app.status === "rejected"}
                            onClick={() =>
                              updateStatus(app.id, "rejected")
                            }
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No applications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="d-flex justify-content-center mt-4 gap-2 flex-wrap">
                {renderPagination()}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* RESUME MODAL */}
      {resumeUrl && (
        <div className="modal show d-block" style={{ background: "#00000099" }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">

              <div className="modal-header">
                <h5>Resume Preview</h5>
                <button
                  className="btn-close"
                  onClick={() => setResumeUrl(null)}
                />
              </div>

              <div className="modal-body">
                <iframe
                  src={resumeUrl}
                  width="100%"
                  height="500px"
                  title="Resume"
                />
              </div>

            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}