import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CandidateSidebar from "../components/candidate/CandidateSidebar";

import { FaEdit, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import Swal from "sweetalert2";
import Select from "react-select";

function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editSection, setEditSection] = useState(null);
  const [form, setForm] = useState({});

  const safeArray = (data) => {
    if (!data) return [];
    try {
      if (Array.isArray(data)) return data;
      if (typeof data === "string") return JSON.parse(data);
      return [];
    } catch {
      return [];
    }
  };

  const skillOptions = [
    { value: "PHP", label: "PHP" },
    { value: "Laravel", label: "Laravel" },
    { value: "React", label: "React" },
    { value: "Vue", label: "Vue" },
    { value: "Node.js", label: "Node.js" },
    { value: "MySQL", label: "MySQL" },
  ];

  const qualificationOptions = [
    { value: "10th", label: "10th" },
    { value: "12th", label: "12th" },
    { value: "Diploma", label: "Diploma" },
    { value: "Graduate", label: "Graduate" },
    { value: "Post Graduate", label: "Post Graduate" },
  ];

  const getCompletion = () => {
    let total = 6;
    let filled = 0;

    if (profile.full_name) filled++;
    if (profile.phone) filled++;
    if (profile.preferred_location) filled++;
    if (safeArray(profile.skills).length) filled++;
    if (safeArray(profile.qualification).length) filled++;
    if (profile.cv) filled++;

    return Math.round((filled / total) * 100);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");
      const data = res.data.data;

      setProfile({
        ...data,
        skills: safeArray(data.skills),
        qualification: safeArray(data.qualification),
      });

      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.type)) {
      return Swal.fire("Error", "Only JPG, JPEG, PNG allowed", "error");
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      await API.post("/update-profile", formData);
      Swal.fire("Success", "Photo updated", "success");
      fetchProfile();
    } catch {
      Swal.fire("Error", "Upload failed", "error");
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (Array.isArray(form[key])) {
          form[key].forEach((item, i) => {
            formData.append(`${key}[${i}]`, item);
          });
        } else {
          formData.append(key, form[key]);
        }
      });

      await API.post("/update-profile", formData);

      Swal.fire("Success", "Updated successfully", "success");
      setEditSection(null);
      fetchProfile();
    } catch {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-4 mb-5">
        <div className="row">

          <div className="col-md-3 col-lg-2">
            <CandidateSidebar />
          </div>

          <div className="col-md-9 col-lg-10">

            {/* HEADER */}
            <div className="card shadow-sm p-4 mb-4 border-0 rounded-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                <div className="d-flex gap-3 align-items-center">

                  <div style={{ position: "relative", cursor: "pointer" }}>
                    <img
                      src={
                        profile.photo
                          ? `https://server.budes.online/public/${profile.photo}`
                          : "/assets/img/default.png"
                      }
                      className="rounded-circle"
                      style={{ width: 90, height: 90, objectFit: "cover" }}
                      alt=""
                      onClick={() =>
                        document.getElementById("photoInput").click()
                      }
                    />

                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        background: "#fff",
                        borderRadius: "50%",
                        padding: "6px",
                        boxShadow: "0 0 6px rgba(0,0,0,0.2)",
                      }}
                    >
                      <FaEdit size={14} />
                    </span>

                    <input
                      type="file"
                      id="photoInput"
                      hidden
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handlePhotoUpload}
                    />
                  </div>

                  <div>
                    <h4 className="fw-bold">{profile.full_name}</h4>
                    <p className="text-muted mb-1">
                      <FaMapMarkerAlt /> {profile.preferred_location}
                    </p>
                    <p className="text-muted">
                      <FaPhone /> {profile.phone}
                    </p>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setEditSection("basic");
                    setForm({
                      full_name: profile.full_name,
                      phone: profile.phone,
                      preferred_location: profile.preferred_location,
                    });
                  }}
                >
                  <FaEdit /> Edit Profile
                </button>
              </div>

              <div className="mt-3">
                <small>Profile Completion: {getCompletion()}%</small>
                <div className="progress mt-1">
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${getCompletion()}%` }}
                  />
                </div>
              </div>
            </div>

            {/* SKILLS */}
            <div className="card p-4 mb-4 rounded-4">
              <div className="d-flex justify-content-between mb-3">
                <h5>Skills</h5>
                <button
                  className="btn btn-light btn-sm border"
                  onClick={() => {
                    setEditSection("skills");
                    setForm({ skills: profile.skills });
                  }}
                >
                  <FaEdit />
                </button>
              </div>

              <div className="d-flex flex-wrap gap-2">
                {profile.skills.map((s, i) => (
                  <span key={i} className="badge bg-primary">{s}</span>
                ))}
              </div>
            </div>

            {/* QUALIFICATION */}
            <div className="card p-4 mb-4 rounded-4">
              <div className="d-flex justify-content-between mb-3">
                <h5>Qualification</h5>
                <button
                  className="btn btn-light btn-sm border"
                  onClick={() => {
                    setEditSection("qualification");
                    setForm({ qualification: profile.qualification });
                  }}
                >
                  <FaEdit />
                </button>
              </div>

              <div className="d-flex flex-wrap gap-2">
                {profile.qualification.map((q, i) => (
                  <span key={i} className="badge bg-success">{q}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL */}
      {editSection && (
        <div className="modal d-block" style={{ background: "#00000080" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5>Edit {editSection}</h5>

              {editSection === "skills" && (
                <>
                  <label>Skills</label>
                  <Select
                    isMulti
                    options={skillOptions}
                    value={form.skills.map((s) => ({ value: s, label: s }))}
                    onChange={(selected) => {
                      if (selected.length > 5) {
                        return Swal.fire("Limit", "Max 5 skills", "warning");
                      }
                      setForm({
                        skills: selected.map((i) => i.value),
                      });
                    }}
                  />
                </>
              )}

              {editSection === "qualification" && (
                <>
                  <label>Qualification</label>
                  <Select
                    isMulti
                    options={qualificationOptions}
                    value={form.qualification.map((q) => ({
                      value: q,
                      label: q,
                    }))}
                    onChange={(selected) =>
                      setForm({
                        qualification: selected.map((i) => i.value),
                      })
                    }
                  />
                </>
              )}

              <div className="mt-3 text-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setEditSection(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Profile;