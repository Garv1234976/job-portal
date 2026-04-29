import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "./Layout";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = () => {
    setLoading(true);

    API.get("/admin/users", {
      params: { page, search },
    })
      .then((res) => {
        setUsers(res.data.data.data);
        setLastPage(res.data.data.last_page);
      })
      .catch(() => {
        setUsers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  return (
    <AdminLayout>
      <div className="container-fluid">

        {/* HEADER */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <h4 className="mb-2 mb-md-0">Users</h4>

          {/* SEARCH */}
          <div style={{ maxWidth: "300px", width: "100%" }}>
            <input
              className="form-control"
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user, i) => (
                  <tr key={user.id}>
                    <td>{(page - 1) * 10 + i + 1}</td>

                    <td className="fw-semibold text-nowrap">
                      {user.name}
                    </td>

                    <td className="text-break">
                      {user.email}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          user.role === "admin"
                            ? "bg-danger"
                            : "bg-primary"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">

          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          {[...Array(lastPage)].map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                page === i + 1
                  ? "btn-primary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === lastPage}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>

      </div>
    </AdminLayout>
  );
}