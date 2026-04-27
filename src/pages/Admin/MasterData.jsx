import { useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/Admin/AdminSidebar";

export default function MasterData() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ type: "", name: "" });
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("");

  const types = ["education", "skill", "language", "location", "job_title"];

  const fetchData = () => {
    API.get("/admin/master-data")
      .then((res) => {
        setList(res.data.data || []);
      })
      .catch(() => {
        Swal.fire("Error", "Failed to load data", "error");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!form.type || !form.name) {
      return Swal.fire("Error", "All fields required", "error");
    }

    try {
      if (editId) {
        await API.put(`/admin/master-data/${editId}`, form);
        Swal.fire("Updated", "Option updated", "success");
      } else {
        await API.post("/admin/master-data", form);
        Swal.fire("Added", "Option added", "success");
      }

      setForm({ type: "", name: "" });
      setEditId(null);
      fetchData();
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const remove = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    await API.delete(`/admin/master-data/${id}`);
    Swal.fire("Deleted", "", "success");
    fetchData();
  };

  const edit = (item) => {
    setForm({ type: item.type, name: item.name });
    setEditId(item.id);
  };

  const filteredList = filter
    ? list.filter((item) => item.type === filter)
    : list;

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f4f6f9" }}>
      
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 p-4">

        {/* HEADER */}
        <div className="mb-4">
          <h3 className="fw-bold">Dropdown Management</h3>
          <p className="text-muted">Manage all dropdown options from here</p>
        </div>

        {/* FORM CARD */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <div className="row g-3 align-items-end">

            <div className="col-md-4">
              <label className="form-label fw-semibold">Category Type</label>
              <select
                className="form-control rounded-3"
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                {types.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Option Name</label>
              <input
                className="form-control rounded-3"
                name="name"
                placeholder="Enter option"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <button
                className={`btn w-100 rounded-3 fw-semibold ${
                  editId ? "btn-warning" : "btn-success"
                }`}
                onClick={submit}
              >
                {editId ? "Update Option" : "Add Option"}
              </button>
            </div>

          </div>
        </div>

        {/* FILTER + TITLE */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-semibold mb-0">All Options</h5>

          <select
            className="form-control w-auto rounded-3"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="card border-0 shadow-sm rounded-4">
          <div className="table-responsive">

            <table className="table align-middle mb-0">
              <thead style={{ background: "#f1f3f5" }}>
                <tr>
                  <th className="ps-4">Type</th>
                  <th>Name</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-muted">
                      No data found
                    </td>
                  </tr>
                )}

                {filteredList.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4 text-capitalize fw-semibold">
                      <span className="badge bg-light text-dark px-3 py-2">
                        {item.type}
                      </span>
                    </td>

                    <td>{item.name}</td>

                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => edit(item)}
                      >
                        ✏ Edit
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(item.id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
}