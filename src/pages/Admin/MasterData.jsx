import { useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/Admin/AdminSidebar";

export default function MasterData() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ type: "", name: "" });
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("");

  const types = [
    "education",
    "skill",
    "language",
    "location",
    "job_title",
  ];

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
    <div className="container-fluid">
      <div className="row">

        {/* SIDEBAR */}
        <div className="col-md-3 col-lg-2">
          <AdminSidebar />
        </div>

        {/* MAIN */}
        <div className="col-md-9 col-lg-10 p-4">
          <h3 className="mb-4">Dropdown Management</h3>

          {/* FORM */}
          <div className="card p-3 mb-4 shadow-sm">
            <div className="row g-3">

              {/* TYPE */}
              <div className="col-md-4">
                <label>Category Type</label>
                <select
                  className="form-control"
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

              {/* NAME */}
              <div className="col-md-4">
                <label>Option Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  placeholder="Enter option"
                  onChange={handleChange}
                />
              </div>

              {/* BUTTON */}
              <div className="col-md-4 d-flex align-items-end">
                <button
                  className={`btn w-100 ${
                    editId ? "btn-warning" : "btn-primary"
                  }`}
                  onClick={submit}
                >
                  {editId ? "Update Option" : "Add Option"}
                </button>
              </div>

            </div>
          </div>

          {/* FILTER */}
          <div className="mb-3">
            <select
              className="form-control w-25"
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
          <div className="card shadow-sm p-3">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th width="150">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}

                {filteredList.map((item) => (
                  <tr key={item.id}>
                    <td className="text-capitalize">{item.type}</td>
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
                ))}

              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}