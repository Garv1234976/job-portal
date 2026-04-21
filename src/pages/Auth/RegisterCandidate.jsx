import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Swal from "sweetalert2";
import Select from "react-select";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const qualificationOptions = [
  { value: "10th", label: "10th" },
  { value: "12th", label: "12th" },
  { value: "Diploma", label: "Diploma" },
  { value: "Graduate", label: "Graduate" },
  { value: "Post Graduate", label: "Post Graduate" },
];

const languageOptions = [
  { value: "Hindi", label: "Hindi" },
  { value: "English", label: "English" },
  { value: "Punjabi", label: "Punjabi" },
];

function RegisterCandidate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    alt_phone: "",
    gender: "",
    dob: "",
    aadhar_number: "",
    permanent_address: "",
    current_address: "",
    qualification: [],
    languages_writing: [],
    languages_speaking: [],
    type: "",
    experience: "",
    job_profile: "",
    preferred_location: "",
    skills: [],
    shift: "",
    cv: null,
    experience_details: [{ job_profile: "", years: "" }],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔹 Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // 🔹 Validate
  const validate = () => {
    let newErrors = {};

    // 🔹 Job Profile
    if (!form.job_profile) {
      newErrors.job_profile = "Job profile required";
    }

    // 🔹 Preferred Location
    if (!form.preferred_location) {
      newErrors.preferred_location = "Preferred location required";
    }

    // 🔹 Skills (max 5)
    if (form.skills.length === 0) {
      newErrors.skills = "Select at least 1 skill";
    } else if (form.skills.length > 5) {
      newErrors.skills = "Maximum 5 skills allowed";
    }

    // 🔹 Shift
    if (!form.shift) {
      newErrors.shift = "Select shift";
    }

    if (form.type === "experienced") {
      if (!form.experience_details.length) {
        newErrors.experience_details = "Add at least 1 experience";
      } else {
        form.experience_details.forEach((exp, i) => {
          if (!exp.job_profile || !exp.years) {
            newErrors.experience_details = "Fill all experience fields";
          }
        });
      }
    }

    // 🔹 Name (only letters)
    if (!form.name) {
      newErrors.name = "Name required";
    } else if (!/^[A-Za-z ]+$/.test(form.name)) {
      newErrors.name = "Only letters allowed";
    }

    // 🔹 Email
    if (!form.email) {
      newErrors.email = "Email required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    // 🔹 Phone (10 digit number only)
    if (!form.phone) {
      newErrors.phone = "Phone required";
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    // 🔹 Password
    // if (!form.password) {
    //   newErrors.password = "Password required";
    // } else if (form.password.length < 6) {
    //   newErrors.password = "Minimum 6 characters";
    // }

    // 🔹 Gender
    if (!form.gender) {
      newErrors.gender = "Gender required";
    }

    // 🔹 DOB + AGE CHECK
    if (!form.dob) {
      newErrors.dob = "DOB required";
    } else {
      const today = new Date();
      const dob = new Date(form.dob);

      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      if (age < 18) {
        newErrors.dob = "Age must be at least 18";
      }
    }

    // 🔹 Address
    if (!form.permanent_address) {
      newErrors.permanent_address = "Address required";
    }

    // 🔹 Qualification
    if (form.qualification.length === 0) {
      newErrors.qualification = "Select qualification";
    }

    // 🔹 Language
    if (form.languages_speaking.length === 0) {
      newErrors.languages_speaking = "Select language";
    }

    // 🔹 Type
    if (!form.type) {
      newErrors.type = "Select type";
    }

    // 🔹 Experience
    // if (form.type === "experienced" && !form.experience) {
    //   newErrors.experience = "Enter experience";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      for (let key in form) {
        if (
          key === "skills" ||
          key === "qualification" ||
          key === "languages_writing" ||
          key === "languages_speaking"
        ) {
          form[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else if (key === "experience_details") {
          form.experience_details.forEach((exp, index) => {
            formData.append(
              `experience_details[${index}][job_profile]`,
              exp.job_profile,
            );
            formData.append(`experience_details[${index}][years]`, exp.years);
          });
        } else {
          formData.append(key, form[key]);
        }
      }

      const res = await api.post("/register/candidate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

  
      sessionStorage.setItem("login_id", res.data.login_id);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Registered Successfully\nYour Login ID: " + res.data.login_id,
      }).then(() => {
        navigate("/login");
      });
    } catch (err) {
      console.log(err.response?.data);

      let errorMessage = "Registration failed";

      if (err.response?.data?.errors) {
        errorMessage = Object.values(err.response.data.errors)
          .flat()
          .join("\n");
      }

      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
     <>
      {/* ✅ NAVBAR */}
      <Navbar />
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg p-4">
            <h3 className="text-center text-primary mb-4">
              Candidate Registration
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Name */}
                <div className="col-md-6 mb-3">
                  <label>
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    name="name"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <small className="text-danger">{errors.name}</small>
                  )}
                </div>

                {/* Email */}
                <div className="col-md-6 mb-3">
                  <label>
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <small className="text-danger">{errors.email}</small>
                  )}
                </div>

                {/* Phone */}
                <div className="col-md-6 mb-3">
                  <label>
                    Phone <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                    value={form.phone}
                    maxLength="10"
                    onChange={(e) => {
                      const value = e.target.value;

                      // allow only numbers
                      if (/^[0-9]*$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                  />
                  {errors.phone && (
                    <small className="text-danger">{errors.phone}</small>
                  )}
                </div>

                {/* Aadhar */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Aadhar Number</label>
                  <input
                    name="aadhar_number"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>

                {/* Gender */}
                <div className="col-md-6 mb-3">
                  <label>
                    Gender <span className="text-danger">*</span>
                  </label>
                  <select
                    name="gender"
                    className={`form-control ${errors.gender ? "is-invalid" : ""}`}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                  {errors.gender && (
                    <small className="text-danger">{errors.gender}</small>
                  )}
                </div>

                {/* DOB */}
                <div className="col-md-6 mb-3">
                  <label>
                    DOB <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    className={`form-control ${errors.dob ? "is-invalid" : ""}`}
                    onChange={handleChange}
                  />
                  {errors.dob && (
                    <small className="text-danger">{errors.dob}</small>
                  )}
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
                  {errors.permanent_address && (
                    <small className="text-danger">
                      {errors.permanent_address}
                    </small>
                  )}
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

              <hr />

              {/* Qualification */}
              <div className="mb-3">
                <label>
                  Qualification <span className="text-danger">*</span>
                </label>
                <Select
                  options={qualificationOptions}
                  isMulti
                  onChange={(selected) =>
                    setForm({
                      ...form,
                      qualification: selected
                        ? selected.map((i) => i.value)
                        : [],
                    })
                  }
                />
                {errors.qualification && (
                  <small className="text-danger">{errors.qualification}</small>
                )}
              </div>

              {/* Languages Writing */}
              <div className="mb-3">
                <label className="form-label">Languages Known (Writing)</label>
                <Select
                  options={languageOptions}
                  isMulti
                  onChange={(selected) =>
                    setForm({
                      ...form,
                      languages_writing: selected.map((item) => item.value),
                    })
                  }
                />
              </div>

              {/* Languages Speaking */}
              <div className="mb-4">
                <label className="form-label">
                  Languages Known (Speaking){" "}
                  <span className="text-danger">*</span>
                </label>
                <Select
                  options={languageOptions}
                  isMulti
                  onChange={(selected) =>
                    setForm({
                      ...form,
                      languages_speaking: selected.map((item) => item.value),
                    })
                  }
                />
              </div>

              {/* Type */}
              <div className="mb-3">
                <label>
                  Work status <span className="text-danger">*</span>
                </label>
                <select
                  name="type"
                  className={`form-control ${errors.type ? "is-invalid" : ""}`}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="fresher">Fresher</option>
                  <option value="experienced">Experienced</option>
                </select>
                {errors.type && (
                  <small className="text-danger">{errors.type}</small>
                )}
              </div>

              {/* Experience */}
              {/* {form.type === "experienced" && (
                <div className="mb-3">
                  <label>Experience</label>
                  <input
                    name="experience"
                    className={`form-control ${errors.experience ? "is-invalid" : ""}`}
                    onChange={handleChange}
                  />
                  {errors.experience && (
                    <small className="text-danger">{errors.experience}</small>
                  )}
                </div>
              )} */}

              {form.type && (
                <>
                  <div className="mb-3">
                    <label>
                      Job Profile <span className="text-danger">*</span>
                    </label>
                    <input
                      name="job_profile"
                      className={`form-control ${errors.job_profile ? "is-invalid" : ""}`}
                      onChange={handleChange}
                    />
                    {errors.job_profile && (
                      <small className="text-danger">
                        {errors.job_profile}
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label>
                      Preferred Location <span className="text-danger">*</span>
                    </label>
                    <input
                      name="preferred_location"
                      className={`form-control ${errors.preferred_location ? "is-invalid" : ""}`}
                      onChange={handleChange}
                    />
                    {errors.preferred_location && (
                      <small className="text-danger">
                        {errors.preferred_location}
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label>
                      Skills (Max 5) <span className="text-danger">*</span>
                    </label>
                    <Select
                      isMulti
                      options={[
                        { value: "PHP", label: "PHP" },
                        { value: "Laravel", label: "Laravel" },
                        { value: "React", label: "React" },
                        { value: "Vue", label: "Vue" },
                        { value: "JavaScript", label: "JavaScript" },
                      ]}
                      onChange={(selected) => {
                        if (selected.length <= 5) {
                          setForm({
                            ...form,
                            skills: selected.map((item) => item.value),
                          });
                        } else {
                          Swal.fire("Error", "Only 5 skills allowed", "error");
                        }
                      }}
                    />
                    {errors.skills && (
                      <small className="text-danger">{errors.skills}</small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label>
                      Shift <span className="text-danger">*</span>
                    </label>
                    <select
                      name="shift"
                      className={`form-control ${errors.shift ? "is-invalid" : ""}`}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="day">Day</option>
                      <option value="night">Night</option>
                    </select>
                    {errors.shift && (
                      <small className="text-danger">{errors.shift}</small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label>Upload CV</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) =>
                        setForm({ ...form, cv: e.target.files[0] })
                      }
                    />
                  </div>
                </>
              )}

              {/* Experience Details (Only for Experienced) */}
              {form.type === "experienced" && (
                <div className="mt-3 p-3 border rounded">
                  <h5 className="mb-3">Experience Details</h5>

                  {form.experience_details.map((exp, index) => (
                    <div key={index} className="row mb-3">
                      {/* Job Profile */}
                      <div className="col-md-6">
                        <input
                          type="text"
                          placeholder="Job Profile"
                          className="form-control"
                          value={exp.job_profile}
                          onChange={(e) => {
                            const updated = [...form.experience_details];
                            updated[index].job_profile = e.target.value;
                            setForm({ ...form, experience_details: updated });
                          }}
                        />
                      </div>

                      {/* Years */}
                      <div className="col-md-4">
                        <input
                          type="number"
                          placeholder="Years"
                          className="form-control"
                          value={exp.years}
                          onChange={(e) => {
                            const updated = [...form.experience_details];
                            updated[index].years = e.target.value;
                            setForm({ ...form, experience_details: updated });
                          }}
                        />
                      </div>

                      {/* Remove Button */}
                      <div className="col-md-2">
                        {index > 0 && (
                          <button
                            type="button"
                            className="btn btn-danger w-100"
                            onClick={() => {
                              const updated = form.experience_details.filter(
                                (_, i) => i !== index,
                              );
                              setForm({ ...form, experience_details: updated });
                            }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add More */}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      setForm({
                        ...form,
                        experience_details: [
                          ...form.experience_details,
                          { job_profile: "", years: "" },
                        ],
                      })
                    }
                  >
                    + Add More
                  </button>
                </div>
              )}

              <button type="submit" className="btn btn-success w-100">
                {loading ? "Registering..." : "Register"}
              </button>

              <div className="text-center mt-3">
                Already have an account?{" "}
                <span
                  className="text-primary fw-bold"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                >
                  Login here
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
     <Footer />
    </>
  );
}

export default RegisterCandidate;
