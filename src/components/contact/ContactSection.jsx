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

  // ✅ Handle input change
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

      // Reset form
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
    <div className="col-md-6">
      <div className="wow fadeInUp" data-wow-delay="0.5s">

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
  );
}

export default ContactSection;