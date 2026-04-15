import { useEffect, useState } from "react";
import API from "../services/api";
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

function Profile() {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

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

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  // ✅ SAFE PARSE
  const parseJSON = (data, fallback = []) => {
    try {
      if (!data) return fallback;
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch {
      return fallback;
    }
  };

  // ✅ EXPERIENCE FORMAT
  const getExperience = () => {
    const exp = parseJSON(user.experience_details, []);
    if (!exp.length) return "Fresher";

    return exp
      .map((e) => `${e.job_profile || "Fresher"} (${e.years || 0} yrs)`)
      .join(", ");
  };

  // ✅ SKILLS FORMAT
  const getSkills = () => {
    const skills = parseJSON(user.skills, []);
    if (!skills.length) return "Add skills";
    return skills.join(", ");
  };

  // ✅ QUALIFICATION FORMAT
  const getQualification = () => {
    const q = parseJSON(user.qualification, []);
    if (!q.length) return "Add qualification";
    return q.join(", ");
  };

  // ✅ UPDATE PROFILE
  const handleUpdate = async () => {
    try {
      await API.post("/update-profile", form);

      Swal.fire("Success", "Profile updated", "success");

      setEditMode(false);
      fetchProfile();
    } catch {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg p-4 rounded-4">
        <div className="row align-items-center">

          {/* LEFT */}
          <div className="col-md-3 text-center">
            <img
              src="/assets/img/default.jpg"
              className="rounded-circle"
              style={{ width: 120, height: 120 }}
              alt="profile"
            />
          </div>

          {/* RIGHT */}
          <div className="col-md-9">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center">
              {editMode ? (
                <input
                  className="form-control w-50"
                  value={form.full_name || ""}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                />
              ) : (
                <h3>{user.full_name || user.name}</h3>
              )}

              <FaUserEdit
                style={{ cursor: "pointer" }}
                onClick={() => setEditMode(!editMode)}
              />
            </div>

            <hr />

            <div className="row">

              {/* LOCATION */}
              <div className="col-md-6 mb-3">
                <FaMapMarkerAlt className="me-2 text-primary" />
                {editMode ? (
                  <input
                    className="form-control"
                    value={form.preferred_location || ""}
                    onChange={(e) =>
                      setForm({ ...form, preferred_location: e.target.value })
                    }
                  />
                ) : (
                  user.preferred_location || "Add location"
                )}
              </div>

              {/* PHONE */}
              <div className="col-md-6 mb-3">
                <FaPhone className="me-2 text-success" />
                {editMode ? (
                  <input
                    className="form-control"
                    value={form.phone || ""}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                ) : (
                  user.phone || "Add phone"
                )}
              </div>

              {/* EMAIL */}
              <div className="col-md-6 mb-3">
                <FaEnvelope className="me-2 text-danger" />
                {user.email}
              </div>

              {/* QUALIFICATION */}
              <div className="col-md-6 mb-3">
                <FaGraduationCap className="me-2" />
                {editMode ? (
                  <input
                    className="form-control"
                    value={
                      Array.isArray(form.qualification)
                        ? form.qualification.join(", ")
                        : form.qualification || ""
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        qualification: e.target.value.split(","),
                      })
                    }
                  />
                ) : (
                  getQualification()
                )}
              </div>

              {/* SKILLS */}
              <div className="col-md-6 mb-3">
                <FaTools className="me-2" />
                {editMode ? (
                  <input
                    className="form-control"
                    placeholder="Laravel, React"
                    value={
                      Array.isArray(form.skills)
                        ? form.skills.join(", ")
                        : form.skills || ""
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        skills: e.target.value.split(","),
                      })
                    }
                  />
                ) : (
                  getSkills()
                )}
              </div>

              {/* EXPERIENCE */}
              <div className="col-md-6 mb-3">
                <FaBriefcase className="me-2" />
                {editMode ? (
                  <input
                    className="form-control"
                    placeholder="Web Developer (2 yrs)"
                    value={
                      Array.isArray(form.experience_details)
                        ? form.experience_details
                            .map(
                              (e) =>
                                `${e.job_profile || ""} (${e.years || ""})`
                            )
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
                  getExperience()
                )}
              </div>

            </div>

            {/* SAVE BUTTON */}
            {editMode && (
              <button className="btn btn-success mt-3" onClick={handleUpdate}>
                Save Changes
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;