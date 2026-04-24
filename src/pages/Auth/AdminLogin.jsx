import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Swal from "sweetalert2";
import { FaUserShield, FaLock } from "react-icons/fa";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    login_id: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.login_id || !form.password) {
      return Swal.fire("Error", "All fields are required", "error");
    }

    try {
      setLoading(true);

      const res = await API.post("/login/admin", form);

      if (res.data.status) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", "admin");

        Swal.fire("Success", "Welcome Admin", "success");

        navigate("/admin/dashboard");
      } else {
        Swal.fire("Error", res.data.message || "Login failed", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #0d6efd, #6610f2)",
      }}
    >
      <div className="card p-4 shadow-lg" style={{ width: "380px", borderRadius: "15px" }}>

        {/* HEADER */}
        <div className="text-center mb-3">
          <FaUserShield size={40} className="text-primary mb-2" />
          <h4 className="fw-bold">Admin Login</h4>
          <p className="text-muted small">Secure access to admin panel</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Admin ID</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaUserShield />
              </span>
              <input
                type="text"
                name="login_id"
                className="form-control"
                placeholder="Enter Admin ID"
                value={form.login_id}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaLock />
              </span>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            className="btn btn-primary w-100 fw-bold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* FOOTER */}
        <div className="text-center mt-3">
          <small className="text-muted">
            © Admin Panel • Secure System
          </small>
        </div>

      </div>
    </div>
  );
}