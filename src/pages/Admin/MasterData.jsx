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

  //  FETCH DATA
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

  //  HANDLE CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //  ADD / UPDATE
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

  //  DELETE
  const remove = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    await API.delete(`/admin/master-data/${id}`);
    Swal.fire("Deleted", "Option removed", "success");
    fetchData();
  };

  //  EDIT
  const edit = (item) => {
    setForm({
      type: item.type,
      name: item.name,
    });
    setEditId(item.id);
  };

  //  FILTERED LIST
  const filteredList = filter
    ? list.filter((item) => item.type === filter)
    : list;

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="row">
        {/* SIDEBAR */}
        <div className="col-md-3 col-lg-2 p-0">
          <AdminSidebar />
        </div>

        {/* MAIN */}
        <div className="col-md-9 col-lg-10 p-4">
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold">Dropdown Management</h4>
            <span className="text-muted small">
              Manage all dropdown options
            </span>
          </div>

          {/* FORM CARD */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <div className="row g-3">
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

              <div className="col-md-4 d-flex align-items-end">
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

          {/* FILTER */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-semibold mb-0">All Options</h6>

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

          {/* TABLE CARD */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4">Type</th>
                    <th>Name</th>
                    <th className="text-center">Action</th>
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
                      <td className="ps-4 fw-semibold text-capitalize">
                        {item.type}
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
    </div>
  );
}
