import { useEffect, useState } from "react";
import API from "../../services/api";

export default function Applications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    API.get("/applications").then((res) => {
      setApplications(res.data.data);
    });
  }, []);

  return (
    <div className="container mt-4">
      <h2>Applications</h2>

      <div className="table-responsive mt-3">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Candidate</th>
              <th>Email</th>
              <th>Job Title</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {applications.length > 0 ? (
              applications.map((app, index) => (
                <tr key={app.id}>
                  <td>{index + 1}</td>
                  <td>{app.candidate?.name}</td>
                  <td>{app.candidate?.email}</td>
                  <td>{app.job?.job_title}</td>
                  <td>
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No applications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
