import { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

function Profile() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");

      setUser(res.data.data);
      setForm({
        name: res.data.data.name || "",
        email: res.data.data.email || "",
        phone: res.data.data.phone || "",
      });

      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await API.post("/update-profile", form);

      Swal.fire("Success", res.data.message, "success");
    } catch (err) {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container py-5">

      <div className="row justify-content-center">
        <div className="col-md-6">

          <div className="card shadow">
            <div className="card-body">

              <h4 className="mb-4 text-center">My Profile</h4>

              <div className="mb-3">
                <label>Name</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <label>Email</label>
                <input
                  className="form-control"
                  value={form.email}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label>Phone</label>
                <input
                  className="form-control"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </div>

              <button
                className="btn btn-primary w-100"
                onClick={handleUpdate}
              >
                Update Profile
              </button>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Profile;