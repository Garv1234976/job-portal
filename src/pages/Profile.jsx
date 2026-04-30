import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CandidateSidebar from "../components/candidate/CandidateSidebar";

import { FaEdit, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import Swal from "sweetalert2";
import Select from "react-select";
import { BASE_URL } from "../config/constants";

function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editSection, setEditSection] = useState(null);
  const [form, setForm] = useState({});

  // 🔥 NEW: master data
  const [master, setMaster] = useState({});

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

  // 🔥 DYNAMIC QUALIFICATION OPTIONS
  const qualificationOptions = (master.education || []).flatMap((parent) => {
    if (!parent.children || parent.children.length === 0) {
      return [
        {
          value: parent.name,
          label: parent.name,
        },
      ];
    }

    return parent.children.map((child) => ({
      value: `${parent.name} - ${child.name}`,
      label: `${parent.name} → ${child.name}`,
    }));
  });

  useEffect(() => {
    fetchProfile();
    fetchMaster(); // 🔥 added
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

  // 🔥 NEW FUNCTION
  const fetchMaster = async () => {
    try {
      const res = await API.get("/get-master-data");
      const raw = res.data.data || [];

      const grouped = {};

      raw.forEach((item) => {
        if (!grouped[item.type]) grouped[item.type] = [];

        if (item.type === "education" && item.parent_id === null) {
          const children = raw.filter(
            (i) => i.parent_id == item.id
          );

          grouped[item.type].push({
            ...item,
            children,
          });
        }
      });

      setMaster(grouped);
    } catch (err) {
      console.log(err);
    }
  };

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

                  <div
                    style={{ position: "relative" }}
                    onClick={() =>
                      document.getElementById("photoInput").click()
                    }
                  >
                    <img
                      src={
                        profile.photo
                          ? `${BASE_URL}/public/${profile.photo}`
                          : "/assets/img/default.png"
                      }
                      className="rounded-circle"
                      style={{
                        width: 90,
                        height: 90,
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      loading="lazy"
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

              <div className="d-flex flex-wrap gap-2">
                {profile.skills.map((s, i) => (
                  <span key={i} className="badge bg-primary">
                    {s}
                  </span>
                ))}
              </div>
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

              <div className="d-flex flex-wrap gap-2">
                {profile.qualification.map((q, i) => (
                  <span key={i} className="badge bg-success">
                    {q}
                  </span>
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

              {/* 🔥 ONLY THIS PART UPDATED */}
              {editSection === "qualification" && (
                <Select
                  isMulti
                  options={qualificationOptions}
                  value={(form.qualification || []).map((q) => ({
                    value: q,
                    label: q.replace(" - ", " → "),
                  }))}
                  onChange={(selected) =>
                    setForm({
                      qualification: selected
                        ? selected.map((i) => i.value)
                        : [],
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