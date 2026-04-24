import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "./Layout";
import Swal from "sweetalert2";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchCategories = () => {
    API.get("/admin/categories", {
      params: { page },
    }).then((res) => {
      setCategories(res.data.data.data);
      setLastPage(res.data.data.last_page);
    });
  };

  useEffect(() => {
    fetchCategories();
  }, [page]);

  // ✅ ADD CATEGORY
  const addCategory = async () => {
    if (!name) return;

    await API.post("/admin/categories", { name });

    setName("");
    fetchCategories();
  };

  // ✅ DELETE
  const deleteCategory = async (id) => {
    await API.delete(`/admin/categories/${id}`);
    fetchCategories();
  };

  return (
    <AdminLayout>

      <h4 className="mb-3">Categories</h4>

      {/* ADD */}
      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addCategory}>
          Add
        </button>
      </div>

      {/* TABLE */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Parent</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat, i) => (
            <tr key={cat.id}>
              <td>{i + 1}</td>
              <td>{cat.name}</td>
              <td>{cat.parent?.name || "Main"}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteCategory(cat.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="d-flex gap-2">
        {[...Array(lastPage)].map((_, i) => (
          <button key={i} onClick={() => setPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>

    </AdminLayout>
  );
}