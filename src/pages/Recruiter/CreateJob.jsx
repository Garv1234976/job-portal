import API from "../../services/api";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RecruiterSidebar from "../../components/RecruiterSidebar";

export default function CreateJob() {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isOther, setIsOther] = useState(false);
  const [master, setMaster] = useState({});
  const [educationParent, setEducationParent] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      Swal.fire("Error", "Only JPG, JPEG, PNG files allowed", "error");
      return;
    }

    setForm({ ...form, logo: file });

    setLogoPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    let newErrors = {};

    if (!form.job_title) newErrors.job_title = "Required";
    if (!form.job_description) newErrors.job_description = "Required";
    const selected = master.education?.find((e) => e.id == educationParent);

    //  only validate degree if children exist
    if (selected?.children?.length > 0 && !form.education) {
      newErrors.education = "Required";
    }

    //  if no parent selected at all
    if (!educationParent) {
      newErrors.education = "Required";
    }
    if (!form.gender) newErrors.gender = "Required";
    if (!form.location) newErrors.location = "Required";
    if (!form.openings) newErrors.openings = "Required";
    if (!form.category_id) newErrors.category_id = "Required";
    if (!form.company_name) newErrors.company_name = "Required";
    if (!form.application_limit) newErrors.application_limit = "Required";
    if (!form.salary_min) newErrors.salary_min = "Required";
    if (!form.salary_max) newErrors.salary_max = "Required";
    if (!form.salary_unit) newErrors.salary_unit = "Required";
    if (!form.salary_type) newErrors.salary_type = "Required";
    if (!form.experience_min) newErrors.experience_min = "Required";
    if (!form.experience_max) newErrors.experience_max = "Required";
    if (!form.experience_unit) newErrors.experience_unit = "Required";

    if (
      form.experience_min &&
      form.experience_max &&
      Number(form.experience_min) > Number(form.experience_max)
    ) {
      newErrors.experience_max = "Max must be greater than Min";
    }

    if (
      form.salary_min &&
      form.salary_max &&
      Number(form.salary_min) > Number(form.salary_max)
    ) {
      newErrors.salary_max = "Max must be greater than Min";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    API.get("/get-master-data").then((res) => {
      const raw = res.data.data || [];

      const grouped = raw.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];

        //  EDUCATION: only parent (main level)
        if (item.type === "education") {
          if (item.parent_id === null) {
            acc[item.type].push(item);
          }
        } else {
          // other types normal
          acc[item.type].push(item);
        }

        return acc;
      }, {});

      setMaster(grouped);
    });
  }, []);

  useEffect(() => {
    API.get("/categories").then((res) => {
      setCategories(res.data.data || []);
    });
  }, []);

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;

    setForm({ ...form, parent_category: selectedId, category_id: "" });

    const selectedCat = categories.find((c) => c.id == selectedId);
    setSubCategories(selectedCat?.children || []);
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      await API.post("/create-job", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success", "Job Posted Successfully", "success").then(() => {
        window.location.href = "/recruiter/jobs";
      });
    } catch (err) {
      const data = err.response?.data;

      if (data?.upgrade) {
        Swal.fire("Limit Reached", data.message, "warning");
      } else {
        Swal.fire("Error", data?.message || "Something went wrong", "error");
      }
    }
  };

  return (
    <>
      <Navbar />

      {/*  FIXED LAYOUT */}
      <div className="container-fluid mt-4 mb-5">
        <div className="row">
          {/*  SIDEBAR (LEFT SIDE) */}
          <div className="col-md-3 col-lg-2 mb-3">
            <RecruiterSidebar />
          </div>

          {/*  MAIN CONTENT */}
          <div className="col-md-9 col-lg-10">
            <div className="container mt-4">
              {/*  YOUR ORIGINAL CARD (UNCHANGED) */}
              <div className="card shadow-lg p-4">
                <h2 className="mb-4 text-center">Create Job</h2>

                <div className="row g-3">
                  {/* Job Title (SELECT + INPUT) */}
                  <div className="col-md-6">
                    <label>
                      Job Title <span className="text-danger">*</span>
                    </label>

                    <select
                      className="form-control mb-2"
                      onChange={(e) => {
                        const value = e.target.value;

                        if (value === "Other") {
                          setIsOther(true);
                          setForm({ ...form, job_title: "" });
                        } else {
                          setIsOther(false);
                          setForm({ ...form, job_title: value });
                        }
                      }}
                    >
                      <option value="">Select</option>

                      {master.job_title?.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}

                      <option value="Other">Other</option>
                    </select>

                    {isOther && (
                      <input
                        className="form-control"
                        name="job_title"
                        placeholder="Enter custom job title"
                        onChange={handleChange}
                      />
                    )}

                    <small className="text-danger">{errors.job_title}</small>
                  </div>

                  <div className="col-md-6">
                    <label>
                      Application Limit <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="application_limit"
                      placeholder="e.g. 1000"
                      onChange={handleChange}
                    />
                    <small className="text-danger">
                      {errors.application_limit}
                    </small>
                  </div>

                  {/* CATEGORY */}
                  <div className="col-md-6">
                    <label>
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      onChange={handleCategoryChange}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SUBCATEGORY */}
                  <div className="col-md-6">
                    <label>
                      Sub Category <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      name="category_id"
                      onChange={handleChange}
                    >
                      <option value="">Select Sub Category</option>
                      {subCategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>

                    <small className="text-danger">{errors.category_id}</small>
                  </div>

                  <div className="col-md-6">
                    <label>Key Skills</label>

                    {/* SELECT FROM MASTER */}
                    <select
                      className="form-control mb-2"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!value) return;

                        const current = form.key_skills
                          ? form.key_skills.split(",")
                          : [];

                        if (!current.includes(value)) {
                          setForm({
                            ...form,
                            key_skills: [...current, value].join(","),
                          });
                        }

                        e.target.value = "";
                      }}
                    >
                      <option value="">Select Skill</option>
                      {master.key_skills?.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    {/* ADD CUSTOM SKILL */}
                    <input
                      className="form-control mb-2"
                      placeholder="Type skill and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();

                          const value = e.target.value.trim();
                          if (!value) return;

                          const current = form.key_skills
                            ? form.key_skills.split(",")
                            : [];

                          if (!current.includes(value)) {
                            setForm({
                              ...form,
                              key_skills: [...current, value].join(","),
                            });
                          }

                          e.target.value = "";
                        }
                      }}
                    />

                    {/* TAG VIEW */}
                    <div>
                      {form.key_skills?.split(",").map((skill, index) => (
                        <span
                          key={index}
                          className="badge bg-primary me-2 mb-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            const updated = form.key_skills
                              .split(",")
                              .filter((_, i) => i !== index);

                            setForm({
                              ...form,
                              key_skills: updated.join(","),
                            });
                          }}
                        >
                          {skill} ×
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-md-12">
                    <label>
                      Job Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="job_description"
                      onChange={handleChange}
                    />
                    <small className="text-danger">
                      {errors.job_description}
                    </small>
                  </div>

                  {/* EDUCATION LEVEL */}
                  <div className="col-md-4">
                    <label>
                      Education Level <span className="text-danger">*</span>
                    </label>

                    <select
                      className="form-control"
                      value={educationParent}
                      onChange={(e) => {
                        const value = e.target.value;

                        setEducationParent(value);

                        //  reset degree when level changes
                        const selected = master.education?.find(
                          (i) => i.id == value,
                        );

                        //  AUTO SET EDUCATION IF NO CHILD
                        if (
                          !selected?.children ||
                          selected.children.length === 0
                        ) {
                          setForm({
                            ...form,
                            education: selected.name,
                          });
                        } else {
                          setForm({
                            ...form,
                            education: "",
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
                  </div>

                  {educationParent &&
                    master.education?.find((e) => e.id == educationParent)
                      ?.children?.length > 0 && (
                      <div className="col-md-4">
                        <label>
                          Degree <span className="text-danger">*</span>
                        </label>

                        <select
                          className="form-control"
                          name="education"
                          value={form.education || ""}
                          onChange={handleChange}
                        >
                          <option value="">Select Degree</option>

                          {master.education
                            ?.find((e) => e.id == educationParent)
                            ?.children?.map((child) => (
                              <option key={child.id} value={child.name}>
                                {child.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

                  {/* Experience Range */}
                  <div className="col-md-12">
                    <label>
                      Experience <span className="text-danger">*</span>
                    </label>

                    <div className="row">
                      {/* Min Experience */}
                      <div className="col-md-3">
                        <select
                          className="form-control"
                          name="experience_min"
                          onChange={handleChange}
                        >
                          <option value="">Min</option>
                          {[...Array(6)].map((_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Max Experience */}
                      <div className="col-md-3">
                        <select
                          className="form-control"
                          name="experience_max"
                          onChange={handleChange}
                        >
                          <option value="">Max</option>
                          {[...Array(6)].map((_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Unit */}
                      <div className="col-md-3">
                        <select
                          className="form-control"
                          name="experience_unit"
                          onChange={handleChange}
                        >
                          <option value="">Select Unit</option>
                          <option value="year">Year</option>
                          <option value="month">Month</option>
                        </select>
                      </div>
                    </div>

                    <small className="text-muted">
                      Example: 0 - 3 Years OR 6 - 24 Months
                    </small>

                    <div className="text-danger">{errors.experience_min}</div>
                    <div className="text-danger">{errors.experience_max}</div>
                  </div>

                  {/* Gender (UPDATED) */}
                  <div className="col-md-4">
                    <label>
                      Gender <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      name="gender"
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Both</option>
                    </select>
                    <small className="text-danger">{errors.gender}</small>
                  </div>

                  {/* Working Hours */}
                  <div className="col-md-4">
                    <label>Working Hours</label>
                    <input
                      className="form-control"
                      name="working_hours"
                      onChange={handleChange}
                    />
                  </div>

                  {/* Shift */}
                  <div className="col-md-4">
                    <label>Shift</label>
                    <select
                      className="form-control"
                      name="shift"
                      onChange={handleChange}
                    >
                      <option>Day</option>
                      <option>Night</option>
                      <option>Rotational</option>
                    </select>
                  </div>

                  {/* Employment Type */}
                  <div className="col-md-4">
                    <label>Employment Type</label>
                    <select
                      className="form-control"
                      name="employment_type"
                      onChange={handleChange}
                    >
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Contract</option>
                      <option>Remote</option>
                    </select>
                  </div>

                  {/* Work Mode */}
                  <div className="col-md-4">
                    <label>Work Mode</label>
                    <select
                      className="form-control"
                      name="work_mode"
                      onChange={handleChange}
                    >
                      <option>Onsite</option>
                      <option>Hybrid</option>
                      <option>WFH</option>
                    </select>
                  </div>

                  {/* Location (SELECT) */}
                  <div className="col-md-4">
                    <label>
                      Location <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      name="location"
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      {master.location?.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <small className="text-danger">{errors.location}</small>
                  </div>

                  {/* Salary Section */}
                  <div className="col-md-12">
                    <label>
                      Salary <span className="text-danger">*</span>
                    </label>

                    <div className="row">
                      {/* Min Salary */}
                      <div className="col-md-3">
                        <input
                          type="number"
                          className="form-control"
                          name="salary_min"
                          placeholder="Min"
                          onChange={handleChange}
                        />
                      </div>

                      {/* Max Salary */}
                      <div className="col-md-3">
                        <input
                          type="number"
                          className="form-control"
                          name="salary_max"
                          placeholder="Max"
                          onChange={handleChange}
                        />
                      </div>

                      {/* Unit */}
                      <div className="col-md-3">
                        <select
                          className="form-control"
                          name="salary_unit"
                          onChange={handleChange}
                        >
                          <option value="">Select Unit</option>
                          <option value="thousand">Thousand</option>
                          <option value="lakh">Lakh</option>
                        </select>
                      </div>

                      {/* Type */}
                      <div className="col-md-3">
                        <select
                          className="form-control"
                          name="salary_type"
                          onChange={handleChange}
                        >
                          <option value="">Select Type</option>
                          <option value="monthly">Per Month</option>
                          <option value="yearly">Per Year</option>
                        </select>
                      </div>
                    </div>

                    <small className="text-muted">
                      Example: 20 - 40 Lakh Per Year OR 15 - 25 Thousand Per
                      Month
                    </small>

                    <div className="text-danger">{errors.salary_min}</div>
                    <div className="text-danger">{errors.salary_max}</div>
                  </div>

                  {/* Benefits */}
                  <div className="col-md-12">
                    <label>Benefits</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      name="benefits"
                      onChange={handleChange}
                    />
                  </div>

                  {/* Extra */}
                  <div className="col-md-3">
                    <label>Overtime</label>
                    <input
                      className="form-control"
                      name="overtime"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label>Cab Facility</label>
                    <input
                      className="form-control"
                      name="cab_facility"
                      onChange={handleChange}
                    />
                  </div>

                  {/* Skills (SELECT) */}
                  <div className="col-md-3">
                    <label>Skills Required</label>
                    <select
                      className="form-control"
                      name="skills_required"
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      {master.skill?.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Language (SELECT) */}
                  <div className="col-md-3">
                    <label>Language</label>
                    <select
                      className="form-control"
                      name="language_required"
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      {master.language?.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Openings */}
                  <div className="col-md-3">
                    <label>
                      Openings <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="openings"
                      onChange={handleChange}
                    />
                    <small className="text-danger">{errors.openings}</small>
                  </div>

                  <div className="col-md-3">
                    <label>Interview Mode</label>
                    <input
                      className="form-control"
                      name="interview_mode"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button
                    className="btn btn-success px-5 py-2"
                    onClick={submit}
                  >
                    Post Job
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
