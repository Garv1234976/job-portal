import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "./Layout";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchJobs = () => {
    API.get("/admin/jobs", {
      params: { page, search },
    }).then((res) => {
      setJobs(res.data.data.data);
      setLastPage(res.data.data.last_page);
    });
  };

  useEffect(() => {
    fetchJobs();
  }, [page, search]);

  return (
    <AdminLayout>

      <h4 className="mb-3">Jobs</h4>

      <input
        className="form-control mb-3"
        placeholder="Search jobs..."
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
            <th>Title</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job, i) => (
            <tr key={job.id}>
              <td>{(page - 1) * 10 + i + 1}</td>
              <td>{job.job_title}</td>
              <td>{job.location}</td>
              <td>
                <span className={`badge ${job.status === "open" ? "bg-success" : "bg-danger"}`}>
                  {job.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex gap-2">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        {[...Array(lastPage)].map((_, i) => (
          <button key={i} onClick={() => setPage(i + 1)}>{i + 1}</button>
        ))}
        <button disabled={page === lastPage} onClick={() => setPage(page + 1)}>Next</button>
      </div>

    </AdminLayout>
  );
}