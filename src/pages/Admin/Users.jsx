import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "./Layout";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchUsers = () => {
    API.get("/admin/users", {
      params: { page, search },
    }).then((res) => {
      setUsers(res.data.data.data);
      setLastPage(res.data.data.last_page);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  return (
    <AdminLayout>

      <h4 className="mb-3">Users</h4>

      {/* SEARCH */}
      <input
        className="form-control mb-3"
        placeholder="Search users..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* TABLE */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, i) => (
            <tr key={user.id}>
              <td>{(page - 1) * 10 + i + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="d-flex gap-2">
        <button
          className="btn btn-light"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        {[...Array(lastPage)].map((_, i) => (
          <button
            key={i}
            className={`btn ${page === i + 1 ? "btn-dark" : "btn-light"}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="btn btn-light"
          disabled={page === lastPage}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

    </AdminLayout>
  );
}