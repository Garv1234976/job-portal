import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";

const qualificationOptions = [
  { value: "10th", label: "10th" },
  { value: "12th", label: "12th" },
  { value: "Diploma", label: "Diploma" },
  { value: "Graduate", label: "Graduate" },
  { value: "Post Graduate", label: "Post Graduate" }
];

const languageOptions = [
  { value: "Hindi", label: "Hindi" },
  { value: "English", label: "English" },
  { value: "Punjabi", label: "Punjabi" }

];

function Profile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    alt_phone: "",
    full_name: "",
    gender: "",
    dob: "",
    aadhar_number: "",
    permanent_address: "",
    current_address: "",
    qualification: [],
    languages_writing: [],
    languages_speaking: []
  });

  const [errors, setErrors] = useState({});

  // 🔹 Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Handle Multi Select
  const handleMultiChange = (e) => {
    const { name, options } = e.target;
    let values = [];

    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }

    setForm({ ...form, [name]: values });
  };

  // 🔹 Validation
  const validate = () => {
    let newErrors = {};

    if (!form.full_name) newErrors.full_name = "Full name required";
    if (!form.gender) newErrors.gender = "Gender required";
    if (!form.dob) newErrors.dob = "DOB required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await api.post("/candidate/profile", form);

      Swal.fire({
        icon: "success",
        title: "Profile Saved"
      });

      navigate("/candidate/dashboard");

    } catch (err) {
      console.log(err.response?.data);

      Swal.fire({
        icon: "error",
        title: "Error ❌",
        text: "Something went wrong"
      });
    }
  };

 return (
  <div className="container py-5">
    <div className="row justify-content-center">

      <div className="col-lg-8">
        <div className="card shadow-lg border-0 p-4">

          <h3 className="text-center mb-4 text-primary">
            Complete Your Profile
          </h3>

          <form onSubmit={handleSubmit}>

            <div className="row">

              {/* Full Name */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  name="full_name"
                  className="form-control"
                  onChange={handleChange}
                />
                {errors.full_name && <small className="text-danger">{errors.full_name}</small>}
              </div>

              {/* Alt Phone */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Alternative Number</label>
                <input
                  name="alt_phone"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {/* Gender */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Gender <span className="text-danger">*</span>
                </label>
                <select
                  name="gender"
                  className="form-control"
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                {errors.gender && <small className="text-danger">{errors.gender}</small>}
              </div>

              {/* DOB */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Date of Birth <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  className="form-control"
                  onChange={handleChange}
                />
                {errors.dob && <small className="text-danger">{errors.dob}</small>}
              </div>

              {/* Aadhar */}
              <div className="col-md-12 mb-3">
                <label className="form-label">Aadhar Number</label>
                <input
                  name="aadhar_number"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {/* Permanent Address */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Permanent Address <span className="text-danger">*</span>
                </label>
                <textarea
                  name="permanent_address"
                  className="form-control"
                  rows="3"
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Current Address */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Current Address</label>
                <textarea
                  name="current_address"
                  className="form-control"
                  rows="3"
                  onChange={handleChange}
                ></textarea>
              </div>

            </div>

            {/* Divider */}
            <hr className="my-4" />

            {/* Qualification */}
            <div className="mb-3">
              <label className="form-label">
                Academic Qualification <span className="text-danger">*</span>
              </label>
              <Select
                options={qualificationOptions}
                isMulti
                onChange={(selected) =>
                  setForm({
                    ...form,
                    qualification: selected.map((item) => item.value)
                  })
                }
              />
            </div>

            {/* Languages Writing */}
            <div className="mb-3">
              <label className="form-label">
                Languages Known (Writing)
              </label>
              <Select
                options={languageOptions}
                isMulti
                onChange={(selected) =>
                  setForm({
                    ...form,
                    languages_writing: selected.map((item) => item.value)
                  })
                }
              />
            </div>

            {/* Languages Speaking */}
            <div className="mb-4">
              <label className="form-label">
                Languages Known (Speaking) <span className="text-danger">*</span>
              </label>
              <Select
                options={languageOptions}
                isMulti
                onChange={(selected) =>
                  setForm({
                    ...form,
                    languages_speaking: selected.map((item) => item.value)
                  })
                }
              />
            </div>

            {/* Submit */}
            <button className="btn btn-primary w-100 py-2">
              Save Profile
            </button>

          </form>
        </div>
      </div>

    </div>
  </div>
);
}

export default Profile;