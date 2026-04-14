import { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");

      setForm({
        name: res.data.data.name || "",
        email: res.data.data.email || "",
        phone: res.data.data.phone || "",
        bio: res.data.data.bio || "",
      });

      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await API.post("/update-profile", form);

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: res.data.message,
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/"), 1500);
    } catch {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-lg-8">

          {/* PROFILE HEADER */}
          <div className="card shadow mb-4">
            <div className="card-body d-flex align-items-center">

              <img
                src="/assets/img/default.png"
                alt="profile"
                style={{ width: "80px", height: "80px" }}
                className="rounded-circle me-3"
              />

              <div>
                <h4 className="mb-1">{form.name}</h4>
                <p className="text-muted mb-0">{form.email}</p>
              </div>

            </div>
          </div>

          {/* BASIC INFO */}
          <div className="card shadow mb-4">
            <div className="card-body">

              <h5 className="mb-3">Basic Information</h5>

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
                <input className="form-control" value={form.email} disabled />
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

            </div>
          </div>

          {/* ABOUT */}
          <div className="card shadow mb-4">
            <div className="card-body">

              <h5 className="mb-3">About</h5>

              <textarea
                className="form-control"
                rows="4"
                placeholder="Write about yourself..."
                value={form.bio}
                onChange={(e) =>
                  setForm({ ...form, bio: e.target.value })
                }
              />

            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="text-center">
            <button
              className="btn btn-primary px-5 py-2"
              onClick={handleUpdate}
            >
              Save Changes
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;