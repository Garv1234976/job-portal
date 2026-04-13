import { useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";

export default function CreateJob() {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.job_title) newErrors.job_title = "Required";
    if (!form.job_description) newErrors.job_description = "Required";
    if (!form.education) newErrors.education = "Required";
    if (!form.experience) newErrors.experience = "Required";
    if (!form.gender) newErrors.gender = "Required";
    if (!form.location) newErrors.location = "Required";
    if (!form.salary_range) newErrors.salary_range = "Required";
    if (!form.openings) newErrors.openings = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <h2 className="mb-4 text-center">Create Job</h2>

        <div className="row g-3">

          {/* Job Title (SELECT + INPUT) */}
          <div className="col-md-6">
            <label>Job Title *</label>

            <select
              className="form-control mb-2"
              onChange={(e) =>
                setForm({ ...form, job_title: e.target.value })
              }
            >
              <option value="">Select</option>
              <option>Web Developer</option>
              <option>Graphic Designer</option>
              <option>Sales Executive</option>
              <option>Digital Marketing</option>
              <option>Other</option>
            </select>

            <input
              className="form-control"
              name="job_title"
              placeholder="Or type custom"
              onChange={handleChange}
            />

            <small className="text-danger">{errors.job_title}</small>
          </div>

          {/* Logo */}
          <div className="col-md-6">
            <label>Logo *</label>
            <input
              type="file"
              name="logo"
              className="form-control"
              onChange={(e) =>
                setForm({ ...form, logo: e.target.files[0] })
              }
            />
          </div>

          {/* Key Skills */}
          <div className="col-md-6">
            <label>Key Skills</label>
            <input className="form-control" name="key_skills" onChange={handleChange} />
          </div>

          {/* Description */}
          <div className="col-md-12">
            <label>Job Description *</label>
            <textarea
              className="form-control"
              rows="3"
              name="job_description"
              onChange={handleChange}
            />
            <small className="text-danger">{errors.job_description}</small>
          </div>

          {/* Education (SELECT) */}
          <div className="col-md-4">
            <label>Education *</label>
            <select className="form-control" name="education" onChange={handleChange}>
              <option value="">Select</option>
              <option>10th</option>
              <option>12th</option>
              <option>Graduate</option>
              <option>Post Graduate</option>
            </select>
            <small className="text-danger">{errors.education}</small>
          </div>

          {/* Experience */}
          <div className="col-md-4">
            <label>Experience *</label>
            <input className="form-control" name="experience" placeholder="0-2" onChange={handleChange} />
            <small className="text-danger">{errors.experience}</small>
          </div>

          {/* Gender (UPDATED) */}
          <div className="col-md-4">
            <label>Gender *</label>
            <select className="form-control" name="gender" onChange={handleChange}>
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
            <input className="form-control" name="working_hours" onChange={handleChange} />
          </div>

          {/* Shift */}
          <div className="col-md-4">
            <label>Shift</label>
            <select className="form-control" name="shift" onChange={handleChange}>
              <option>Day</option>
              <option>Night</option>
            </select>
          </div>

          {/* Employment Type */}
          <div className="col-md-4">
            <label>Employment Type</label>
            <select className="form-control" name="employment_type" onChange={handleChange}>
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Contract</option>
              <option>Remote</option>
            </select>
          </div>

          {/* Work Mode */}
          <div className="col-md-4">
            <label>Work Mode</label>
            <select className="form-control" name="work_mode" onChange={handleChange}>
              <option>Onsite</option>
              <option>Hybrid</option>
              <option>WFH</option>
            </select>
          </div>

          {/* Location (SELECT) */}
          <div className="col-md-4">
            <label>Location *</label>
            <select className="form-control" name="location" onChange={handleChange}>
              <option value="">Select</option>
              <option>Delhi</option>
              <option>Zirakpur</option>
              <option>Mohali</option>
              <option>Chandigarh</option>
              <option>Remote</option>
            </select>
            <small className="text-danger">{errors.location}</small>
          </div>

          {/* Salary (UPDATED FORMAT) */}
          <div className="col-md-4">
            <label>Salary Range *</label>
            <input
              className="form-control"
              name="salary_range"
              placeholder="0-3"
              onChange={handleChange}
            />
            <small className="text-muted">Example: 0-3, 3-6, 6-10</small>
            <div className="text-danger">{errors.salary_range}</div>
          </div>

          {/* Benefits */}
          <div className="col-md-12">
            <label>Benefits</label>
            <textarea className="form-control" rows="2" name="benefits" onChange={handleChange} />
          </div>

          {/* Extra */}
          <div className="col-md-3">
            <label>Overtime</label>
            <input className="form-control" name="overtime" onChange={handleChange} />
          </div>

          <div className="col-md-3">
            <label>Cab Facility</label>
            <input className="form-control" name="cab_facility" onChange={handleChange} />
          </div>

          {/* Skills (SELECT) */}
          <div className="col-md-3">
            <label>Skills Required</label>
            <select className="form-control" name="skills_required" onChange={handleChange}>
              <option value="">Select</option>
              <option>HTML</option>
              <option>CSS</option>
              <option>JavaScript</option>
              <option>Laravel</option>
              <option>React</option>
            </select>
          </div>

          {/* Language (SELECT) */}
          <div className="col-md-3">
            <label>Language</label>
            <select className="form-control" name="language_required" onChange={handleChange}>
              <option value="">Select</option>
              <option>English</option>
              <option>Hindi</option>
              <option>Punjabi</option>
            </select>
          </div>

          {/* Openings */}
          <div className="col-md-3">
            <label>Openings *</label>
            <input type="number" className="form-control" name="openings" onChange={handleChange} />
            <small className="text-danger">{errors.openings}</small>
          </div>

          <div className="col-md-3">
            <label>Interview Mode</label>
            <input className="form-control" name="interview_mode" onChange={handleChange} />
          </div>

        </div>

        <div className="text-center mt-4">
          <button className="btn btn-success px-5 py-2" onClick={submit}>
            Post Job
          </button>
        </div>
      </div>
    </div>
  );
}