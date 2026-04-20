import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CandidateSidebar from "../components/candidate/CandidateSidebar";

import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaUserEdit,
  FaTools,
  FaGraduationCap,
} from "react-icons/fa";
import Swal from "sweetalert2";
import Select from "react-select";

function Profile() {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("profile");

  const qualificationOptions = [
    { value: "10th", label: "10th" },
    { value: "12th", label: "12th" },
    { value: "Diploma", label: "Diploma" },
    { value: "Graduate", label: "Graduate" },
    { value: "Post Graduate", label: "Post Graduate" },
  ];

  const skillOptions = [
    { value: "PHP", label: "PHP" },
    { value: "Laravel", label: "Laravel" },
    { value: "React", label: "React" },
    { value: "Vue", label: "Vue" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "Node.js", label: "Node.js" },
    { value: "MySQL", label: "MySQL" },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");
      setUser(res.data.data);
      setForm(res.data.data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <p className="text-center mt-5">Loading...</p>
        <Footer />
      </>
    );

  const handleUpdate = async () => {
    let newErrors = {};

    if (!form.full_name) newErrors.full_name = "Full name required";
    if (!form.phone || !/^[0-9]{10}$/.test(form.phone))
      newErrors.phone = "Valid 10 digit phone required";
    if (!form.preferred_location)
      newErrors.preferred_location = "Location required";

    if (!form.skills || form.skills.length === 0)
      newErrors.skills = "Select at least 1 skill";

    if (form.skills?.length > 5)
      newErrors.skills = "Max 5 skills allowed";

    if (!form.qualification || form.qualification.length === 0)
      newErrors.qualification = "Select qualification";

    if (form.cv instanceof File) {
      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowed.includes(form.cv.type))
        newErrors.cv = "Only PDF/DOC/DOCX allowed";

      if (form.cv.size > 2 * 1024 * 1024)
        newErrors.cv = "Max size 2MB";
    }

    if (form.photo instanceof File) {
      if (!form.photo.type.startsWith("image/"))
        newErrors.photo = "Photo must be image";

      if (form.photo.size > 2 * 1024 * 1024)
        newErrors.photo = "Max size 2MB";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "photo" && form.photo instanceof File) {
          formData.append("photo", form.photo);
        } else if (key === "cv" && form.cv instanceof File) {
          formData.append("cv", form.cv);
        } else if (Array.isArray(form[key])) {
          form[key].forEach((item, i) => {
            formData.append(`${key}[${i}]`, item);
          });
        } else {
          formData.append(key, form[key] ?? "");
        }
      });

      await API.post("/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success", "Profile updated", "success");
      setEditMode(false);
      fetchProfile();
    } catch {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  return (
    <div className="container-xxl bg-white p-0">
      <Navbar />

      <div className="container-fluid mt-4 mb-5">
        <div className="row">
          <div className="col-md-3 col-lg-2">
            <CandidateSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          <div className="col-md-9 col-lg-10">
            <div className="container py-3">
              <div className="card shadow-lg p-4 rounded-4 border-0">

                {/* NAME */}
                <label className="fw-semibold">Full Name</label>
                <input
                  className={`form-control ${errors.full_name ? "is-invalid" : ""}`}
                  value={form.full_name || ""}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                />
                {errors.full_name && <small className="text-danger">{errors.full_name}</small>}

                {/* PHONE */}
                <label className="fw-semibold mt-3">Phone</label>
                <input
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  value={form.phone || ""}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
                {errors.phone && <small className="text-danger">{errors.phone}</small>}

                {/* LOCATION */}
                <label className="fw-semibold mt-3">Location</label>
                <input
                  className={`form-control ${errors.preferred_location ? "is-invalid" : ""}`}
                  value={form.preferred_location || ""}
                  onChange={(e) =>
                    setForm({ ...form, preferred_location: e.target.value })
                  }
                />
                {errors.preferred_location && <small className="text-danger">{errors.preferred_location}</small>}

                {/* SKILLS */}
                <label className="fw-semibold mt-3">Skills</label>
                <Select
                  isMulti
                  options={skillOptions}
                  value={(form.skills || []).map((s) => ({ value: s, label: s }))}
                  onChange={(selected) =>
                    setForm({
                      ...form,
                      skills: selected.map((i) => i.value),
                    })
                  }
                />
                {errors.skills && <small className="text-danger">{errors.skills}</small>}

                {/* QUALIFICATION */}
                <label className="fw-semibold mt-3">Qualification</label>
                <Select
                  isMulti
                  options={qualificationOptions}
                  value={(form.qualification || []).map((q) => ({
                    value: q,
                    label: q,
                  }))}
                  onChange={(selected) =>
                    setForm({
                      ...form,
                      qualification: selected.map((i) => i.value),
                    })
                  }
                />
                {errors.qualification && <small className="text-danger">{errors.qualification}</small>}

                {/* CV */}
                <label className="fw-semibold mt-3">Upload CV</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) =>
                    setForm({ ...form, cv: e.target.files[0] })
                  }
                />
                {errors.cv && <small className="text-danger">{errors.cv}</small>}

                {/* SAVE */}
                <button
                  className="btn btn-success mt-4"
                  onClick={handleUpdate}
                >
                  Save Changes
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;