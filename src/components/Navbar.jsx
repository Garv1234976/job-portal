import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

//  React Icons
import {
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUser,
  FaPlus,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ✅ FIXED API CALL (safe handling)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    API.get("/dashboard")
      .then((res) => {
        console.log("PLAN DATA:", res.data); // 🔍 debug

        // ✅ handle multiple possible API structures
        const plan =
          res.data.active_plan ||
          res.data.plan ||
          res.data.data?.active_plan ||
          null;

        setActivePlan(plan);
      })
      .catch((err) => {
        console.log("PLAN ERROR:", err);
        setActivePlan(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ FIXED LOGIC (main issue solved)
  const handlePostJob = () => {
    if (loading) return; // wait for API

    console.log("ACTIVE PLAN:", activePlan); // debug

    // ❌ no plan
    if (!activePlan) {
      Swal.fire({
        icon: "warning",
        title: "No Plan Found",
        text: "Please buy a plan first",
      }).then(() => navigate("/recruiter/plans"));
      return;
    }

    // ✅ handle different key names
    const jobsRemaining =
      activePlan.jobs_remaining ??
      activePlan.job_remaining ??
      activePlan.remaining_jobs ??
      0;

    console.log("JOBS REMAINING:", jobsRemaining);

    // ❌ no jobs left
    if (jobsRemaining <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Limit Reached",
        text: "You have no jobs remaining. Upgrade your plan.",
      }).then(() => navigate("/recruiter/plans"));
      return;
    }

    // ✅ success
    navigate("/recruiter/create-job");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-2">
      <div className="container">
        {/* LOGO */}
        <Link to="/" className="navbar-brand fw-bold fs-3 text-primary">
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
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <Link
              to="/"
              className={`nav-link ${
                isActive("/") ? "active-green fw-semibold" : ""
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`nav-link ${
                isActive("/about") ? "active-green fw-semibold" : ""
              }`}
            >
              About
            </Link>

            <Link
              to="/jobs"
              className={`nav-link ${
                isActive("/jobs") ? "active-green fw-semibold" : ""
              }`}
            >
              Jobs
            </Link>

            <Link
              to="/category"
              className={`nav-link ${
                isActive("/category") ? "active-green fw-semibold" : ""
              }`}
            >
              Categories
            </Link>

            <Link
              to="/contact"
              className={`nav-link ${
                isActive("/contact") ? "active-green fw-semibold" : ""
              }`}
            >
              Contact
            </Link>

            {!token && (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register/candidate" className="nav-link">
                  Register
                </Link>
              </>
            )}

            {token && (
              <div className="nav-item dropdown ms-lg-3">
                <a
                  href="#"
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <FaUserCircle /> My Account
                </a>

                <div className="dropdown-menu dropdown-menu-end shadow border-0">
                  {role === "candidate" && (
                    <Link to="/candidate/dashboard" className="dropdown-item">
                      <FaTachometerAlt /> Dashboard
                    </Link>
                  )}

                  {role === "recruiter" && (
                    <Link to="/recruiter/dashboard" className="dropdown-item">
                      <FaTachometerAlt /> Dashboard
                    </Link>
                  )}

                  <Link to="/recruiter/profile" className="dropdown-item">
                    <FaUser /> Profile
                  </Link>

                  <div className="dropdown-divider"></div>

                  <button
                    onClick={() => navigate("/logout")}
                    className="dropdown-item text-danger"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* POST JOB */}
          {token && role === "recruiter" ? (
            <button
              onClick={handlePostJob}
              disabled={loading}
              className="btn btn-primary ms-lg-3 px-4 fw-semibold d-flex align-items-center gap-2"
              style={{ borderRadius: "30px" }}
            >
              <FaPlus /> Post Job
            </button>
          ) : (
            <div className="ms-lg-3">
              <button
                className="btn border-0 fw-semibold"
                onClick={() => navigate("/recruiter/login")}
              >
                For Recruiter
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;