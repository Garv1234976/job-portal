import API from "../../services/api";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RecruiterSidebar from "../../components/RecruiterSidebar";
import { BASE_URL } from "../../config/constants";

export default function EditJob() {
  const { id } = useParams();

  const [form, setForm] = useState({});
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!form.job_title) newErrors.job_title = "Job title is required";
    if (!form.category_id) newErrors.category_id = "Sub category is required";
    if (!form.job_description)
      newErrors.job_description = "Description is required";
    if (!form.location) newErrors.location = "Location is required";
    if (!form.gender) newErrors.gender = "Gender is required";

    // Experience
    if (!form.experience_min)
      newErrors.experience_min = "Min experience required";
    if (!form.experience_max)
      newErrors.experience_max = "Max experience required";

    if (
      form.experience_min &&
      form.experience_max &&
      Number(form.experience_min) > Number(form.experience_max)
    ) {
      newErrors.experience_max = "Max must be greater than Min";
    }

    // Salary
    if (!form.salary_min) newErrors.salary_min = "Min salary required";
    if (!form.salary_max) newErrors.salary_max = "Max salary required";

    if (
      form.salary_min &&
      form.salary_max &&
      Number(form.salary_min) > Number(form.salary_max)
    ) {
      newErrors.salary_max = "Max must be greater than Min";
    }

    // Job Timing
    if (!form.job_time_from) newErrors.job_time_from = "Start time required";
    if (!form.job_time_to) newErrors.job_time_to = "End time required";

    if (
      form.job_time_from &&
      form.job_time_to &&
      form.job_time_from >= form.job_time_to
    ) {
      newErrors.job_time_to = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    API.get(`/job/${id}`).then((res) => {
      const job = res.data.data;

      API.get("/categories").then((catRes) => {
        const cats = catRes.data.data || [];
        setCategories(cats);

        let parentId = "";

        // ✅ FIND PARENT CATEGORY
        cats.forEach((cat) => {
          const found = cat.children?.find(
            (child) => child.id == job.category_id,
          );
          if (found) {
            parentId = cat.id;
            setSubCategories(cat.children);
          }
        });

        let exp_min = "";
        let exp_max = "";
        let exp_unit = "";

        if (job.experience) {
          const exp = job.experience.trim();

          // ✅ extract numbers using regex (BEST WAY)
          const numbers = exp.match(/\d+/g);

          if (numbers) {
            exp_min = numbers[0] || "";
            exp_max = numbers[1] || numbers[0] || "";
          }

          // unit detect
          if (exp.toLowerCase().includes("year")) {
            exp_unit = "year";
          } else if (exp.toLowerCase().includes("month")) {
            exp_unit = "month";
          } else {
            exp_unit = "both";
          }
        }

        let job_time_from = job.job_time_from || "";
        let job_time_to = job.job_time_to || "";

        // FINAL SET FORM (MOST IMPORTANT)
        setForm({
          ...job,
          parent_category: parentId,

          // experience
          experience_min: exp_min,
          experience_max: exp_max,
          experience_unit: exp_unit,

          // job timing
          job_time_from,
          job_time_to,
        });
      });
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
        if (form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });

      formData.append("_method", "PUT");

      const res = await API.post(`/update-job/${id}`, formData);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data?.message || "Job Updated Successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        window.location.href = "/recruiter/jobs";
      }, 2000);
    } catch (err) {
      // BACKEND VALIDATION ERROR (422)
      if (err.response?.status === 422) {
        const backendErrors = err.response.data.errors;

        let formattedErrors = {};

        Object.keys(backendErrors).forEach((key) => {
          formattedErrors[key] = backendErrors[key][0];
        });

        setErrors(formattedErrors);

        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Please fix the highlighted fields",
        });
      }

      //  UNAUTHORIZED (TOKEN EXPIRED)
      else if (err.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please login again",
        }).then(() => {
          localStorage.clear();
          window.location.href = "/login";
        });
      }

      //  SERVER ERROR
      else if (err.response?.status >= 500) {
        Swal.fire({
          icon: "error",
          title: "Server Error",
          text: "Something went wrong on server",
        });
      }

      //  NETWORK ERROR
      else if (err.message === "Network Error") {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "Check your internet connection",
        });
      }

      //  DEFAULT
      else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Something went wrong",
        });
      }
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

                  {/* Experience */}
                  <div className="col-md-12">
                    <label>Experience</label>
                    <div className="row">
                      <div className="col-md-3">
                        <input
                          type="number"
                          className="form-control"
                          name="experience_min"
                          value={form.experience_min || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-3">
                        <input
                          type="number"
                          className="form-control"
                          name="experience_max"
                          value={form.experience_max || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-control"
                          name="experience_unit"
                          value={form.experience_unit || ""}
                          onChange={handleChange}
                        >
                          <option value="year">Year</option>
                          <option value="month">Month</option>
                          <option value="both">Both</option>
                        </select>
                      </div>
                    </div>
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

                  <div className="col-md-12">
                    <label>Salary</label>
                    <div className="row">
                      <div className="col-md-3">
                        <input
                          type="number"
                          className="form-control"
                          name="salary_min"
                          value={form.salary_min || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-3">
                        <input
                          type="number"
                          className="form-control"
                          name="salary_max"
                          value={form.salary_max || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-control"
                          name="salary_unit"
                          value={form.salary_unit || ""}
                          onChange={handleChange}
                        >
                          <option value="thousand">Thousand</option>
                          <option value="lakh">Lakh</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-control"
                          name="salary_type"
                          value={form.salary_type || ""}
                          onChange={handleChange}
                        >
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Age */}
                  <div className="col-md-6">
                    <label>Age Limit</label>
                    <div className="d-flex gap-2">
                      <input
                        type="number"
                        className="form-control"
                        name="age_min"
                        min="0"
                        value={form.age_min || ""}
                        onChange={handleChange}
                      />
                      <input
                        type="number"
                        className="form-control"
                        name="age_max"
                        min="0"
                        value={form.age_max || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Job Timing */}
                  <div className="col-md-6">
                    <label>Job Timing</label>
                    <div className="d-flex gap-2">
                      <input
                        type="time"
                        className="form-control"
                        name="job_time_from"
                        value={form.job_time_from || ""}
                        onChange={handleChange}
                      />
                      <input
                        type="time"
                        className="form-control"
                        name="job_time_to"
                        value={form.job_time_to || ""}
                        onChange={handleChange}
                      />
                    </div>
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
                    <label>Overtime in Hours</label>
                    <input
                      type="number"
                      className="form-control"
                      name="overtime"
                      value={form.overtime || ""}
                      min="0"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || Number(value) >= 0) {
                          setForm({
                            ...form,
                            overtime: value,
                          });  
                        }
                      }}
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

                  {/* Deadline */}
                  <div className="col-md-4">
                    <label>Interview Deadline</label>
                    <input
                      type="date"
                      className="form-control"
                      name="interview_deadline"
                      value={form.interview_deadline || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Link */}
                  <div className="col-md-12">
                    <label>Company Link</label>
                    <input
                      type="url"
                      className="form-control"
                      name="external_link"
                      value={form.external_link || ""}
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
