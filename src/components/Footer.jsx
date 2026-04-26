import { useState, useEffect } from "react";
import api from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState(null);

  // FETCH SETTINGS
  useEffect(() => {
    api.get("/settings")
      .then((res) => setSettings(res.data.data))
      .catch(() => toast.error("Failed to load footer data ❌"));
  }, []);

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
      toast.success(res.data.message || "Subscribed successfully ✅");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  const contact = settings?.contact || {};
  const office = settings?.offices?.[0] || {};
  const social = settings?.social || {};

  // ✅ COMPANY NAME FROM ADMIN
  const companyName = office?.name || "CareerConnect";

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
        <div className="container py-5">
          <div className="row g-5">

            {/* COMPANY */}
            <div className="col-lg-4 col-md-6">

              {/* ✅ DYNAMIC COMPANY NAME */}
              <h5 className="text-white fw-bold mb-1">
                {companyName}
              </h5>

              <small className="text-muted d-block mb-3">
                Connecting Talent with Opportunity
              </small>

              {/* ADDRESS */}
              <p className="mb-2">
                <i className="fa fa-map-marker-alt me-3"></i>
                {office.address || "No address"}
              </p>

              {/* EMAILS */}
              {contact.email_1 && (
                <p className="mb-2">
                  <i className="fa fa-envelope me-3"></i>
                  {contact.email_1}
                </p>
              )}

              {contact.email_2 && (
                <p className="mb-2">
                  <i className="fa fa-envelope me-3"></i>
                  {contact.email_2}
                </p>
              )}

              {/* PHONES */}
              {contact.phone_1 && (
                <p className="mb-2">
                  <i className="fa fa-phone-alt me-3"></i>
                  +91 {contact.phone_1}
                </p>
              )}

              {contact.phone_2 && (
                <p className="mb-2">
                  <i className="fa fa-phone-alt me-3"></i>
                  +91 {contact.phone_2}
                </p>
              )}

              {/* SOCIAL */}
              <div className="d-flex pt-2">

                {social.facebook && (
                  <a className="btn btn-outline-light btn-social" href={social.facebook} target="_blank" rel="noreferrer">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                )}

                {social.linkedin && (
                  <a className="btn btn-outline-light btn-social" href={social.linkedin} target="_blank" rel="noreferrer">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                )}

                {social.instagram && (
                  <a className="btn btn-outline-light btn-social" href={social.instagram} target="_blank" rel="noreferrer">
                    <i className="fab fa-instagram"></i>
                  </a>
                )}

              </div>
            </div>

            {/* LINKS */}
            <div className="col-lg-4 col-md-6">
              <h5 className="text-white mb-4">Useful Links</h5>
              <a className="btn btn-link text-white-50" href="/">Home</a>
              <a className="btn btn-link text-white-50" href="/about">About</a>
              <a className="btn btn-link text-white-50" href="/contact">Contact</a>
            </div>

            {/* NEWSLETTER */}
            <div className="col-lg-4 col-md-6">
              <h5 className="text-white mb-4">Newsletter</h5>

              <p>Subscribe to get latest jobs and updates.</p>

              <div className="position-relative mx-auto" style={{ maxWidth: "400px" }}>
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
                  {loading ? "..." : "Subscribe"}
                </button>
              </div>

              {error && (
                <small className="text-danger mt-2 d-block">
                  {error}
                </small>
              )}
            </div>

          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="container pt-3">
          <div className="row">
            <div className="col-12 text-center mb-3">
              © {new Date().getFullYear()}{" "}
              <span className="text-white fw-bold">
                {companyName}
              </span>, All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;