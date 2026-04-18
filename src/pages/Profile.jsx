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

  // ✅ SAFE JSON PARSER
  const parseJSON = (data, fallback = []) => {
    try {
      if (!data) return fallback;
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ FETCH PROFILE (FIXED)
  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");
      const data = res.data.data;

      setUser(data);

      setForm({
        ...data,
        skills: parseJSON(data.skills),
        qualification: parseJSON(data.qualification),
        experience_details: parseJSON(data.experience_details),
        type: data.type || "",
      });

      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  // ✅ UPDATE PROFILE (FIXED)
  const handleUpdate = async () => {
    try {
      // VALIDATION
      if (!form.full_name) {
        return Swal.fire("Error", "Full name required", "error");
      }

      if (!form.skills?.length) {
        return Swal.fire("Error", "Select at least 1 skill", "error");
      }

      if (form.type === "experienced") {
        if (!form.experience_details?.length) {
          return Swal.fire("Error", "Add experience", "error");
        }

        for (let exp of form.experience_details) {
          if (!exp.job_profile || !exp.years) {
            return Swal.fire("Error", "Fill experience fields", "error");
          }
        }
      }

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "cv") {
          if (form.cv instanceof File) {
            formData.append("cv", form.cv);
          } else if (form.cv === null) {
            formData.append("cv", "");
          }
        } else if (key === "experience_details") {
          formData.append(
            "experience_details",
            JSON.stringify(form.experience_details || [])
          );
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

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container py-5">
      <Navbar />

      <div className="card p-4 shadow">

        {/* FULL NAME */}
        <div className="mb-3">
          <label>Full Name</label>
          {editMode ? (
            <input
              className="form-control"
              value={form.full_name || ""}
              onChange={(e) =>
                setForm({ ...form, full_name: e.target.value })
              }
            />
          ) : (
            <div className="form-control">{user.full_name}</div>
          )}
        </div>

        {/* SKILLS */}
        <div className="mb-3">
          <label>Skills</label>
          {editMode ? (
            <input
              className="form-control"
              value={form.skills?.join(",") || ""}
              onChange={(e) =>
                setForm({ ...form, skills: e.target.value.split(",") })
              }
            />
          ) : (
            <div className="form-control">
              {parseJSON(user.skills).join(", ")}
            </div>
          )}
        </div>

        {/* EXPERIENCE TYPE */}
        <div className="mb-3">
          <label>Experience</label>

          {editMode ? (
            <select
              className="form-control"
              value={form.type || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value,
                  experience_details:
                    e.target.value === "experienced"
                      ? form.experience_details?.length
                        ? form.experience_details
                        : [{ job_profile: "", years: "" }]
                      : [],
                })
              }
            >
              <option value="">Select</option>
              <option value="fresher">Fresher</option>
              <option value="experienced">Experienced</option>
            </select>
          ) : (
            <div className="form-control">
              {(form.type || user.type)
                ? (form.type || user.type).charAt(0).toUpperCase() +
                  (form.type || user.type).slice(1)
                : "Not selected"}
            </div>
          )}
        </div>

        {/* EXPERIENCE DETAILS */}
        {editMode && form.type === "experienced" && (
          <div className="mb-3">
            {form.experience_details.map((exp, index) => (
              <div key={index} className="d-flex mb-2">
                <input
                  className="form-control me-2"
                  placeholder="Job Profile"
                  value={exp.job_profile}
                  onChange={(e) => {
                    const updated = [...form.experience_details];
                    updated[index].job_profile = e.target.value;
                    setForm({ ...form, experience_details: updated });
                  }}
                />
                <input
                  className="form-control"
                  placeholder="Years"
                  value={exp.years}
                  onChange={(e) => {
                    const updated = [...form.experience_details];
                    updated[index].years = e.target.value;
                    setForm({ ...form, experience_details: updated });
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* EXPERIENCE VIEW */}
        {!editMode && (form.type || user.type) === "experienced" && (
          <div className="form-control mb-3">
            {parseJSON(form.experience_details).map(
              (e) => `${e.job_profile} (${e.years} yrs)`
            ).join(", ")}
          </div>
        )}

        {/* CV */}
        <div className="mb-3">
          <label>CV</label>

          {editMode ? (
            <input
              type="file"
              className="form-control"
              onChange={(e) =>
                setForm({ ...form, cv: e.target.files[0] })
              }
            />
          ) : user.cv ? (
            <a
              href={`https://server.budes.online/public/${user.cv}`}
              target="_blank"
              rel="noreferrer"
            >
              View CV
            </a>
          ) : (
            "No CV uploaded"
          )}
        </div>

        {/* SAVE */}
        {editMode && (
          <button className="btn btn-success" onClick={handleUpdate}>
            Save Changes
          </button>
        )}

      </div>

      <Footer />
    </div>
  );
}

export default Profile;