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

  // dynamic qualification states
  const [master, setMaster] = useState({});
  const [qualificationParent, setQualificationParent] = useState("");
  const [qualificationChild, setQualificationChild] = useState([]);

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

  useEffect(() => {
    fetchProfile();
    fetchMaster();
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

  const fetchMaster = async () => {
    try {
      const res = await API.get("/get-master-data");
      const raw = res.data.data || [];

      const grouped = {};

      raw.forEach((item) => {
        if (!grouped[item.type]) grouped[item.type] = [];

        if (item.type === "education" && item.parent_id === null) {
          grouped[item.type].push({
            ...item,
            children: raw.filter((i) => i.parent_id === item.id),
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
        formData.append(key, form[key] || "");
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
            <div className="card p-4 mb-4 shadow-sm">
              <div className="d-flex justify-content-between">

                <div className="d-flex gap-3">
                  <img
                    src={
                      profile.photo
                        ? `${BASE_URL}/public/${profile.photo}`
                        : "/assets/img/default.png"
                    }
                    className="rounded-circle"
                    style={{ width: 80, height: 80 }}
                  />

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
            <div className="card p-3 mb-3">
              <div className="d-flex justify-content-between">
                <h5>Skills</h5>
                <button
                  className="btn btn-light"
                  onClick={() => {
                    setEditSection("skills");
                    setForm({ skills: profile.skills || [] });
                  }}
                >
                  <FaEdit />
                </button>
              </div>

              {(profile.skills || []).map((s, i) => (
                <span key={i} className="badge bg-primary me-2">{s}</span>
              ))}
            </div>

            {/* QUALIFICATION */}
            <div className="card p-3 mb-3">
              <div className="d-flex justify-content-between">
                <h5>Qualification</h5>
                <button
                  className="btn btn-light"
                  onClick={() => {
                    setEditSection("qualification");
                    setForm({ qualification: profile.qualification || [] });
                  }}
                >
                  <FaEdit />
                </button>
              </div>

              {(profile.qualification || []).map((q, i) => (
                <span key={i} className="badge bg-success me-2">{q}</span>
              ))}
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

              {/* QUALIFICATION FIXED */}
              {editSection === "qualification" && (
                <>
                  <label>Qualification Level</label>
                  <select
                    className="form-control mb-2"
                    value={qualificationParent}
                    onChange={(e) => {
                      const value = e.target.value;
                      setQualificationParent(value);

                      const selected = master.education?.find(
                        (i) => i.id == value
                      );

                      const children = selected?.children || [];
                      setQualificationChild(children);

                      if (!children.length && selected) {
                        setForm({
                          ...form,
                          qualification: [
                            ...(form.qualification || []),
                            selected.name,
                          ],
                        });
                      }
                    }}
                  >
                    <option value="">Select Level</option>
                    {master.education?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  {/* ALWAYS SHOW DEGREE */}
                  <label>Degree</label>
                  <select
                    className="form-control mb-2"
                    onChange={(e) => {
                      const degree = e.target.value;

                      const parent = master.education?.find(
                        (i) => i.id == qualificationParent
                      );

                      if (!parent || !degree) return;

                      setForm({
                        ...form,
                        qualification: [
                          ...(form.qualification || []),
                          `${parent.name} - ${degree}`,
                        ],
                      });
                    }}
                  >
                    <option value="">Select Degree</option>
                    {(qualificationChild || []).map((child) => (
                      <option key={child.id} value={child.name}>
                        {child.name}
                      </option>
                    ))}
                  </select>

                  {/* MULTI SELECT VIEW */}
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {(form.qualification || []).map((q, i) => (
                      <span
                        key={i}
                        className="badge bg-success"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          const updated = form.qualification.filter(
                            (_, index) => index !== i
                          );
                          setForm({ ...form, qualification: updated });
                        }}
                      >
                        {q} ❌
                      </span>
                    ))}
                  </div>

                  <small>Click to remove</small>
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