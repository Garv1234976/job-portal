import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const navigate = useNavigate();
  const handleView = (job) => {
    setSelectedJob(job);
  };

  const fetchJobs = () => {
    API.get("/my-jobs")
      .then((res) => {
        setJobs(res.data.data);
      })
      .catch(() => {});
  };

  const handleUpdate = async () => {
    const id = editJob.id;

    console.log("ID:", id);

    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID missing",
      });
      return;
    }

    try {
      await API.put(`/update-job/${id}`, editJob);

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Job updated successfully",
      });

      setEditJob(null);
      fetchJobs();
    } catch (err) {
      console.log("FULL ERROR OBJECT:", err);
      console.log("ERROR RESPONSE:", err.response);
      console.log("ERROR DATA:", err.response?.data);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Update failed",
      });
    }
  };

  const closeJob = async (id) => {
    try {
      await API.post(`/close-job/${id}`);

      Swal.fire({
        icon: "success",
        title: "Closed",
        text: "Job closed successfully",
      });

      fetchJobs();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed",
      });
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="container mt-4">
      <h2>My Jobs</h2>

      <div className="table-responsive mt-3">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Openings</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <tr key={job.id}>
                  <td>{index + 1}</td>
                  <td>{job.job_title}</td>
                  <td>{job.location}</td>
                  <td>{job.salary_range}</td>
                  <td>{job.openings}</td>
                  <td>{new Date(job.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleView(job)}
                    >
                      View
                    </button>

                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => setEditJob(job)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => closeJob(job.id)}
                    >
                      Close
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No jobs found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {selectedJob && (
          <>
            <div className="modal fade show d-block">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  {/* Header */}
                  <div className="modal-header">
                    <h5 className="modal-title">Job Details</h5>
                    <button
                      className="btn-close"
                      onClick={() => setSelectedJob(null)}
                    ></button>
                  </div>

                  {/* Body */}
                  <div
                    className="modal-body"
                    style={{ maxHeight: "70vh", overflowY: "auto" }}
                  >
                    <div className="row g-3">
                      <div className="col-md-6">
                        <strong>Title:</strong>
                        <p>{selectedJob.job_title}</p>
                      </div>

                      <div className="col-md-6">
                        <strong>Location:</strong>
                        <p>{selectedJob.location}</p>
                      </div>

                      <div className="col-md-6">
                        <strong>Salary:</strong>
                        <p>{selectedJob.salary_range}</p>
                      </div>

                      <div className="col-md-6">
                        <strong>Openings:</strong>
                        <p>{selectedJob.openings}</p>
                      </div>

                      <div className="col-md-6">
                        <strong>Experience:</strong>
                        <p>{selectedJob.experience}</p>
                      </div>

                      <div className="col-md-6">
                        <strong>Education:</strong>
                        <p>{selectedJob.education}</p>
                      </div>

                      <div className="col-md-6">
                        <strong>Gender:</strong>
                        <p>{selectedJob.gender}</p>
                      </div>

                      <div className="col-md-6">
                        <strong>Shift:</strong>
                        <p>{selectedJob.shift || "-"}</p>
                      </div>

                      <div className="col-md-6">
                        <strong>Work Mode:</strong>
                        <p>{selectedJob.work_mode || "-"}</p>
                      </div>

                      <div className="col-md-6">
                        <strong>Employment Type:</strong>
                        <p>{selectedJob.employment_type || "-"}</p>
                      </div>

                      <div className="col-md-12">
                        <strong>Description:</strong>
                        <p>{selectedJob.job_description}</p>
                      </div>

                      <div className="col-md-12">
                        <strong>Benefits:</strong>
                        <p>{selectedJob.benefits || "-"}</p>
                      </div>

                      <div className="col-md-6">
                        <strong>Skills:</strong>
                        <p>{selectedJob.key_skills}</p>
                      </div>

                      <div className="col-md-6">
                        <strong>Language:</strong>
                        <p>{selectedJob.language_required}</p>
                      </div>

                      <div className="col-md-6">
                        <strong>Overtime:</strong>
                        <p>{selectedJob.overtime || "-"}</p>
                      </div>

                      <div className="col-md-6">
                        <strong>Cab Facility:</strong>
                        <p>{selectedJob.cab_facility || "-"}</p>
                      </div>

                      <div className="col-md-6">
                        <strong>Interview Mode:</strong>
                        <p>{selectedJob.interview_mode}</p>
                      </div>

                      <div className="col-md-6">
                        <strong>Apply Deadline:</strong>
                        <p>{selectedJob.apply_deadline}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setSelectedJob(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay */}
            <div className="modal-backdrop fade show"></div>
          </>
        )}

        {editJob && (
          <>
            <div className="modal fade show d-block">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5>Edit Job</h5>
                    <button
                      className="btn-close"
                      onClick={() => setEditJob(null)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label>Job Title</label>
                        <input
                          className="form-control"
                          value={editJob.job_title}
                          onChange={(e) =>
                            setEditJob({
                              ...editJob,
                              job_title: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label>Location</label>
                        <input
                          className="form-control"
                          value={editJob.location}
                          onChange={(e) =>
                            setEditJob({ ...editJob, location: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label>Salary</label>
                        <input
                          className="form-control"
                          value={editJob.salary_range}
                          onChange={(e) =>
                            setEditJob({
                              ...editJob,
                              salary_range: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label>Openings</label>
                        <input
                          type="number"
                          className="form-control"
                          value={editJob.openings}
                          onChange={(e) =>
                            setEditJob({ ...editJob, openings: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-md-12">
                        <label>Description</label>
                        <textarea
                          className="form-control"
                          value={editJob.job_description}
                          onChange={(e) =>
                            setEditJob({
                              ...editJob,
                              job_description: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditJob(null)}
                    >
                      Cancel
                    </button>

                    <button className="btn btn-success" onClick={handleUpdate}>
                      Update Job
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-backdrop fade show"></div>
          </>
        )}
      </div>
    </div>
  );
}
