import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

export default function RecruiterRegistration() {
  const [form, setForm] = useState({
    email: "",
    contact: "",
    altContact: "",
    company_name: "",
    address: "",
    profession: "",
    employerName: "",
    position: "",
    since: "",
  });

  const navigate = useNavigate();
  const [logo, setLogo] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [preview, setPreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔹 Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // 🔹 File Handling (ONLY ADDED VALIDATION)
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    if (name === "logo") {
      // ✅ ONLY IMAGE
      const allowed = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowed.includes(file.type)) {
        setErrors({ ...errors, logo: "Only JPG, JPEG, PNG allowed" });
        return;
      }

      setLogo(file);
      setPreview(URL.createObjectURL(file));
      setErrors({ ...errors, logo: "" });
    }

    if (name === "documents") {
      // ✅ ONLY DOC/PDF
      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowed.includes(file.type)) {
        Swal.fire("Error", "Only PDF, DOC, DOCX allowed", "error");
        return;
      }

      setDocuments(file);
    }
  };

  // 🔹 Validation (UNCHANGED except altContact)
  const validate = () => {
    let newErrors = {};

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email";

    if (!form.contact) newErrors.contact = "Contact required";
    else if (!/^[0-9]{10}$/.test(form.contact))
      newErrors.contact = "Must be 10 digits";

    // ✅ Added (not removing anything)
    if (form.altContact && !/^[0-9]{10}$/.test(form.altContact))
      newErrors.altContact = "Must be 10 digits";

    if (!form.company_name) newErrors.company_name = "Company name required";
    if (!form.address) newErrors.address = "Address required";

    if (!logo) newErrors.logo = "Logo required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    if (logo) formData.append("logo", logo);
    if (documents) formData.append("documents", documents);

    try {
      setLoading(true);

      const res = await api.post("/register/recruiter", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      sessionStorage.setItem("login_id", res.data.login_id);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Registered Successfully\nYour Login ID: " + res.data.login_id,
        timer: 1500,
        showConfirmButton: false,
      });

      // ✅ ONLY CHANGE HERE (redirect)
      setTimeout(() => {
        navigate("/login/recruiter");
      }, 1500);

    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">

        <h2 className="text-center text-success mb-4">
          <b>Recruiter Registration</b>
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="row">

            {/* Email */}
            <div className="col-md-6 mb-3">
              <label>Email <span className="text-danger">*</span></label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email && "is-invalid"}`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.email}</div>
            </div>

            {/* Contact */}
            <div className="col-md-6 mb-3">
              <label>Contact <span className="text-danger">*</span></label>
              <input
                type="tel"
                inputMode="numeric"
                name="contact"
                maxLength="10"
                className={`form-control ${errors.contact && "is-invalid"}`}
                onChange={(e) =>
                  /^[0-9]*$/.test(e.target.value) && handleChange(e)
                }
              />
              <div className="invalid-feedback">{errors.contact}</div>
            </div>

            {/* Alt Contact */}
            <div className="col-md-6 mb-3">
              <label>Alternative Contact</label>
              <input
                type="tel"
                inputMode="numeric"
                name="altContact"
                maxLength="10"
                className={`form-control ${errors.altContact && "is-invalid"}`}
                onChange={(e) =>
                  /^[0-9]*$/.test(e.target.value) && handleChange(e)
                }
              />
              <div className="invalid-feedback">{errors.altContact}</div>
            </div>

            {/* Company Name */}
            <div className="col-md-6 mb-3">
              <label>Company Name <span className="text-danger">*</span></label>
              <input
                type="text"
                name="company_name"
                className={`form-control ${errors.company_name && "is-invalid"}`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.company_name}</div>
            </div>

            {/* Address */}
            <div className="col-md-6 mb-3">
              <label>Address <span className="text-danger">*</span></label>
              <input
                type="text"
                name="address"
                className={`form-control ${errors.address && "is-invalid"}`}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.address}</div>
            </div>

            {/* Profession */}
            <div className="col-md-6 mb-3">
              <label>Profession</label>
              <input
                type="text"
                name="profession"
                className="form-control"
                onChange={handleChange}
              />
            </div>

            {/* Employer Name */}
            <div className="col-md-6 mb-3">
              <label>Employer Name</label>
              <input
                type="text"
                name="employerName"
                className="form-control"
                onChange={handleChange}
              />
            </div>

            {/* Position */}
            <div className="col-md-6 mb-3">
              <label>Position</label>
              <input
                type="text"
                name="position"
                className="form-control"
                onChange={handleChange}
              />
            </div>

            {/* Since */}
            <div className="col-md-6 mb-3">
              <label>Registered Since</label>
              <input
                type="date"
                name="since"
                className="form-control"
                onChange={handleChange}
              />
            </div>

            {/* Logo */}
            <div className="col-md-6 mb-3">
              <label>Company Logo <span className="text-danger">*</span></label>
              <input
                type="file"
                name="logo"
                accept=".jpg,.jpeg,.png"
                className={`form-control ${errors.logo && "is-invalid"}`}
                onChange={handleFileChange}
              />
              <div className="invalid-feedback">{errors.logo}</div>

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="mt-2"
                  height="60"
                />
              )}
            </div>

            {/* Documents */}
            <div className="col-md-6 mb-3">
              <label>Documents</label>
              <input
                type="file"
                name="documents"
                accept=".pdf,.doc,.docx"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>

          </div>

          <div className="text-center mt-3">
            <button className="btn btn-success px-5" disabled={loading}>
              {loading ? "Submitting..." : "Register"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}