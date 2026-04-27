import { useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/Admin/AdminSidebar";

export default function MasterData() {
  const [list, setList] = useState([]);
  const [parents, setParents] = useState([]);
  const [form, setForm] = useState({
    type: "",
    name: "",
    parent_id: ""
  });
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("");

  const types = ["education", "skill", "language", "location", "job_title"];

  // 🔥 FETCH DATA
  const fetchData = () => {
    API.get("/admin/master-data").then((res) => {
      const data = res.data.data || [];
      setList(data);

      // 👇 get only parent items
      const parentItems = data.filter((item) => !item.parent_id);
      setParents(parentItems);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // HANDLE CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT
  const submit = async () => {
    if (!form.type || !form.name) {
      return Swal.fire("Error", "All fields required", "error");
    }

    try {
      if (editId) {
        await API.put(`/admin/master-data/${editId}`, form);
        Swal.fire("Updated", "", "success");
      } else {
        await API.post("/admin/master-data", form);
        Swal.fire("Added", "", "success");
      }

      setForm({ type: "", name: "", parent_id: "" });
      setEditId(null);
      fetchData();
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  // DELETE
  const remove = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete?",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    await API.delete(`/admin/master-data/${id}`);
    fetchData();
  };

  // EDIT
  const edit = (item) => {
    setForm({
      type: item.type,
      name: item.name,
      parent_id: item.parent_id || ""
    });
    setEditId(item.id);
  };

  // FILTER
  const filteredList = filter
    ? list.filter((item) => item.type === filter)
    : list;

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f4f6f9" }}>
      
      <AdminSidebar />

      <div className="flex-grow-1 p-4">

        {/* HEADER */}
        <div className="mb-4">
          <h3 className="fw-bold">Dropdown Management</h3>
          <p className="text-muted">Manage hierarchy like Graduate → BCA</p>
        </div>

        {/* FORM */}
        <div className="card p-4 shadow-sm rounded-4 mb-4">
          <div className="row g-3">

            {/* TYPE */}
            <div className="col-md-3">
              <label>Type</label>
              <select
                className="form-control"
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {types.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* PARENT */}
            <div className="col-md-3">
              <label>Parent (Optional)</label>
              <select
                className="form-control"
                name="parent_id"
                value={form.parent_id}
                onChange={handleChange}
              >
                <option value="">Main Category</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* NAME */}
            <div className="col-md-3">
              <label>Name</label>
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            {/* BUTTON */}
            <div className="col-md-3 d-flex align-items-end">
              <button
                className={`btn w-100 ${
                  editId ? "btn-warning" : "btn-success"
                }`}
                onClick={submit}
              >
                {editId ? "Update" : "Add"}
              </button>
            </div>

          </div>
        </div>

        {/* TABLE */}
        <div className="card shadow-sm p-3 rounded-4">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Parent</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredList.map((item) => {
                const parent = list.find((p) => p.id === item.parent_id);

                return (
                  <tr key={item.id}>
                    <td>{item.type}</td>
                    <td>{parent ? parent.name : "-"}</td>
                    <td>{item.name}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => edit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => remove(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}