import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RecruiterSidebar from "../../components/RecruiterSidebar";
import Swal from "sweetalert2";

export default function RecruiterProfile() {
  const [form, setForm] = useState({});
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    API.get("/recruiter/profile").then((res) => {
      setForm(res.data.data || {});
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  // 🔥 SAVE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    if (logo) formData.append("logo", logo);

    await API.post("/recruiter/update-profile", formData);

    Swal.fire("Success", "Profile Updated", "success");
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-4 mb-5">
        <div className="row">

          <div className="col-md-3 col-lg-2">
            <RecruiterSidebar />
          </div>

          <div className="col-md-9 col-lg-10">
            <div className="container">

              <h3 className="mb-4">Recruiter Profile</h3>

              <form onSubmit={handleSubmit}>

                {/* COMPANY */}
                <div className="card p-4 mb-4 shadow-sm">
                  <h5>Company Info</h5>

                  <input
                    name="company_name"
                    placeholder="Company Name"
                    className="form-control mb-2"
                    value={form.company_name || ""}
                    onChange={handleChange}
                  />

                  <input
                    name="company_website"
                    placeholder="Website"
                    className="form-control mb-2"
                    value={form.company_website || ""}
                    onChange={handleChange}
                  />

                  <input
                    name="industry"
                    placeholder="Industry"
                    className="form-control mb-2"
                    value={form.industry || ""}
                    onChange={handleChange}
                  />

                  <input
                    name="company_size"
                    placeholder="Company Size"
                    className="form-control"
                    value={form.company_size || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* CONTACT */}
                <div className="card p-4 mb-4 shadow-sm">
                  <h5>Contact Person</h5>

                  <input
                    name="contact_person"
                    placeholder="Name"
                    className="form-control mb-2"
                    value={form.contact_person || ""}
                    onChange={handleChange}
                  />

                  <input
                    name="designation"
                    placeholder="Designation"
                    className="form-control mb-2"
                    value={form.designation || ""}
                    onChange={handleChange}
                  />

                  <input
                    name="phone"
                    placeholder="Phone"
                    className="form-control"
                    value={form.phone || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* LOGO */}
                <div className="card p-4 mb-4 shadow-sm text-center">
                  <h5>Company Logo</h5>

                  {preview ? (
                    <img src={preview} height="80" />
                  ) : form.logo ? (
                    <img src={`https://server.budes.online/public/${form.logo}`} height="80" />
                  ) : null}

                  <input type="file" onChange={handleLogo} className="form-control mt-2" />
                </div>

                {/* DESCRIPTION */}
                <div className="card p-4 mb-4 shadow-sm">
                  <h5>Company Description</h5>

                  <textarea
                    name="company_description"
                    className="form-control"
                    rows="4"
                    value={form.company_description || ""}
                    onChange={handleChange}
                  />
                </div>

                <button className="btn btn-success px-5">Save Profile</button>

              </form>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}