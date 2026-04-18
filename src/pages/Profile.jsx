import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
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

  const skillOptions = [
    { value: "PHP", label: "PHP" },
    { value: "Laravel", label: "Laravel" },
    { value: "React", label: "React" },
    { value: "Vue", label: "Vue" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "Node.js", label: "Node.js" },
    { value: "MySQL", label: "MySQL" },
  ];

  // ✅ SAFE PARSER (IMPORTANT FIX)
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

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");
      const data = res.data.data;

      setUser(data);

      // ✅ FIXED FORM STATE
      setForm({
        ...data,
        qualification: parseJSON(data.qualification),
        skills: parseJSON(data.skills),
      });

      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

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

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container-xxl bg-white p-0">
      <Navbar />

      <div className="container py-5">
        <div className="card p-4 shadow rounded">

          {/* NAME */}
          <div className="d-flex justify-content-between mb-3">
            <div className="w-50">
              <label className="form-label">
                <FaUserEdit /> Full Name
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

            <FaUserEdit onClick={() => setEditMode(!editMode)} />
          </div>

          <div className="row g-3">

            {/* LOCATION */}
            <div className="col-md-6">
              <label><FaMapMarkerAlt /> Location</label>
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
              <label><FaPhone /> Phone</label>
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
                  {user.phone}
                </div>
              )}
            </div>

            {/* QUALIFICATION */}
            <div className="col-md-6">
              <label><FaGraduationCap /> Qualification</label>

              {editMode ? (
                <Select
                  isMulti
                  value={parseJSON(form.qualification).map(q => ({
                    value: q,
                    label: q,
                  }))}
                  options={qualificationOptions}
                  onChange={(selected) =>
                    setForm({
                      ...form,
                      qualification: selected.map(i => i.value),
                    })
                  }
                />
              ) : (
                <div className="form-control bg-light">
                  {parseJSON(user.qualification).join(", ")}
                </div>
              )}
            </div>

            {/* SKILLS */}
            <div className="col-md-6">
              <label><FaTools /> Skills</label>

              {editMode ? (
                <Select
                  isMulti
                  value={parseJSON(form.skills).map(s => ({
                    value: s,
                    label: s,
                  }))}
                  options={skillOptions}
                  onChange={(selected) =>
                    setForm({
                      ...form,
                      skills: selected.map(i => i.value),
                    })
                  }
                />
              ) : (
                <div className="form-control bg-light">
                  {parseJSON(user.skills).join(", ")}
                </div>
              )}
            </div>

            {/* CV */}
            <div className="col-md-6">
              <label>CV</label>

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
                    <small className="text-success">
                      {form.cv.name}
                    </small>
                  )}

                  {user.cv && (
                    <>
                      <br />
                      <a
                        href={`https://server.budes.online/storage/${user.cv}`}
                        target="_blank"
                      >
                        View Current CV
                      </a>

                      <br />

                      <button
                        className="btn btn-sm btn-danger mt-2"
                        onClick={() =>
                          setForm({ ...form, cv: null })
                        }
                      >
                        Remove CV
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="form-control bg-light">
                  {user.cv ? (
                    <a
                      href={`https://server.budes.online/storage/${user.cv}`}
                      target="_blank"
                    >
                      View CV
                    </a>
                  ) : "No CV"}
                </div>
              )}
            </div>

          </div>

          {editMode && (
            <button className="btn btn-success mt-4" onClick={handleUpdate}>
              Save Changes
            </button>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;