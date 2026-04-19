import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => {
        setActivePlan(res.data.active_plan);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePostJob = () => {
    if (!activePlan || activePlan.jobs_remaining <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Plan Required",
        text: "Please buy or upgrade your plan",
      }).then(() => {
        navigate("/recruiter/plans");
      });
    } else {
      navigate("/recruiter/create-job");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ✅ ACTIVE LINK
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top py-2">
      <div className="container">

        {/* LOGO */}
        <Link
          to="/"
          className="navbar-brand fw-bold fs-3 text-primary"
        >
          JobEntry
        </Link>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarCollapse">

          {/* LEFT MENU */}
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">

            <Link to="/" className={`nav-link ${isActive("/") ? "active fw-semibold text-primary" : ""}`}>
              Home
            </Link>

            <Link to="/about" className={`nav-link ${isActive("/about") ? "active fw-semibold text-primary" : ""}`}>
              About
            </Link>

            <Link to="/jobs" className={`nav-link ${isActive("/jobs") ? "active fw-semibold text-primary" : ""}`}>
              Jobs
            </Link>

            <Link to="/category" className={`nav-link ${isActive("/category") ? "active fw-semibold text-primary" : ""}`}>
              Categories
            </Link>

            <Link to="/contact" className={`nav-link ${isActive("/contact") ? "active fw-semibold text-primary" : ""}`}>
              Contact
            </Link>

            {/* AUTH */}
            {!token && (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register/candidate" className="btn btn-outline-primary ms-2 px-3">
                  Register
                </Link>
              </>
            )}

            {/* USER DROPDOWN */}
            {token && (
              <div className="nav-item dropdown ms-lg-3">

                <a
                  href="#"
                  className="nav-link dropdown-toggle d-flex align-items-center gap-1"
                  data-bs-toggle="dropdown"
                >
                  <i className="fa fa-user-circle fs-5"></i>
                  <span>My Account</span>
                </a>

                <div className="dropdown-menu dropdown-menu-end shadow border-0">

                  {/* ROLE BASED LINKS */}
                  {role === "candidate" && (
                    <Link to="/candidate/dashboard" className="dropdown-item">
                      📊 Dashboard
                    </Link>
                  )}

                  {role === "recruiter" && (
                    <Link to="/recruiter/dashboard" className="dropdown-item">
                      📊 Dashboard
                    </Link>
                  )}

                  <Link to="/profile" className="dropdown-item">
                    👤 Profile
                  </Link>

                  <div className="dropdown-divider"></div>

                  <button
                    onClick={handleLogout}
                    className="dropdown-item text-danger"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT BUTTON */}
          {token && role === "recruiter" && (
            <button
              onClick={handlePostJob}
              className="btn btn-primary ms-lg-3 px-4 fw-semibold"
              style={{ borderRadius: "30px" }}
            >
              + Post Job
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;