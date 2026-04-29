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
  const [isOtherSkill, setIsOtherSkill] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
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
    if (!form.application_limit) newErrors.application_limit = "Required";
    if (!form.salary_min) newErrors.salary_min = "Required";
    if (!form.salary_max) newErrors.salary_max = "Required";
    if (!form.salary_unit) newErrors.salary_unit = "Required";
    if (!form.salary_type) newErrors.salary_type = "Required";
    if (!form.experience_min) newErrors.experience_min = "Required";
    if (!form.experience_max) newErrors.experience_max = "Required";
    if (!form.experience_unit) newErrors.experience_unit = "Required";
    if (
      form.age_min &&
      form.age_max &&
      Number(form.age_min) > Number(form.age_max)
    ) {
      newErrors.age_max = "Max age must be greater than Min";
    }
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

                  {/*  Job Timing (Professional) */}
                  <div className="col-md-6">
                    <label>Job Timing</label>

                    <div className="d-flex gap-2">
                      <input
                        type="time"
                        className="form-control"
                        name="job_time_from"
                        onChange={(e) =>
                          setForm({ ...form, job_time_from: e.target.value })
                        }
                      />

                      <input
                        type="time"
                        className="form-control"
                        name="job_time_to"
                        onChange={(e) =>
                          setForm({ ...form, job_time_to: e.target.value })
                        }
                      />
                    </div>

                    <small className="text-muted">
                      Example: 09:00 AM - 06:00 PM
                    </small>
                  </div>

                  {/*  Age Limit */}
                  <div className="col-md-6">
                    <label>Age Limit</label>

                    <div className="d-flex gap-2">
                      <input
                        type="number"
                        className="form-control"
                        name="age_min"
                        placeholder="Min Age"
                        onChange={handleChange}
                      />

                      <input
                        type="number"
                        className="form-control"
                        name="age_max"
                        placeholder="Max Age"
                        onChange={handleChange}
                      />
                    </div>

                    <small className="text-muted">Example: 18 - 35 years</small>

                    {errors.age_max && (
                      <small className="text-danger">{errors.age_max}</small>
                    )}
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
                  <div className="col-md-6">
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
                        <input
                          type="number"
                          className="form-control"
                          name="experience_min"
                          placeholder="Min"
                          min="0"
                          onChange={handleChange}
                        />
                      </div>

                      {/* Max Experience */}
                      <div className="col-md-3">
                        <input
                          type="number"
                          className="form-control"
                          name="experience_max"
                          placeholder="Max"
                          min="0"
                          onChange={handleChange}
                        />
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
                          <option value="both">Year / Month</option>
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
                  <div className="col-md-6">
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

                  {/* Shift */}
                  <div className="col-md-6">
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

                  {/* ✅ Number of Openings */}
                  <div className="col-md-4">
                    <label>Number of Openings</label>

                    <input
                      type="number"
                      className="form-control"
                      name="openings"
                      placeholder="Enter number of openings"
                      min="1"
                      onChange={handleChange}
                    />

                    <small className="text-muted">Example: 1, 5, 10</small>

                    {errors.openings && (
                      <small className="text-danger">{errors.openings}</small>
                    )}
                  </div>

                  {/* ✅ Interview Deadline */}
                  <div className="col-md-4">
                    <label>Interview Deadline</label>

                    <input
                      type="date"
                      className="form-control"
                      name="interview_deadline"
                      onChange={handleChange}
                    />

                    <small className="text-muted">
                      Select last date for interview
                    </small>

                    {errors.interview_deadline && (
                      <small className="text-danger">
                        {errors.interview_deadline}
                      </small>
                    )}
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
                {/* ✅ Company Link (Website / Google) */}
                <div className="col-md-12">
                  <label>Company Link (Website / Google Profile)</label>

                  <input
                    type="url"
                    className="form-control"
                    name="external_link"
                    placeholder="https://example.com or Google Business link"
                    onChange={handleChange}
                  />

                  <small className="text-muted">
                    Candidate can click this link to visit company profile or
                    website
                  </small>

                  {errors.external_link && (
                    <small className="text-danger">
                      {errors.external_link}
                    </small>
                  )}
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
