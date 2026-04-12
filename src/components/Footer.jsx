import { useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";

function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      Swal.fire("Error", "Please enter email", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/subscribe", { email });

      Swal.fire("Success", res.data.message, "success");
      setEmail("");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
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

            <p>
              We help businesses grow with smart digital solutions, job portals,
              and modern web services.
            </p>

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

          {/* Useful Links */}
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white mb-4">Useful Links</h5>

            <a className="btn btn-link text-white-50" href="/about">
              About Us
            </a>
            <a className="btn btn-link text-white-50" href="/contact">
              Contact Us
            </a>
            <a className="btn btn-link text-white-50" href="#">
              Services
            </a>
            <a className="btn btn-link text-white-50" href="#">
              Privacy Policy
            </a>
            <a className="btn btn-link text-white-50" href="#">
              Terms & Condition
            </a>
          </div>

          {/* Newsletter */}
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white mb-4">Newsletter</h5>

            <p>
              Subscribe to get updates about jobs, services, and offers.
            </p>

            <div
              className="position-relative mx-auto"
              style={{ maxWidth: "400px" }}
            >
              <input
                className="form-control bg-transparent w-100 py-3 ps-4 pe-5"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <small className="text-muted mt-2 d-block">
              🔒 We respect your privacy. No spam.
            </small>
          </div>

        </div>
      </div>

      {/* Bottom Section */}
      <div className="container border-top border-secondary pt-3">
        <div className="row">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            © {new Date().getFullYear()}{" "}
            <span className="text-white">Business Buddies</span>, All Rights Reserved.
          </div>

          <div className="col-md-6 text-center text-md-end">
            <div className="footer-menu">
              <a href="/">Home</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;