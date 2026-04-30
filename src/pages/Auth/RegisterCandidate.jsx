import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Swal from "sweetalert2";
import Select from "react-select";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";

function RegisterCandidate() {
  const navigate = useNavigate();

  const languageOptions = [
    { value: "Hindi", label: "Hindi" },
    { value: "English", label: "English" },
    { value: "Punjabi", label: "Punjabi" },
  ];

  const [master, setMaster] = useState({});

  useEffect(() => {
    api.get("/get-master-data").then((res) => {
      setMaster(res.data.data);
    });
  }, []);

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
    qualification: "",
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

  const [qualificationParent, setQualificationParent] = useState("");
  const [qualificationChild, setQualificationChild] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.name) newErrors.name = "Name required";
    else if (form.name.length > 255)
      newErrors.name = "Maximum 255 characters allowed";

    if (!form.email) newErrors.email = "Email required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Invalid email";

    if (!form.phone) newErrors.phone = "Phone required";
    else if (!/^[0-9]{10}$/.test(form.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (form.alt_phone) {
      if (!/^[0-9]{10}$/.test(form.alt_phone))
        newErrors.alt_phone = "Alt phone must be 10 digits";
      else if (form.alt_phone === form.phone)
        newErrors.alt_phone = "Alt phone must be different";
    }

    if (form.aadhar_number && !/^[0-9]{12}$/.test(form.aadhar_number))
      newErrors.aadhar_number = "Aadhar must be 12 digits";

    if (!form.permanent_address)
      newErrors.permanent_address = "Address required";

    if (!form.job_profile) newErrors.job_profile = "Job profile required";
    if (!form.preferred_location)
      newErrors.preferred_location = "Preferred location required";

    if (form.skills.length === 0) newErrors.skills = "Select at least 1 skill";

    if (!form.shift) newErrors.shift = "Select shift";
    if (!form.gender) newErrors.gender = "Gender required";
    if (!form.dob) newErrors.dob = "DOB required";

    if (!form.qualification) newErrors.qualification = "Select qualification";

    if (form.languages_speaking.length === 0)
      newErrors.languages_speaking = "Select language";

    if (!form.type) newErrors.type = "Select type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const formData = new FormData();

      for (let key in form) {
        if (
          key === "skills" ||
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
        text: "Registered Successfully\nLogin ID: " + res.data.login_id,
      }).then(() => navigate("/login"));
    } catch (err) {
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
      {/*  NAVBAR */}
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
                    {errors.aadhar_number && (
                      <small className="text-danger">
                        {errors.aadhar_number}
                      </small>
                    )}
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

                {/* QUALIFICATION */}
                <select
                  value={qualificationParent}
                  className="form-control mb-2"
                  onChange={(e) => {
                    const value = e.target.value;
                    setQualificationParent(value);

                    const selected = master.qualification?.find(
                      (i) => i.id == value,
                    );

                    setQualificationChild(selected?.children || []);

                    if (!selected?.children?.length) {
                      setForm({ ...form, qualification: selected.name });
                    } else {
                      setForm({ ...form, qualification: "" });
                    }
                  }}
                >
                  <option>Select Qualification</option>
                  {master.qualification?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                {qualificationChild.length > 0 && (
                  <select
                    className="form-control mb-2"
                    value={form.qualification}
                    onChange={(e) =>
                      setForm({ ...form, qualification: e.target.value })
                    }
                  >
                    <option>Select Degree</option>
                    {qualificationChild.map((c) => (
                      <option key={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}

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
                        Preferred Location{" "}
                        <span className="text-danger">*</span>
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
                            Swal.fire(
                              "Error",
                              "Only 5 skills allowed",
                              "error",
                            );
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
                        accept=".pdf,.doc,.docx"
                        className="form-control"
                        onChange={(e) => {
                          const file = e.target.files[0];

                          if (!file) return;

                          const allowed = [
                            "application/pdf",
                            "application/msword",
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                          ];
                          if (!allowed.includes(file.type)) {
                            Swal.fire(
                              "Error",
                              "Only PDF, DOC, DOCX allowed",
                              "error",
                            );
                            e.target.value = "";
                            return;
                          }

                          setForm({ ...form, cv: file });
                        }}
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
                                setForm({
                                  ...form,
                                  experience_details: updated,
                                });
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
