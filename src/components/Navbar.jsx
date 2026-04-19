import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

// ✅ React Icons
import {
  FaHome,
  FaInfoCircle,
  FaList,
  FaThLarge,
  FaEnvelope,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUser,
  FaPlus
} from "react-icons/fa";

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

  // ✅ ACTIVE CHECK
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top py-2">
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

            {/* HOME */}
            <Link
              to="/"
              className={`nav-link d-flex align-items-center gap-2 ${
                isActive("/") ? "active-green fw-semibold" : ""
              }`}
            >
              <FaHome /> Home
            </Link>

            {/* ABOUT */}
            <Link
              to="/about"
              className={`nav-link d-flex align-items-center gap-2 ${
                isActive("/about") ? "active-green fw-semibold" : ""
              }`}
            >
              <FaInfoCircle /> About
            </Link>

            {/* JOBS */}
            <Link
              to="/jobs"
              className={`nav-link d-flex align-items-center gap-2 ${
                isActive("/jobs") ? "active-green fw-semibold" : ""
              }`}
            >
              <FaList /> Jobs
            </Link>

            {/* CATEGORY */}
            <Link
              to="/category"
              className={`nav-link d-flex align-items-center gap-2 ${
                isActive("/category") ? "active-green fw-semibold" : ""
              }`}
            >
              <FaThLarge /> Categories
            </Link>

            {/* CONTACT */}
            <Link
              to="/contact"
              className={`nav-link d-flex align-items-center gap-2 ${
                isActive("/contact") ? "active-green fw-semibold" : ""
              }`}
            >
              <FaEnvelope /> Contact
            </Link>

            {/* NOT LOGGED IN */}
            {!token && (
              <>
                <Link to="/login" className="nav-link">
                  <FaUser /> Login
                </Link>

                <Link
                  to="/register/candidate"
                  className="btn btn-outline-primary ms-2 px-3 d-flex align-items-center gap-2"
                >
                  <FaUser /> Register
                </Link>
              </>
            )}

            {/* USER DROPDOWN */}
            {token && (
              <div className="nav-item dropdown ms-lg-3">

                <a
                  href="#"
                  className="nav-link dropdown-toggle d-flex align-items-center gap-2"
                  data-bs-toggle="dropdown"
                >
                  <FaUserCircle /> My Account
                </a>

                <div className="dropdown-menu dropdown-menu-end shadow border-0">

                  {/* DASHBOARD */}
                  {role === "candidate" && (
                    <Link
                      to="/candidate/dashboard"
                      className="dropdown-item d-flex align-items-center gap-2"
                    >
                      <FaTachometerAlt /> Dashboard
                    </Link>
                  )}

                  {role === "recruiter" && (
                    <Link
                      to="/recruiter/dashboard"
                      className="dropdown-item d-flex align-items-center gap-2"
                    >
                      <FaTachometerAlt /> Dashboard
                    </Link>
                  )}

                  {/* PROFILE */}
                  <Link
                    to="/profile"
                    className="dropdown-item d-flex align-items-center gap-2"
                  >
                    <FaUser /> Profile
                  </Link>

                  <div className="dropdown-divider"></div>

                  {/* LOGOUT */}
                  <button
                    onClick={handleLogout}
                    className="dropdown-item text-danger d-flex align-items-center gap-2"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* POST JOB BUTTON */}
          {token && role === "recruiter" && (
            <button
              onClick={handlePostJob}
              className="btn btn-primary ms-lg-3 px-4 fw-semibold d-flex align-items-center gap-2"
              style={{ borderRadius: "30px" }}
            >
              <FaPlus /> Post Job
            </button>
          )}
        </div>
      </div>

      {/* ✅ STYLE */}
      <style>
        {`
          .active-green {
            color: #28a745 !important;
          }

          .nav-link {
            transition: 0.2s;
          }

          .nav-link:hover {
            color: #28a745 !important;
          }

          .dropdown-item:hover {
            background: #f5f7fa;
          }
        `}
      </style>
    </nav>
  );
}

export default Navbar;