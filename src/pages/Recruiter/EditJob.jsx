import API from "../../services/api";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RecruiterSidebar from "../../components/RecruiterSidebar";

export default function EditJob() {
  const { id } = useParams();

  const [form, setForm] = useState({});
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);

  // LOAD JOB
  useEffect(() => {
    API.get(`/job/${id}`).then((res) => {
      const job = res.data.data;
      setForm(job);

      if (job.logo) {
        setLogoPreview(
          `https://server.budes.online/public/storage/${job.logo}`,
        );
      }

      if (job.parent_category) {
        API.get("/categories").then((res) => {
          const cats = res.data.data || [];
          setCategories(cats);

          const selectedCat = cats.find((c) => c.id == job.parent_category);
          setSubCategories(selectedCat?.children || []);
        });
      }
    });
  }, [id]);

  // categories
  useEffect(() => {
    API.get("/categories").then((res) => {
      setCategories(res.data.data || []);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, logo: file });
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;

    setForm({ ...form, parent_category: selectedId, category_id: "" });

    const selectedCat = categories.find((c) => c.id == selectedId);
    setSubCategories(selectedCat?.children || []);
  };

  // SUBMIT
  const submit = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "logo" && !(form.logo instanceof File)) return;
        if (form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });

      formData.append("_method", "PUT");

      await API.post(`/update-job/${id}`, formData);

      Swal.fire("Success", "Job Updated Successfully", "success").then(() => {
        window.location.href = "/recruiter/jobs";
      });
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
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
            <div className="container mt-4">
              <div className="card p-4 shadow">
                <h2 className="text-center mb-4">Edit Job</h2>

                <div className="row g-3">
                  {/* Job Title */}
                  <div className="col-md-6">
                    <label>
                      Job Title <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="job_title"
                      value={form.job_title || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Logo */}
                  <div className="col-md-6">
                    <label>Logo</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleLogoChange}
                    />
                    {logoPreview && (
                      <img src={logoPreview} style={{ width: 100 }} loading="lazy" />
                    )}
                  </div>

                  <div className="col-md-6">
                    <label>
                      Company Name <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="company_name"
                      value={form.company_name || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label>
                      Application Limit <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="application_limit"
                      value={form.application_limit || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Category */}
                  <div className="col-md-6">
                    <label>
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={form.parent_category || ""}
                      onChange={handleCategoryChange}
                    >
                      <option value="">Select</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label>
                      Sub Category <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      name="category_id"
                      value={form.category_id || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      {subCategories.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="col-md-12">
                    <label>
                      Job Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      name="job_description"
                      value={form.job_description || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Key Skills */}
                  <div className="col-md-6">
                    <label>Key Skills</label>
                    <input
                      className="form-control"
                      name="key_skills"
                      value={form.key_skills || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label>Education</label>
                    <input
                      className="form-control"
                      name="education"
                      value={form.education || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label>
                      Experience <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="experience"
                      value={form.experience || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label>
                      Gender <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      name="gender"
                      value={form.gender || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Both</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label>Working Hours</label>
                    <input
                      className="form-control"
                      name="working_hours"
                      value={form.working_hours || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label>Shift</label>
                    <select
                      className="form-control"
                      name="shift"
                      value={form.shift || ""}
                      onChange={handleChange}
                    >
                      <option>Day</option>
                      <option>Night</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label>Employment Type</label>
                    <select
                      className="form-control"
                      name="employment_type"
                      value={form.employment_type || ""}
                      onChange={handleChange}
                    >
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Contract</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label>Work Mode</label>
                    <select
                      className="form-control"
                      name="work_mode"
                      value={form.work_mode || ""}
                      onChange={handleChange}
                    >
                      <option>Onsite</option>
                      <option>Hybrid</option>
                      <option>WFH</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label>Location</label>
                    <input
                      className="form-control"
                      name="location"
                      value={form.location || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label>
                      Salary <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="salary_range"
                      value={form.salary_range || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-12">
                    <label>Benefits</label>
                    <textarea
                      className="form-control"
                      name="benefits"
                      value={form.benefits || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label>Overtime</label>
                    <input
                      className="form-control"
                      name="overtime"
                      value={form.overtime || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label>Cab Facility</label>
                    <input
                      className="form-control"
                      name="cab_facility"
                      value={form.cab_facility || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label>Skills</label>
                    <input
                      className="form-control"
                      name="skills_required"
                      value={form.skills_required || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label>Language</label>
                    <input
                      className="form-control"
                      name="language_required"
                      value={form.language_required || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label>
                      Openings <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="openings"
                      value={form.openings || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label>Interview Mode</label>
                    <input
                      className="form-control"
                      name="interview_mode"
                      value={form.interview_mode || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button className="btn btn-primary" onClick={submit}>
                    Update Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
