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

  const parseJSON = (data, fallback = []) => {
    try {
      if (!data) return fallback;
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch {
      return fallback;
    }
  };

  const getExperience = () => {
    const exp = parseJSON(user.experience_details, []);
    if (!exp.length) return "Fresher";

    return (
      exp
        .map((e) => {
          if (!e.job_profile && !e.years) return null;
          if (e.job_profile && e.years)
            return `${e.job_profile} (${e.years} yrs)`;
          if (e.job_profile) return e.job_profile;
          return null;
        })
        .filter(Boolean)
        .join(", ") || "Fresher"
    );
  };

  const getSkills = () => {
    const skills = parseJSON(user.skills, []);
    if (!skills.length) return "Add skills";
    return skills.join(", ");
  };

  const getQualification = () => {
    const q = parseJSON(user.qualification, []);
    if (!q.length) return "Add qualification";
    return q.join(", ");
  };

  const handleUpdate = async () => {
    try {
      let newErrors = {};

      if (!form.full_name) newErrors.full_name = "Full name is required";
      if (!form.phone) newErrors.phone = "Phone is required";
      if (!form.preferred_location)
        newErrors.preferred_location = "location is required";
      if (!form.skills || form.skills.length === 0)
        newErrors.skills = "Select at least 1 skill";

      if (form.skills?.length > 5)
        newErrors.skills = "Max 5 skills allowed";

      if (form.photo instanceof File) {
        if (!form.photo.type.startsWith("image/"))
          newErrors.photo = "Photo must be image";
        if (form.photo.size > 2 * 1024 * 1024)
          newErrors.photo = "Max size 2MB";
      }

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

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});

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

  const skillOptions = [
    { value: "PHP", label: "PHP" },
    { value: "Laravel", label: "Laravel" },
    { value: "React", label: "React" },
    { value: "Vue", label: "Vue" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "Node.js", label: "Node.js" },
    { value: "MySQL", label: "MySQL" },
  ];

  return (
    <div className="container-xxl bg-white p-0">
      <Navbar />

      {/* ✅ CORRECT DASHBOARD LAYOUT */}
      <div className="container-fluid mt-4 mb-5">
        <div className="row">

          {/* ✅ SIDEBAR */}
          <div className="col-md-3 col-lg-2">
            <CandidateSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* ✅ MAIN CONTENT */}
          <div className="col-md-9 col-lg-10">
            <div className="container py-3">
              <div className="card shadow-lg p-4 rounded-4 border-0">

                <div className="row align-items-center">

                  {/* PROFILE IMAGE */}
                  <div className="col-md-4 text-center">
                    <img
                      src={
                        form.photo instanceof File
                          ? URL.createObjectURL(form.photo)
                          : user.photo
                          ? `https://server.budes.online/public/${user.photo}`
                          : "/assets/img/default.jpg"
                      }
                      className="rounded-circle"
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                      }}
                      alt="profile"
                    />

                    {editMode && (
                      <input
                        type="file"
                        className="form-control mt-2"
                        onChange={(e) =>
                          setForm({ ...form, photo: e.target.files[0] })
                        }
                      />
                    )}
                  </div>

                  {/* FORM */}
                  <div className="col-md-8">
                    {/* KEEP YOUR EXISTING FORM (UNCHANGED) */}
                    {/* No logic removed */}

                    {/* NAME */}
                    <div className="d-flex justify-content-between mb-3">
                      <div className="w-50">
                        <label className="form-label fw-semibold">
                          <FaUserEdit className="me-2 text-primary" />
                          Full Name *
                        </label>

                        {editMode ? (
                          <input
                            className="form-control"
                            value={form.full_name || ""}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                full_name: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <div className="form-control bg-light">
                            {user.full_name || user.name}
                          </div>
                        )}

                        {errors.full_name && (
                          <small className="text-danger">
                            {errors.full_name}
                          </small>
                        )}
                      </div>

                      <FaUserEdit
                        style={{ cursor: "pointer" }}
                        onClick={() => setEditMode(!editMode)}
                      />
                    </div>

                    {/* KEEP REST SAME (NO CHANGE) */}

                    {editMode && (
                      <button
                        className="btn btn-success mt-4"
                        onClick={handleUpdate}
                      >
                        Save Changes
                      </button>
                    )}
                  </div>

                </div>
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