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

  const fetchApplications = () => {
    API.get(`/job-applications/${id}`)
      .then((res) => {
        setApplications(res.data.data.data || []);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, [id]);

  // ✅ UPDATE STATUS
  const updateStatus = async (appId, status) => {
    await API.post(`/application-status/${appId}`, { status });

    Swal.fire("Success", `Candidate ${status}`, "success");
    fetchApplications();
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-4">
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

              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th> {/* ✅ NEW */}
                    <th>Resume</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((app, i) => (
                    <tr key={app.id}>
                      <td>{i + 1}</td>
                      <td>{app.name}</td>
                      <td>{app.email}</td>

                      {/* ✅ PHONE + WHATSAPP */}
                      <td>
                        {app.phone ? (
                          <a
                            href={`https://wa.me/${app.phone}`}
                            target="_blank"
                            className="btn btn-success btn-sm"
                          >
                            Chat
                          </a>
                        ) : "-"}
                      </td>

                      {/* RESUME */}
                      <td>
                        {app.resume ? (
                          <>
                            <button
                              className="btn btn-primary btn-sm me-2"
                              onClick={() =>
                                setResumeUrl(`https://server.budes.online/storage/${app.resume}`)
                              }
                            >
                              View
                            </button>

                            <a
                              href={`https://server.budes.online/storage/${app.resume}`}
                              download
                              className="btn btn-success btn-sm"
                            >
                              Download
                            </a>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* STATUS */}
                      <td>
                        {app.status === "accepted" && (
                          <span className="badge bg-success">Accepted</span>
                        )}
                        {app.status === "rejected" && (
                          <span className="badge bg-danger">Rejected</span>
                        )}
                        {app.status === "pending" && (
                          <span className="badge bg-warning">Pending</span>
                        )}
                      </td>

                      {/* ACTION */}
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => updateStatus(app.id, "accepted")}
                        >
                          Accept
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => updateStatus(app.id, "rejected")}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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