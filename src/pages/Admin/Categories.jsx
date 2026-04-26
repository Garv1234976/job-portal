import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "./Layout";
import Swal from "sweetalert2";

// ✅ ICON FIX FUNCTION (IMPORTANT)
const getIconClass = (icon) => {
  if (!icon) return "fa fa-briefcase";

  if (
    icon.includes("fa-solid") ||
    icon.includes("fa-regular") ||
    icon.includes("fa-brands")
  ) {
    return icon;
  }

  if (icon.startsWith("fa-")) {
    return `fa-solid ${icon}`;
  }

  if (icon.startsWith("fa ")) {
    return icon;
  }

  return "fa fa-briefcase";
};

// ICONS LIST
const ICONS = [
  "fa fa-laptop","fa fa-code","fa fa-briefcase","fa fa-user",
  "fa fa-cogs","fa fa-chart-line","fa fa-bell","fa fa-heart",
  "fa fa-star","fa fa-envelope","fa fa-globe","fa fa-camera",
  "fa fa-cloud","fa fa-lock","fa fa-unlock","fa fa-phone",
  "fa fa-map","fa fa-car","fa fa-shopping-cart","fa fa-book",
  "fa fa-graduation-cap","fa fa-building","fa fa-database",
  "fa fa-server","fa fa-wifi","fa fa-music","fa fa-video",
  "fa fa-image","fa fa-edit","fa fa-trash","fa fa-download",
  "fa fa-upload","fa fa-calendar","fa fa-clock","fa fa-search",
  // NEW MODERN ICONS
  "fa-brain","fa-robot","fa-microchip","fa-network-wired"
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

  const [iconSearch, setIconSearch] = useState("");

  // FETCH
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

  // MODAL OPEN
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

  // SUBMIT
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

  // DELETE
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

  // TREE
  const buildTree = (data, parent = null) => {
    return data
      .filter((item) => item.parent_id === parent)
      .map((item) => ({
        ...item,
        children: buildTree(data, item.id),
      }));
  };

  const tree = buildTree(categories);

  const renderTree = (nodes, level = 0) =>
    nodes.map((node) => (
      <div key={node.id} style={{ paddingLeft: level * 20 }}>
        <strong>{node.name}</strong>
        {node.children.length > 0 && renderTree(node.children, level + 1)}
      </div>
    ));

  // FILTER ICONS
  const filteredIcons = ICONS.filter((ic) =>
    ic.toLowerCase().includes(iconSearch.toLowerCase())
  );

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
                    {cat.icon ? (
                      <i className={getIconClass(cat.icon)}></i>
                    ) : "-"}
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

        {/* TREE */}
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

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h5 className="mb-3">
                {editId ? "Edit Category" : "Add Category"}
              </h5>

              <input
                className="form-control mb-2"
                placeholder="Category Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

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

              {/* ICON SEARCH */}
              <input
                className="form-control mb-2"
                placeholder="Search icon..."
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
              />

              {/* ICON LIST */}
              <div
                className="d-flex gap-2 flex-wrap mb-3"
                style={{ maxHeight: "150px", overflowY: "auto" }}
              >
                {/* OLD ICON */}
                {form.icon && !filteredIcons.includes(form.icon) && (
                  <div className="icon-box active">
                    <i className={getIconClass(form.icon)}></i>
                  </div>
                )}

                {filteredIcons.map((ic) => (
                  <div
                    key={ic}
                    className={`icon-box ${
                      form.icon === ic ? "active" : ""
                    }`}
                    onClick={() => setForm({ ...form, icon: ic })}
                  >
                    <i className={getIconClass(ic)}></i>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button className="btn btn-primary" onClick={handleSubmit}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STYLE */}
        <style>
          {`
          .icon-box {
            width: 40px;
            height: 40px;
            border: 1px solid #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 6px;
          }

          .icon-box.active {
            background: #0d6efd;
            color: #fff;
            border-color: #0d6efd;
          }
        `}
        </style>
      </div>
    </AdminLayout>
  );
}