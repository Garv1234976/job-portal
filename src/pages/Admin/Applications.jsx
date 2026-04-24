import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "./Layout";

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchApps = () => {
    API.get("/admin/applications", {
      params: { page, search },
    }).then((res) => {
      setApps(res.data.data.data);
      setLastPage(res.data.data.last_page);
    });
  };

  useEffect(() => {
    fetchApps();
  }, [page, search]);

  return (
    <AdminLayout>

      <h4 className="mb-3">Applications</h4>

      <input
        className="form-control mb-3"
        placeholder="Search..."
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
            <th>Candidate</th>
            <th>Job</th>
          </tr>
        </thead>

        <tbody>
          {apps.map((app, i) => (
            <tr key={app.id}>
              <td>{(page - 1) * 10 + i + 1}</td>
              <td>{app.user?.name}</td>
              <td>{app.job?.job_title}</td>
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