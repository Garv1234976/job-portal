import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "./Layout";
import Swal from "sweetalert2";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [editId, setEditId] = useState(null);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchCategories = () => {
    API.get("/admin/categories", {
      params: { page, search },
    }).then((res) => {
      setCategories(res.data.data.data);
      setLastPage(res.data.data.last_page);
    });
  };

  useEffect(() => {
    fetchCategories();
  }, [page, search]);

  // ✅ ADD / UPDATE
  const handleSubmit = async () => {
    if (!name) {
      return Swal.fire("Error", "Name required", "error");
    }

    if (editId) {
      await API.put(`/admin/categories/${editId}`, { name, icon });
      Swal.fire("Updated!", "", "success");
    } else {
      await API.post("/admin/categories", { name, icon });
      Swal.fire("Added!", "", "success");
    }

    setName("");
    setIcon("");
    setEditId(null);
    fetchCategories();
  };

  // ✅ DELETE
  const deleteCategory = (id) => {
    Swal.fire({
      title: "Delete?",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        await API.delete(`/admin/categories/${id}`);
        fetchCategories();
      }
    });
  };

  // ✅ EDIT
  const editCategory = (cat) => {
    setName(cat.name);
    setIcon(cat.icon || "");
    setEditId(cat.id);
  };

  return (
    <AdminLayout>

      <div className="container-fluid">

        <h4 className="mb-4 fw-bold">Manage Categories</h4>

        {/* 🔍 SEARCH */}
        <input
          className="form-control mb-3"
          placeholder="Search category..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* ➕ ADD / EDIT */}
        <div className="card p-3 mb-4 shadow-sm">
          <div className="row g-2">
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="Icon (fa fa-...)"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <button className="btn btn-primary w-100" onClick={handleSubmit}>
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>

        {/* 📋 TABLE */}
        <div className="card shadow-sm">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Icon</th>
                <th>Parent</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {categories.length > 0 ? (
                categories.map((cat, i) => (
                  <tr key={cat.id}>
                    <td>{(page - 1) * 10 + i + 1}</td>

                    <td>{cat.name}</td>

                    <td>
                      {cat.icon ? (
                        <i className={cat.icon}></i>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>{cat.parent?.name || "Main"}</td>

                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => editCategory(cat)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteCategory(cat.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-3">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📄 PAGINATION */}
        <div className="d-flex justify-content-between align-items-center mt-3">

          {/* PREV */}
          <button
            className="btn btn-outline-secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          {/* PAGES */}
          <div>
            {[...Array(lastPage)].map((_, i) => (
              <button
                key={i}
                className={`btn mx-1 ${
                  page === i + 1 ? "btn-dark" : "btn-light"
                }`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* NEXT */}
          <button
            className="btn btn-outline-secondary"
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