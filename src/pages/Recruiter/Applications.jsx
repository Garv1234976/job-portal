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
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // ✅ FETCH
  const fetchApplications = () => {
    API.get(`/job-applications/${id}`, {
      params: { page, search, status: filter },
    })
      .then((res) => {
        const data = res.data.data;
        setApplications(data.data || []);
        setLastPage(data.last_page || 1);
      })
      .catch(() => setApplications([]));
  };

  useEffect(() => {
    fetchApplications();
  }, [id, page, search, filter]);

  // ✅ CONFIRM + UPDATE
  const updateStatus = async (appId, status) => {
    const textMap = {
      shortlisted: "Shortlist this candidate?",
      selected: "Select this candidate and send email?",
      rejected: "Reject this candidate?",
    };

    const result = await Swal.fire({
      title: "Are you sure?",
      text: textMap[status],
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      await API.post(`/application-status/${appId}`, { status });
      fetchApplications();
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  // ✅ PAGINATION
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

      <div className="container-fluid mt-4 mb-5">
        <div className="row">

          <div className="col-md-3">
            <RecruiterSidebar />
          </div>

          <div className="col-md-9">
            <div className="container">

              <div className="d-flex justify-content-between mb-3">
                <h3>Applications</h3>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                  Back
                </button>
              </div>

              {/* FILTER */}
              <div className="mb-3 d-flex gap-2">
                {["all", "shortlisted", "selected", "rejected"].map((f) => (
                  <button
                    key={f}
                    className={`btn ${
                      filter === f ? "btn-dark" : "btn-outline-dark"
                    }`}
                    onClick={() => {
                      setFilter(f);
                      setPage(1);
                    }}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* SEARCH */}
              <input
                className="form-control mb-3"
                placeholder="Search name, email or phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />

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
                    applications.map((app, i) => {

                      const resumeUrl = app.resume_url?.startsWith("http")
                        ? app.resume_url
                        : app.resume_url
                        ? `https://server.budes.online/public/${app.resume_url}`
                        : null;

                      return (
                        <tr key={app.id}>
                          <td>{(page - 1) * 5 + i + 1}</td>

                          <td>{app.name}</td>
                          <td>{app.email}</td>

                          <td>
                            {app.phone ? (
                              <>
                                <div>{app.phone}</div>
                                <a
                                  href={`https://wa.me/91${app.phone}`}
                                  target="_blank"
                                  className="btn btn-success btn-sm mt-1"
                                >
                                  WhatsApp
                                </a>
                              </>
                            ) : "No Phone"}
                          </td>

                          {/* RESUME */}
                          <td>
                            {resumeUrl ? (
                              <>
                                <a
                                  href={resumeUrl}
                                  target="_blank"
                                  className="btn btn-primary btn-sm me-2"
                                >
                                  View
                                </a>
                                <a
                                  href={resumeUrl}
                                  download
                                  className="btn btn-success btn-sm"
                                >
                                  Download
                                </a>
                              </>
                            ) : "No Resume"}
                          </td>

                          {/* STATUS */}
                          <td>
                            <span
                              className={`badge ${
                                app.status === "shortlisted"
                                  ? "bg-info"
                                  : app.status === "selected"
                                  ? "bg-success"
                                  : app.status === "rejected"
                                  ? "bg-danger"
                                  : "bg-warning"
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>

                          {/* ACTIONS */}
                          <td>
                            {app.status !== "shortlisted" && (
                              <button
                                className="btn btn-info btn-sm me-2"
                                onClick={() =>
                                  updateStatus(app.id, "shortlisted")
                                }
                              >
                                Shortlist
                              </button>
                            )}

                            {app.status !== "selected" && (
                              <button
                                className="btn btn-success btn-sm me-2"
                                onClick={() =>
                                  updateStatus(app.id, "selected")
                                }
                              >
                                Select
                              </button>
                            )}

                            {app.status !== "rejected" && (
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  updateStatus(app.id, "rejected")
                                }
                              >
                                Reject
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No applications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="d-flex justify-content-center mt-4 gap-2">
                {renderPagination()}
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}