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
  FaPlus,
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
          {/* ✅ FIX: Added icon fallback */}
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
              Home
            </Link>

            {/* ABOUT */}
            <Link
              to="/about"
              className={`nav-link d-flex align-items-center gap-2 ${
                isActive("/about") ? "active-green fw-semibold" : ""
              }`}
            >
              About
            </Link>

            {/* JOBS */}
            <Link
              to="/jobs"
              className={`nav-link d-flex align-items-center gap-2 ${
                isActive("/jobs") ? "active-green fw-semibold" : ""
              }`}
            >
              Jobs
            </Link>

            {/* CATEGORY */}
            <Link
              to="/category"
              className={`nav-link d-flex align-items-center gap-2 ${
                isActive("/category") ? "active-green fw-semibold" : ""
              }`}
            >
              Categories
            </Link>

            {/* CONTACT */}
            <Link
              to="/contact"
              className={`nav-link d-flex align-items-center gap-2 ${
                isActive("/contact") ? "active-green fw-semibold" : ""
              }`}
            >
              Contact
            </Link>

            {/* NOT LOGGED IN */}
            {!token && (
              <>
                <Link
                  to="/login"
                  className="nav-link d-flex align-items-center gap-2"
                >
                  Login
                </Link>

                <Link
                  to="/register/candidate"
                  className="nav-link d-flex align-items-center gap-2"
                >
                  Register
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
                    onClick={() => navigate("/logout")}
                    className="dropdown-item text-danger d-flex align-items-center gap-2"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* POST JOB BUTTON */}
          {token && role === "recruiter" ? (
            <button
              onClick={handlePostJob}
              className="btn btn-primary ms-lg-3 px-4 fw-semibold d-flex align-items-center gap-2"
              style={{ borderRadius: "30px" }}
            >
              <FaPlus /> Post Job
            </button>
          ) : (
            <div className="d-flex align-items-center gap-3 ms-lg-3">
              {/* FOR EMPLOYERS DROPDOWN */}
              <div className="dropdown">
                <button
                  className="btn border-0 fw-semibold dropdown-toggle"
                  data-bs-toggle="dropdown"
                  style={{ borderBottom: "2px solid #ff5a3c" }}
                >
                  For Recuiter
                </button>

                <div className="dropdown-menu dropdown-menu-end shadow border-0 p-2">
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/recruiter/login")}
                  >
                    Recruiter Login
                  </button>

                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/register/recruiter")}
                  >
                    Recruiter Register
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ STYLE */}
      <style>
        {`
          /* DEFAULT BLACK TEXT */
          .nav-link {
            color: #000 !important;
            transition: 0.2s;
          }

          /* ACTIVE GREEN ONLY */
          .active-green {
            color: #28a745 !important;
            font-weight: 600;
          }

          /* HOVER (SUBTLE ONLY) */
          .nav-link:hover {
            color: #000 !important;
            opacity: 0.7;
          }

          /* DROPDOWN */
          .dropdown-item {
            color: #000;
          }

          .dropdown-item:hover {
            background: #f5f7fa;
            color: #000;
          }

          /* ✅ FIX: Ensure toggler icon visible */
          .navbar-toggler {
            border: none;
          }

          .navbar-toggler:focus {
            box-shadow: none;
          }

          .dropdown-menu {
            min-width: 200px;
            border-radius: 10px;
          }

          .dropdown-item {
            padding: 10px 15px;
            font-size: 14px;
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
