import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RecruiterSidebar from "../../components/RecruiterSidebar";
import { FaEdit, FaBuilding, FaPhone } from "react-icons/fa";
import Swal from "sweetalert2";

export default function RecruiterProfile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editSection, setEditSection] = useState(null);
  const [form, setForm] = useState({});
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/recruiter/profile");
      setProfile(res.data.data || {});
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  // ✅ LOGO UPLOAD
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);

    await API.post("/recruiter/update-profile", formData);
    Swal.fire("Success", "Logo updated", "success");
    fetchProfile();
  };

  // ✅ SAVE
  const handleSave = async () => {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    if (logo) formData.append("logo", logo);

    await API.post("/recruiter/update-profile", formData);

    Swal.fire("Success", "Profile Updated", "success");
    setEditSection(null);
    fetchProfile();
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-4 mb-5">
        <div className="row">

          {/* SIDEBAR */}
          <div className="col-md-3 col-lg-2">
            <RecruiterSidebar />
          </div>

          {/* MAIN */}
          <div className="col-md-9 col-lg-10">

            {/* HEADER (LIKE CANDIDATE PROFILE) */}
            <div className="card p-4 mb-4 shadow-sm rounded-4">
              <div className="d-flex justify-content-between align-items-center">

                <div className="d-flex gap-3 align-items-center">

                  {/* LOGO */}
                  <div
                    style={{ position: "relative", cursor: "pointer" }}
                    onClick={() =>
                      document.getElementById("logoInput").click()
                    }
                  >
                    <img
                      src={
                        profile.logo
                          ? `https://server.budes.online/public/${profile.logo}`
                          : "/assets/img/default.png"
                      }
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        background: "#fff",
                        borderRadius: "50%",
                        padding: 5,
                      }}
                    >
                      <FaEdit />
                    </div>

                    <input
                      type="file"
                      id="logoInput"
                      hidden
                      onChange={handleLogoUpload}
                    />
                  </div>

                  {/* COMPANY INFO */}
                  <div>
                    <h4>{profile.company_name || "Company Name"}</h4>
                    <p><FaBuilding /> {profile.industry}</p>
                    <p><FaPhone /> {profile.phone}</p>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditSection("basic");
                    setForm({
                      company_name: profile.company_name,
                      industry: profile.industry,
                      phone: profile.phone,
                    });
                  }}
                >
                  Edit
                </button>
              </div>
            </div>

            {/* COMPANY DETAILS */}
            <div className="card p-4 mb-3">
              <div className="d-flex justify-content-between">
                <h5>Company Details</h5>
                <button
                  className="btn btn-light btn-sm border"
                  onClick={() => {
                    setEditSection("company");
                    setForm({
                      company_website: profile.company_website,
                      company_size: profile.company_size,
                    });
                  }}
                >
                  <FaEdit />
                </button>
              </div>

              <p>Website: {profile.company_website}</p>
              <p>Size: {profile.company_size}</p>
            </div>

            {/* DESCRIPTION */}
            <div className="card p-4 mb-3">
              <div className="d-flex justify-content-between">
                <h5>Description</h5>
                <button
                  className="btn btn-light btn-sm border"
                  onClick={() => {
                    setEditSection("desc");
                    setForm({
                      company_description: profile.company_description,
                    });
                  }}
                >
                  <FaEdit />
                </button>
              </div>

              <p>{profile.company_description}</p>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL (LIKE CANDIDATE PROFILE) */}
      {editSection && (
        <div className="modal d-block" style={{ background: "#00000080" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5>Edit {editSection}</h5>

              {editSection === "basic" && (
                <>
                  <input
                    className="form-control mb-2"
                    placeholder="Company Name"
                    value={form.company_name || ""}
                    onChange={(e) =>
                      setForm({ ...form, company_name: e.target.value })
                    }
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="Industry"
                    value={form.industry || ""}
                    onChange={(e) =>
                      setForm({ ...form, industry: e.target.value })
                    }
                  />

                  <input
                    className="form-control"
                    placeholder="Phone"
                    value={form.phone || ""}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </>
              )}

              {editSection === "company" && (
                <>
                  <input
                    className="form-control mb-2"
                    placeholder="Website"
                    value={form.company_website || ""}
                    onChange={(e) =>
                      setForm({ ...form, company_website: e.target.value })
                    }
                  />

                  <input
                    className="form-control"
                    placeholder="Company Size"
                    value={form.company_size || ""}
                    onChange={(e) =>
                      setForm({ ...form, company_size: e.target.value })
                    }
                  />
                </>
              )}

              {editSection === "desc" && (
                <textarea
                  className="form-control"
                  rows="4"
                  value={form.company_description || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      company_description: e.target.value,
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