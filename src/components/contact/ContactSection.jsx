import { useState, useEffect } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";

function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  //  FETCH SETTINGS
  useEffect(() => {
    API.get("/admin/settings")
      .then((res) => {
        setSettings(res.data.data);
      })
      .catch(() => {
        toast.error("Failed to load contact info ❌");
      });
  }, []);

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

      toast.success(res.data.message);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  const contact = settings?.contact || {};
  const office = settings?.offices?.[0] || {};

  return (
    <div className="container-xxl py-5">
      <div className="container">

        <h4 className="text-center text-primary mb-3">
          Contact For Any Query
        </h4>

        <p className="text-center text-muted mb-4">
          Need help? We're here for you! Contact us anytime.
        </p>

        <div className="row g-4">

          {/* CONTACT CARDS */}
          <div className="col-12">
            <div className="row gy-4">

              {/* ADDRESS */}
              <div className="col-md-4">
                <div className="d-flex align-items-center bg-light rounded p-4">
                  <div className="icon-box">
                    <i className="fa fa-map-marker-alt text-primary"></i>
                  </div>
                  <span>
                    {office.address || "No address added"}
                  </span>
                </div>
              </div>

              {/* EMAIL */}
              <div className="col-md-4">
                <div className="d-flex align-items-center bg-light rounded p-4">
                  <div className="icon-box">
                    <i className="fa fa-envelope-open text-primary"></i>
                  </div>
                  <span>
                    {contact.email_1 || "No email"}
                  </span>
                </div>
              </div>

              {/* PHONE / WHATSAPP */}
              <div className="col-md-4">
                <div className="d-flex align-items-center bg-light rounded p-4">
                  <div className="icon-box">
                    <i className="fa fa-phone-alt text-primary"></i>
                  </div>

                  {contact.phone_1 ? (
                    <a
                      href={`https://wa.me/91${contact.phone_1}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-success px-3 py-2"
                    >
                      Chat on WhatsApp
                    </a>
                  ) : (
                    <span>No phone</span>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* MAP */}
          <div className="col-md-6">
            <iframe
              className="rounded w-100"
              src={office.map || ""}
              style={{ minHeight: "400px", border: 0 }}
              loading="lazy"
              title="Map"
            ></iframe>
          </div>

          {/* FORM */}
          <div className="col-md-6">
            <form onSubmit={submitContact}>
              <div className="row g-3">

                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <textarea
                    className="form-control"
                    id="message"
                    placeholder="Message"
                    style={{ height: "150px" }}
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
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

      {/* STYLE */}
      <style>{`
        .icon-box {
          width: 45px;
          height: 45px;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
        }
      `}</style>

    </div>
  );
}

export default ContactSection;