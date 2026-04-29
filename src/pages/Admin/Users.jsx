return (
  <AdminLayout>
    <div className="container-fluid">

      <h4 className="mb-3">Users</h4>

      {/* SEARCH */}
      <div className="row mb-3">
        <div className="col-12 col-md-6 col-lg-4">
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

      {/* TABLE (RESPONSIVE FIX) */}
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
            {users.length > 0 ? (
              users.map((user, i) => (
                <tr key={user.id}>
                  <td>{(page - 1) * 10 + i + 1}</td>
                  <td className="fw-semibold">{user.name}</td>
                  <td className="text-break">{user.email}</td>
                  <td>
                    <span className="badge bg-primary">
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
              page === i + 1 ? "btn-primary" : "btn-outline-secondary"
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