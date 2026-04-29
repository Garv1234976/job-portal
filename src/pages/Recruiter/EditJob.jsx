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
  const [logoPreview, setLogoPreview] = useState(null);

  // LOAD JOB
  useEffect(() => {
    API.get(`/job/${id}`).then((res) => {
      const job = res.data.data;

      // ✅ SPLIT job_timing into from/to
      let job_time_from = "";
      let job_time_to = "";

      if (job.job_timing && job.job_timing.includes("-")) {
        const parts = job.job_timing.split("-");
        job_time_from = parts[0]?.trim();
        job_time_to = parts[1]?.trim();
      }

      setForm({
        ...job,
        job_time_from,
        job_time_to,
      });

      if (job.logo) {
        setLogoPreview(`${BASE_URL}/public/storage/${job.logo}`);
      }

      if (job.parent_category) {
        API.get("/categories").then((res) => {
          const cats = res.data.data || [];
          setCategories(cats);

          const selectedCat = cats.find(
            (c) => c.id == job.parent_category
          );
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

      // ✅ FIX job timing combine
      formData.append(
        "job_timing",
        `${form.job_time_from || ""} - ${form.job_time_to || ""}`
      );

      Object.keys(form).forEach((key) => {
        if (key === "logo" && !(form.logo instanceof File)) return;
        if (key === "job_time_from" || key === "job_time_to") return;

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
                    <label>Job Title</label>
                    <input
                      className="form-control"
                      name="job_title"
                      value={form.job_title || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Application Limit */}
                  <div className="col-md-6">
                    <label>Application Limit</label>
                    <input
                      type="number"
                      className="form-control"
                      name="application_limit"
                      value={form.application_limit || ""}
                      onChange={handleChange}
                    />
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

                  {/* Age */}
                  <div className="col-md-6">
                    <label>Age Limit</label>
                    <div className="d-flex gap-2">
                      <input
                        type="number"
                        className="form-control"
                        name="age_min"
                        value={form.age_min || ""}
                        onChange={handleChange}
                      />
                      <input
                        type="number"
                        className="form-control"
                        name="age_max"
                        value={form.age_max || ""}
                        onChange={handleChange}
                      />
                    </div>
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

                  {/* Salary */}
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

                  {/* Openings */}
                  <div className="col-md-4">
                    <label>Openings</label>
                    <input
                      type="number"
                      className="form-control"
                      name="openings"
                      value={form.openings || ""}
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