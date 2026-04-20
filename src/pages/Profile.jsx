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
  ];

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

  // ✅ PHOTO UPLOAD FIXED
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      return Swal.fire("Error", "Only JPG, PNG allowed", "error");
    }

    const formData = new FormData();
    formData.append("photo", file);

    await API.post("/update-profile", formData);
    Swal.fire("Success", "Photo updated", "success");
    fetchProfile();
  };

  // ✅ SAVE
  const handleSave = async () => {
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

    Swal.fire("Success", "Updated", "success");
    setEditSection(null);
    fetchProfile();
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
            <div className="card p-4 mb-4 rounded-4 shadow-sm">
              <div className="d-flex justify-content-between align-items-center">

                <div className="d-flex gap-3 align-items-center">

                  {/* FIXED PHOTO CLICK */}
                  <div
                    style={{ position: "relative" }}
                    onClick={() =>
                      document.getElementById("photoInput").click()
                    }
                  >
                    <img
                      src={
                        profile.photo
                          ? `https://server.budes.online/public/${profile.photo}`
                          : "/assets/img/default.png"
                      }
                      className="rounded-circle"
                      style={{
                        width: 90,
                        height: 90,
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        background: "#fff",
                        borderRadius: "50%",
                        padding: 6,
                        cursor: "pointer",
                      }}
                    >
                      <FaEdit />
                    </div>

                    <input
                      type="file"
                      id="photoInput"
                      hidden
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </div>

                  <div>
                    <h4>{profile.full_name}</h4>
                    <p><FaMapMarkerAlt /> {profile.preferred_location}</p>
                    <p><FaPhone /> {profile.phone}</p>
                  </div>
                </div>

                {/* FIXED EDIT BUTTON */}
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditSection("basic");
                    setForm({
                      full_name: profile.full_name,
                      phone: profile.phone,
                      preferred_location: profile.preferred_location,
                    });
                  }}
                >
                  Edit Profile
                </button>

              </div>
            </div>

            {/* SKILLS */}
            <div className="card p-4 mb-3">
              <div className="d-flex justify-content-between">
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

              {profile.skills.map((s, i) => (
                <span key={i} className="badge bg-primary me-2">{s}</span>
              ))}
            </div>

            {/* QUALIFICATION */}
            <div className="card p-4 mb-3">
              <div className="d-flex justify-content-between">
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

              {profile.qualification.map((q, i) => (
                <span key={i} className="badge bg-success me-2">{q}</span>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ✅ FIXED MODAL */}
      {editSection && (
        <div className="modal d-block" style={{ background: "#00000080" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5>Edit {editSection}</h5>

              {/* ✅ BASIC FIX */}
              {editSection === "basic" && (
                <>
                  <label>Name</label>
                  <input
                    className="form-control mb-2"
                    value={form.full_name || ""}
                    onChange={(e) =>
                      setForm({ ...form, full_name: e.target.value })
                    }
                  />

                  <label>Phone</label>
                  <input
                    className="form-control mb-2"
                    value={form.phone || ""}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />

                  <label>Location</label>
                  <input
                    className="form-control"
                    value={form.preferred_location || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        preferred_location: e.target.value,
                      })
                    }
                  />
                </>
              )}

              {/* SKILLS MULTI */}
              {editSection === "skills" && (
                <Select
                  isMulti
                  options={skillOptions}
                  value={form.skills.map((s) => ({ value: s, label: s }))}
                  onChange={(selected) =>
                    setForm({
                      skills: selected.map((i) => i.value),
                    })
                  }
                />
              )}

              {/* QUALIFICATION MULTI */}
              {editSection === "qualification" && (
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