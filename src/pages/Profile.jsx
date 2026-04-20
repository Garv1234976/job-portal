import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CandidateSidebar from "../components/candidate/CandidateSidebar";

import { FaEdit, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import Swal from "sweetalert2";

function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editSection, setEditSection] = useState(null);
  const [form, setForm] = useState({});

  // ✅ SAFE ARRAY
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

  // ✅ PROFILE COMPLETION
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

  // ✅ SAVE
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

          {/* SIDEBAR */}
          <div className="col-md-3 col-lg-2">
            <CandidateSidebar />
          </div>

          {/* MAIN */}
          <div className="col-md-9 col-lg-10">

            {/* HEADER */}
            <div className="card shadow-sm p-4 mb-4 border-0 rounded-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                <div className="d-flex gap-3 align-items-center">
                  <img
                    src={
                      profile.photo
                        ? `https://server.budes.online/public/${profile.photo}`
                        : "/assets/img/default.png"
                    }
                    className="rounded-circle"
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                    alt=""
                  />

                  <div>
                    <h4 className="mb-1 fw-bold">{profile.full_name}</h4>
                    <p className="mb-1 text-muted">
                      <FaMapMarkerAlt className="me-1" />
                      {profile.preferred_location || "N/A"}
                    </p>
                    <p className="mb-0 text-muted">
                      <FaPhone className="me-1" />
                      {profile.phone || "N/A"}
                    </p>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-sm px-3"
                  onClick={() => {
                    setEditSection("basic");
                    setForm({
                      full_name: profile.full_name,
                      phone: profile.phone,
                      preferred_location: profile.preferred_location,
                    });
                  }}
                >
                  <FaEdit className="me-1" /> Edit Profile
                </button>
              </div>

              {/* PROGRESS */}
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
            <div className="card shadow-sm p-4 mb-4 border-0 rounded-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Skills</h5>

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

              {profile.skills.length ? (
                <div className="d-flex flex-wrap gap-2">
                  {profile.skills.map((s, i) => (
                    <span
                      key={i}
                      className="badge rounded-pill px-3 py-2"
                      style={{
                        background: "#e7f3ff",
                        color: "#0d6efd",
                        fontWeight: 500,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">No skills added</p>
              )}
            </div>

            {/* QUALIFICATION */}
            <div className="card shadow-sm p-4 mb-4 border-0 rounded-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Qualification</h5>

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

              {profile.qualification.length ? (
                <div className="d-flex flex-wrap gap-2">
                  {profile.qualification.map((q, i) => (
                    <span
                      key={i}
                      className="badge rounded-pill px-3 py-2"
                      style={{
                        background: "#e6f9f0",
                        color: "#198754",
                        fontWeight: 500,
                      }}
                    >
                      {q}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">No qualification added</p>
              )}
            </div>

            {/* ABOUT */}
            <div className="card shadow-sm p-4 mb-4 border-0 rounded-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">About</h5>

                <button
                  className="btn btn-light btn-sm border"
                  onClick={() => {
                    setEditSection("about");
                    setForm({ introduction: profile.introduction });
                  }}
                >
                  <FaEdit />
                </button>
              </div>

              <p className="text-muted mb-0">
                {profile.introduction || "No introduction added"}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL */}
      {editSection && (
        <div className="modal d-block" style={{ background: "#00000080" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5 className="fw-bold mb-3">Edit {editSection}</h5>

              {editSection === "basic" && (
                <>
                  <input
                    className="form-control mb-2"
                    value={form.full_name || ""}
                    onChange={(e) =>
                      setForm({ ...form, full_name: e.target.value })
                    }
                  />
                  <input
                    className="form-control mb-2"
                    value={form.phone || ""}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
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

              {editSection === "skills" && (
                <input
                  className="form-control"
                  value={form.skills.join(",")}
                  onChange={(e) =>
                    setForm({ skills: e.target.value.split(",") })
                  }
                />
              )}

              {editSection === "qualification" && (
                <input
                  className="form-control"
                  value={form.qualification.join(",")}
                  onChange={(e) =>
                    setForm({
                      qualification: e.target.value.split(","),
                    })
                  }
                />
              )}

              {editSection === "about" && (
                <textarea
                  className="form-control"
                  rows="4"
                  value={form.introduction || ""}
                  onChange={(e) =>
                    setForm({ introduction: e.target.value })
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