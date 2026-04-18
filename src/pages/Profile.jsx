import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

  // ✅ ONLY UPDATED: handleUpdate with FormData
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "cv") {
          if (form.cv instanceof File) {
            formData.append("cv", form.cv);
          } else if (form.cv === null) {
            formData.append("cv", "");
          }
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

      <div className="container py-5">
        <div className="card shadow-lg p-4 rounded-4 border-0">
          <div className="row align-items-center">
            <div className="col-md-3 text-center">
              <img
                src="/assets/img/default.jpg"
                className="rounded-circle"
                style={{ width: 120, height: 120 }}
                alt="profile"
              />
            </div>

            <div className="col-md-9">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="w-50">
                  <label className="form-label fw-semibold">
                    <FaUserEdit className="me-2 text-primary" />
                    Full Name
                  </label>

                  {editMode ? (
                    <input
                      className="form-control"
                      value={form.full_name || ""}
                      onChange={(e) =>
                        setForm({ ...form, full_name: e.target.value })
                      }
                    />
                  ) : (
                    <div className="form-control bg-light">
                      {user.full_name || user.name}
                    </div>
                  )}
                </div>

                <FaUserEdit
                  style={{ cursor: "pointer" }}
                  onClick={() => setEditMode(!editMode)}
                />
              </div>

              <hr />

              <div className="row g-3">
                {/* LOCATION */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <FaMapMarkerAlt className="me-2 text-primary" />
                    Location
                  </label>

                  {editMode ? (
                    <input
                      className="form-control"
                      value={form.preferred_location || ""}
                      onChange={(e) =>
                        setForm({ ...form, preferred_location: e.target.value })
                      }
                    />
                  ) : (
                    <div className="form-control bg-light">
                      {user.preferred_location || "Add location"}
                    </div>
                  )}
                </div>

                {/* PHONE */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <FaPhone className="me-2 text-success" />
                    Phone
                  </label>

                  {editMode ? (
                    <input
                      className="form-control"
                      value={form.phone || ""}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  ) : (
                    <div className="form-control bg-light">
                      {user.phone || "Add phone"}
                    </div>
                  )}
                </div>

                {/* EMAIL */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <FaEnvelope className="me-2 text-danger" />
                    Email
                  </label>
                  <div className="form-control bg-light">{user.email}</div>
                </div>

                {/* QUALIFICATION */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <FaGraduationCap className="me-2 text-warning" />
                    Qualification
                  </label>

                  {editMode ? (
                    <Select
                      isMulti
                      value={
                        Array.isArray(form.qualification)
                          ? form.qualification.map((q) => ({
                              value: q,
                              label: q,
                            }))
                          : []
                      }
                      options={qualificationOptions}
                      onChange={(selected) =>
                        setForm({
                          ...form,
                          qualification: selected.map((i) => i.value),
                        })
                      }
                    />
                  ) : (
                    <div className="form-control bg-light">
                      {getQualification()}
                    </div>
                  )}
                </div>

                {/* SKILLS */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <FaTools className="me-2 text-info" />
                    Skills (Max 5)
                  </label>

                  {editMode ? (
                    <Select
                      isMulti
                      value={
                        Array.isArray(form.skills)
                          ? form.skills.map((s) => ({
                              value: s,
                              label: s,
                            }))
                          : []
                      }
                      options={skillOptions}
                      onChange={(selected) => {
                        if (selected.length <= 5) {
                          setForm({
                            ...form,
                            skills: selected.map((i) => i.value),
                          });
                        } else {
                          Swal.fire("Error", "Only 5 skills allowed", "error");
                        }
                      }}
                    />
                  ) : (
                    <div className="form-control bg-light">{getSkills()}</div>
                  )}
                </div>

                {/* EXPERIENCE */}
                <div className="col-md-6">
                  <div className="form-control bg-light">
                    {form.experience_type === "experienced"
                      ? "Experienced"
                      : "Fresher"}
                  </div>

                  <div className="form-control bg-light">{getExperience()}</div>

                  {editMode ? (
                    <input
                      className="form-control"
                      value={
                        Array.isArray(form.experience_details)
                          ? form.experience_details
                              .map((e) => e.job_profile || "")
                              .join(", ")
                          : ""
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          experience_details: [
                            {
                              job_profile: e.target.value,
                              years: 0,
                            },
                          ],
                        })
                      }
                    />
                  ) : (
                    <div className="form-control bg-light">
                      {getExperience()}
                    </div>
                  )}
                </div>

                {/* ✅ CV FIELD ADDED */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Upload CV</label>

                  {editMode ? (
                    <>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) =>
                          setForm({ ...form, cv: e.target.files[0] })
                        }
                      />

                      {form.cv && (
                        <small className="text-success d-block mt-1">
                          {form.cv.name}
                        </small>
                      )}

                      {user.cv && !form.cv && (
                        <small className="text-muted d-block mt-1">
                          Current:{" "}
                          <a
                            href={`https://server.budes.online/public/${user.cv}`}
                            target="_blank"
                          >
                            View CV
                          </a>
                        </small>
                      )}
                    </>
                  ) : (
                    <div className="form-control bg-light">
                      {user.cv ? (
                        <a
                          href={`https://server.budes.online/public/${user.cv}`}
                          target="_blank"
                        >
                          View CV
                        </a>
                      ) : (
                        "No CV uploaded"
                      )}
                    </div>
                  )}
                </div>
              </div>

              {editMode && (
                <button
                  className="btn btn-success mt-4 px-4"
                  onClick={handleUpdate}
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;
