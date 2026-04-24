import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RecruiterSidebar from "../../components/RecruiterSidebar";
import { FaEdit, FaBuilding, FaPhone } from "react-icons/fa";
import Swal from "sweetalert2";
import { BASE_URL } from "../../config/constants";

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
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  //  LOGO UPLOAD
  const handleLogoUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("logo", file);

      const res = await API.post("/recruiter/update-profile", formData);

      if (res.data.status) {
        Swal.fire("Success", "Logo updated", "success");
        fetchProfile();
      } else {
        Swal.fire("Error", "Logo update failed", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Upload failed", "error");
    }
  };

  //  SAVE PROFILE
  const handleSave = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key] !== undefined && form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      if (logo) formData.append("logo", logo);

      const res = await API.post("/recruiter/update-profile", formData);

      if (res.data.status) {
        Swal.fire("Success", "Profile Updated", "success");
        setEditSection(null);
        fetchProfile();
      } else {
        Swal.fire("Error", "Update failed", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
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
            <RecruiterSidebar />
          </div>

          {/* MAIN */}
          <div className="col-md-9 col-lg-10">

            {/* HEADER */}
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
                          ? `${BASE_URL}/public/${profile.logo}`
                          : "/assets/img/default.png"
                      }
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />

                    {/* EDIT ICON */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        background: "#fff",
                        borderRadius: "50%",
                        padding: 6,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      }}
                    >
                      <FaEdit size={12} />
                    </div>

                    <input
                      type="file"
                      id="logoInput"
                      hidden
                      onChange={handleLogoUpload}
                    />
                  </div>

                  {/* INFO */}
                  <div>
                    <h4>{profile.company_name || "Company Name"}</h4>
                    <p><FaBuilding /> {profile.profession}</p>
                    <p><FaPhone /> {profile.contact}</p>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditSection("basic");
                    setForm({
                      company_name: profile.company_name,
                      profession: profile.profession,
                      contact: profile.contact,
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
                      address: profile.address,
                      employer_name: profile.employer_name,
                      position: profile.position,
                      registered_since: profile.registered_since,
                    });
                  }}
                >
                  <FaEdit />
                </button>
              </div>

              <p><b>Address:</b> {profile.address}</p>
              <p><b>Employer:</b> {profile.employer_name}</p>
              <p><b>Position:</b> {profile.position}</p>
              <p><b>Since:</b> {profile.registered_since}</p>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL */}
      {editSection && (
        <div className="modal d-block" style={{ background: "#00000080" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5>Edit Profile</h5>

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
                    placeholder="Profession"
                    value={form.profession || ""}
                    onChange={(e) =>
                      setForm({ ...form, profession: e.target.value })
                    }
                  />

                  <input
                    className="form-control"
                    placeholder="Contact"
                    value={form.contact || ""}
                    onChange={(e) =>
                      setForm({ ...form, contact: e.target.value })
                    }
                  />
                </>
              )}

              {editSection === "company" && (
                <>
                  <input
                    className="form-control mb-2"
                    placeholder="Address"
                    value={form.address || ""}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="Employer Name"
                    value={form.employer_name || ""}
                    onChange={(e) =>
                      setForm({ ...form, employer_name: e.target.value })
                    }
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="Position"
                    value={form.position || ""}
                    onChange={(e) =>
                      setForm({ ...form, position: e.target.value })
                    }
                  />

                  <input
                    type="date"
                    className="form-control"
                    value={form.registered_since || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        registered_since: e.target.value,
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