import { useEffect, useState } from "react";
import API from "../../services/api";

export default function ClosedJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    API.get("/closed-jobs").then((res) => {
      setJobs(res.data.data);
    });
  }, []);

  return (
    <div className="container mt-4">
      <h2>Closed Jobs</h2>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job, i) => (
              <tr key={job.id}>
                <td>{i + 1}</td>
                <td>{job.job_title}</td>
                <td>{job.location}</td>
                <td>
                  <span className="badge bg-danger">Closed</span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No closed jobs
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}