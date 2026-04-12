import { useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";

function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const submitContact = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/contact-submit", formData);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
      });
    }

    setLoading(false);
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <h4 className="text-center text-primary mb-3">
          Contact For Any Query
        </h4>

        <p className="text-center text-muted mb-4">
          Need help? We're here for you! Contact us via WhatsApp, email, or the form below.
          We usually reply within 24 hours.
        </p>

        <div className="row g-4">
          <div className="col-12">
            <div className="row gy-4">

              <div className="col-md-4">
                <div className="d-flex align-items-center bg-light rounded p-4">
                  <div
                    className="bg-white border rounded d-flex align-items-center justify-content-center me-3"
                    style={{ width: "45px", height: "45px" }}
                  >
                    <i className="fa fa-map-marker-alt text-primary"></i>
                  </div>
                  <span>
                    <strong>Oxford Street</strong>, Zirakpur, Punjab, India
                  </span>
                </div>
              </div>

              <div className="col-md-4">
                <div className="d-flex align-items-center bg-light rounded p-4">
                  <div
                    className="bg-white border rounded d-flex align-items-center justify-content-center me-3"
                    style={{ width: "45px", height: "45px" }}
                  >
                    <i className="fa fa-envelope-open text-primary"></i>
                  </div>
                  <span>info@dummy.com</span>
                </div>
              </div>

              <div className="col-md-4">
                <div className="d-flex align-items-center bg-light rounded p-4">
                  <div
                    className="bg-white border rounded d-flex align-items-center justify-content-center me-3"
                    style={{ width: "45px", height: "45px" }}
                  >
                    <i className="fa fa-phone-alt text-primary"></i>
                  </div>
                  <span>
                    <a
                      href="https://wa.me/919478391355"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-success px-4 py-2"
                    >
                      Chat on WhatsApp
                    </a>
                  </span>
                </div>
              </div>

            </div>
          </div>

          <div className="col-md-6">
            <iframe
              className="position-relative rounded w-100 h-100"
              src="https://www.google.com/maps?q=Oxford+Street+Zirakpur+Punjab&output=embed"
              style={{ minHeight: "400px", border: 0 }}
              loading="lazy"
              title="Zirakpur Map"
            ></iframe>
          </div>

          {/* Form */}
          <div className="col-md-6">
            <div className="wow fadeInUp">
              <form onSubmit={submitContact}>
                <div className="row g-3">

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      <label>Your Name</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <label>Your Email</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                      <label>Subject</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-floating">
                      <textarea
                        className="form-control"
                        id="message"
                        placeholder="Message"
                        style={{ height: "150px" }}
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>
                      <label>Message</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <small className="text-muted">
                       Your information is safe with us
                    </small>
                  </div>

                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100 py-3"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ContactSection;