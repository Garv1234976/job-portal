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

        <h1 className="text-center mb-3 wow fadeInUp">
          Contact For Any Query
        </h1>

        {/* ✅ HELP TEXT */}
        <p className="text-center text-muted mb-4">
          Need help? We're here for you! You can contact us anytime via WhatsApp,
          email, or the form below. We usually reply within 24 hours.
        </p>

        {/* ✅ WHATSAPP BUTTON */}
        <div className="text-center mb-4">
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="btn btn-success px-4 py-2"
          >
            💬 Chat on WhatsApp
          </a>
        </div>

        <div className="row g-4">

          {/* Contact Info */}
          <div className="col-12">
            <div className="row gy-4">

              <div className="col-md-4">
                <div className="d-flex align-items-center bg-light rounded p-4">
                  <div className="bg-white border rounded d-flex align-items-center justify-content-center me-3" style={{ width: "45px", height: "45px" }}>
                    <i className="fa fa-map-marker-alt text-primary"></i>
                  </div>
                  <span>123 Street, New York, USA</span>
                </div>
              </div>

              <div className="col-md-4">
                <div className="d-flex align-items-center bg-light rounded p-4">
                  <div className="bg-white border rounded d-flex align-items-center justify-content-center me-3" style={{ width: "45px", height: "45px" }}>
                    <i className="fa fa-envelope-open text-primary"></i>
                  </div>
                  <span>support@yourwebsite.com</span>
                </div>
              </div>

              <div className="col-md-4">
                <div className="d-flex align-items-center bg-light rounded p-4">
                  <div className="bg-white border rounded d-flex align-items-center justify-content-center me-3" style={{ width: "45px", height: "45px" }}>
                    <i className="fa fa-phone-alt text-primary"></i>
                  </div>
                  <span>+91 98765 43210</span>
                </div>
              </div>

            </div>
          </div>

          {/* Map */}
          <div className="col-md-6">
            <iframe
              className="position-relative rounded w-100 h-100"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd"
              style={{ minHeight: "400px", border: 0 }}
              loading="lazy"
              title="map"
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

                  {/* ✅ EXTRA TRUST TEXT */}
                  <div className="col-12">
                    <small className="text-muted">
                      🔒 Your information is safe with us
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