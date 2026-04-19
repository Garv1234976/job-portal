import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

function Navbar() {
  const navigate = useNavigate();
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

  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
      <Link
        to="/"
        className="navbar-brand d-flex align-items-center text-center py-0 px-4 px-lg-5"
      >
        <h1 className="m-0 text-primary">JobEntry</h1>
      </Link>

      <button
        type="button"
        className="navbar-toggler me-4"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto p-4 p-lg-0">
          <Link to="/" className="nav-item nav-link active">
            Home
          </Link>
          <Link to="/about" className="nav-item nav-link">
            About
          </Link>

          <Link to="/jobs" className="dropdown-item">
            Job List
          </Link>

          <Link to="/category" className="nav-item nav-link">
            Job Category
          </Link>
          <Link to="/contact" className="nav-item nav-link">
            Contact
          </Link>

          {!token && (
            <>
              <Link to="/login" className="nav-item nav-link">
                Login
              </Link>
              <Link to="/register/candidate" className="nav-item nav-link">
                Register
              </Link>
            </>
          )}

          {token && (
            <div className="nav-item dropdown ms-3">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <i className="fa fa-user-circle me-1"></i> My Account
              </a>

              <div className="dropdown-menu dropdown-menu-end">
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

        {token && role === "recruiter" && (
          <button
            onClick={handlePostJob}
            className="btn btn-primary rounded-0 py-4 px-lg-5 d-none d-lg-block"
          >
            Post A Job <i className="fa fa-arrow-right ms-3"></i>
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
