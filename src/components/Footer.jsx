import { useState } from "react";
import Swal from "sweetalert2";
import api from "../services/api";

function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubscribe = async () => {
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/subscribe", { email });

      Swal.fire("Success", res.data.message, "success");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
      <div className="container py-5">
        <div className="row g-5">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white mb-4">Business Buddies</h5>

            <p className="mb-2">
              <i className="fa fa-map-marker-alt me-3"></i>
              Oxford Street, Zirakpur, Punjab, India
            </p>

            <p className="mb-2">
              <i className="fa fa-envelope me-3"></i>
              info@businessbuddies.com
            </p>

            <p className="mb-2">
              <i className="fa fa-phone-alt me-3"></i>
              +91 9478391355
            </p>

            {/* Social */}
            <div className="d-flex pt-2">
              <a
                className="btn btn-outline-light btn-social"
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>

              <a
                className="btn btn-outline-light btn-social"
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>

              <a
                className="btn btn-outline-light btn-social"
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white mb-4">Useful Links</h5>
            <a className="btn btn-link text-white-50" href="/">
              Home
            </a>
            <a className="btn btn-link text-white-50" href="/about">
              About Us
            </a>
            <a className="btn btn-link text-white-50" href="/contact">
              Contact Us
            </a>
          </div>

          {/* Newsletter */}
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white mb-4">Newsletter</h5>

            <p>
              We help businesses grow with smart digital solutions, job portals,
              and modern web services.
            </p>

            <div
              className="position-relative mx-auto"
              style={{ maxWidth: "400px" }}
            >
              <input
                className={`form-control bg-transparent w-100 py-3 ps-4 pe-5 ${error ? "is-invalid" : ""}`}
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />

              <button
                type="button"
                onClick={handleSubscribe}
                className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2"
                disabled={loading}
              >
                {loading ? "..." : "Sign Up"}
              </button>
            </div>
            {error && (
              <small className="text-danger mt-2 d-block">{error}</small>
            )}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="container pt-3">
        <div className="row">
          <div className="col-12 text-center mb-3">
            © {new Date().getFullYear()}{" "}
            <span className="text-white">Business Buddies</span>, All Rights
            Reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
