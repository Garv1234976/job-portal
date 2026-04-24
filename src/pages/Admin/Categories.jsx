import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "./Layout";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";

// 🔥 ICON OPTIONS (can extend)
const ICONS = [
  "fa fa-laptop",
  "fa fa-code",
  "fa fa-briefcase",
  "fa fa-user",
  "fa fa-cogs",
  "fa fa-chart-line",
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [flatCategories, setFlatCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    parent_id: "",
    icon: "",
  });

  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  // 🔥 FETCH
  const fetchCategories = () => {
    API.get("/admin/categories", {
      params: { page, search },
    }).then((res) => {
      const data = res.data.data.data;
      setCategories(data);
      setFlatCategories(data);
      setLastPage(res.data.data.last_page);
    });
  };

  useEffect(() => {
    fetchCategories();
  }, [page, search]);

  // 🔥 MODAL OPEN
  const openModal = (cat = null) => {
    if (cat) {
      setForm({
        name: cat.name,
        parent_id: cat.parent_id || "",
        icon: cat.icon || "",
      });
      setEditId(cat.id);
    } else {
      setForm({ name: "", parent_id: "", icon: "" });
      setEditId(null);
    }
    setShowModal(true);
  };

  // 🔥 SUBMIT
  const handleSubmit = async () => {
    if (!form.name.trim()) {
      return Swal.fire("Error", "Name required", "error");
    }

    try {
      if (editId) {
        await API.put(`/admin/categories/${editId}`, form);
        Swal.fire("Updated!", "", "success");
      } else {
        await API.post("/admin/categories", form);
        Swal.fire("Added!", "", "success");
      }

      setShowModal(false);
      fetchCategories();
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  // 🔥 DELETE
  const deleteCategory = (id) => {
    Swal.fire({
      title: "Delete?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        await API.delete(`/admin/categories/${id}`);
        fetchCategories();
      }
    });
  };

  // 🔥 TREE BUILD
  const buildTree = (data, parent = null) => {
    return data
      .filter((item) => item.parent_id === parent)
      .map((item) => ({
        ...item,
        children: buildTree(data, item.id),
      }));
  };

  const tree = buildTree(categories);

  // 🔥 TREE UI
  const renderTree = (nodes, level = 0) =>
    nodes.map((node) => (
      <div key={node.id} style={{ paddingLeft: level * 20 }}>
        <strong>{node.name}</strong>
        {node.children.length > 0 && renderTree(node.children, level + 1)}
      </div>
    ));

  return (
    <AdminLayout>
      <div className="container-fluid">

        <div className="d-flex justify-content-between mb-3">
          <h4 className="fw-bold">Manage Categories</h4>
          <button className="btn btn-primary" onClick={() => openModal()}>
            + Add Category
          </button>
        </div>

        {/* SEARCH */}
        <input
          className="form-control mb-3"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* TABLE */}
        <div className="card shadow-sm mb-4">
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
              {categories.map((cat, i) => (
                <tr key={cat.id}>
                  <td>{(page - 1) * 10 + i + 1}</td>
                  <td>{cat.name}</td>
                  <td>
                    {cat.icon ? <i className={cat.icon}></i> : "-"}
                  </td>
                  <td>{cat.parent?.name || "Main"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => openModal(cat)}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* TREE VIEW */}
        <div className="card p-3 mb-4">
          <h5>Category Hierarchy</h5>
          {renderTree(tree)}
        </div>

        {/* PAGINATION */}
        <div className="d-flex justify-content-center gap-1">
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          {[...Array(lastPage)].map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                page === i + 1 ? "btn-primary" : "btn-light"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === lastPage}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>

        {/* 🔥 MODAL */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editId ? "Edit" : "Add"} Category</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <input
              className="form-control mb-2"
              placeholder="Category Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            {/* PARENT */}
            <select
              className="form-control mb-2"
              value={form.parent_id}
              onChange={(e) =>
                setForm({ ...form, parent_id: e.target.value })
              }
            >
              <option value="">Main Category</option>
              {flatCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* ICON PICKER */}
            <div className="d-flex gap-2 flex-wrap">
              {ICONS.map((ic) => (
                <div
                  key={ic}
                  className={`p-2 border ${
                    form.icon === ic ? "bg-primary text-white" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setForm({ ...form, icon: ic })}
                >
                  <i className={ic}></i>
                </div>
              ))}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    </AdminLayout>
  );
}