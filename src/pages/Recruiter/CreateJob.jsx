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

  const submit = async () => {
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      await API.post("/create-job", formData);

      Swal.fire("Success", "Job Posted Successfully", "success");
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4">
        <h3>Create Job</h3>

        <div className="row g-3">

          {/* Job Title */}
          <div className="col-md-6">
            <label>Job Title *</label>

            <select
              className="form-control mb-2"
              onChange={(e) => setForm({ ...form, job_title: e.target.value })}
            >
              <option value="">Select</option>
              <option>Web Developer</option>
              <option>Designer</option>
              <option>Sales</option>
              <option>Marketing</option>
              <option>Other</option>
            </select>

            <input
              className="form-control"
              name="job_title"
              placeholder="Or type"
              onChange={handleChange}
            />
          </div>

          {/* Logo */}
          <div className="col-md-6">
            <label>Logo</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) =>
                setForm({ ...form, logo: e.target.files[0] })
              }
            />
          </div>

          {/* Description */}
          <div className="col-md-12">
            <label>Description</label>
            <textarea
              className="form-control"
              name="job_description"
              onChange={handleChange}
            />
          </div>

          {/* Education */}
          <div className="col-md-4">
            <label>Education</label>
            <select
              className="form-control"
              name="education"
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>10th</option>
              <option>12th</option>
              <option>Graduate</option>
              <option>Post Graduate</option>
            </select>
          </div>

          {/* Experience */}
          <div className="col-md-4">
            <label>Experience</label>
            <input
              className="form-control"
              name="experience"
              placeholder="0-2"
              onChange={handleChange}
            />
          </div>

          {/* Gender */}
          <div className="col-md-4">
            <label>Gender</label>
            <select className="form-control" name="gender" onChange={handleChange}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Both</option>
            </select>
          </div>

          {/* Location */}
          <div className="col-md-4">
            <label>Location</label>
            <select
              className="form-control"
              name="location"
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Delhi</option>
              <option>Zirakpur</option>
              <option>Mohali</option>
              <option>Remote</option>
            </select>
          </div>

          {/* Salary */}
          <div className="col-md-4">
            <label>Salary Range</label>
            <input
              className="form-control"
              name="salary_range"
              placeholder="0-3"
              onChange={handleChange}
            />
          </div>

          {/* Skills */}
          <div className="col-md-3">
            <label>Skills</label>
            <select
              className="form-control"
              name="skills_required"
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>HTML</option>
              <option>CSS</option>
              <option>React</option>
              <option>Laravel</option>
            </select>
          </div>

          {/* Language */}
          <div className="col-md-3">
            <label>Language</label>
            <select
              className="form-control"
              name="language_required"
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>English</option>
              <option>Hindi</option>
              <option>Punjabi</option>
            </select>
          </div>

          {/* Openings */}
          <div className="col-md-3">
            <label>Openings</label>
            <input
              type="number"
              className="form-control"
              name="openings"
              onChange={handleChange}
            />
          </div>

        </div>

        <button className="btn btn-success mt-3" onClick={submit}>
          Submit
        </button>
      </div>
    </div>
  );
}