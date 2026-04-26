import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "./Layout";
import { toast } from "react-toastify";

export default function AdminSettings() {
  const [form, setForm] = useState({
    contact: {
      email_1: "",
      email_2: "",
      phone_1: "",
      phone_2: "",
    },
    social: {
      facebook: "",
      linkedin: "",
    },
    offices: [],
  });

  const [edit, setEdit] = useState({
    contact: false,
    social: false,
    offices: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // FETCH
  useEffect(() => {
    API.get("/admin/settings")
      .then((res) => {
        if (res.data.data) {
          setForm({
            contact: res.data.data.contact || {},
            social: res.data.data.social || {},
            offices: res.data.data.offices || [],
          });
        }
      })
      .catch(() => {
        toast.error("Failed to load settings ❌");
      });
  }, []);

  // HANDLE CHANGE
  const handleChange = (section, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // OFFICE CHANGE
  const handleOfficeChange = (i, key, value) => {
    setForm((prev) => {
      const updated = [...prev.offices];
      updated[i] = { ...updated[i], [key]: value };
      return { ...prev, offices: updated };
    });
  };

  // ADD OFFICE
  const addOffice = () => {
    setForm((prev) => ({
      ...prev,
      offices: [...prev.offices, { name: "", address: "", map: "" }],
    }));
  };

  // REMOVE OFFICE
  const removeOffice = (i) => {
    setForm((prev) => ({
      ...prev,
      offices: prev.offices.filter((_, index) => index !== i),
    }));
  };

  // VALIDATION
  const validate = () => {
    let newErrors = {};
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /\S+@\S+\.\S+/;

    if (form.contact.phone_1 && !phoneRegex.test(form.contact.phone_1)) {
      newErrors.phone_1 = "Phone must be exactly 10 digits";
    }

    if (form.contact.phone_2 && !phoneRegex.test(form.contact.phone_2)) {
      newErrors.phone_2 = "Phone must be exactly 10 digits";
    }

    if (form.contact.email_1 && !emailRegex.test(form.contact.email_1)) {
      newErrors.email_1 = "Invalid email format";
    }

    if (form.contact.email_2 && !emailRegex.test(form.contact.email_2)) {
      newErrors.email_2 = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SAVE
  const saveSection = async (section) => {
    if (!validate()) {
      toast.error("Please fix errors ❌");
      return;
    }

    try {
      setLoading(true);

      await API.post("/admin/settings", form);

      toast.success("Saved successfully ✅");

      setEdit((prev) => ({
        ...prev,
        [section]: false,
      }));
    } catch {
      toast.error("Save failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mt-4">

        <h3 className="fw-bold mb-4">⚙️ Settings</h3>

        {/* CONTACT */}
        <div className="card p-3 mb-4 shadow-sm">
          <div className="d-flex justify-content-between">
            <h5>Contact Info</h5>

            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() =>
                setEdit((prev) => ({
                  ...prev,
                  contact: !prev.contact,
                }))
              }
            >
              {edit.contact ? "Cancel" : "Edit"}
            </button>
          </div>

          {edit.contact ? (
            <>
              {/* EMAIL 1 */}
              <input
                className="form-control mt-3"
                value={form.contact.email_1 || ""}
                onChange={(e) =>
                  handleChange("contact", "email_1", e.target.value)
                }
                placeholder="Email 1"
              />
              {errors.email_1 && (
                <small className="text-danger">{errors.email_1}</small>
              )}

              {/* EMAIL 2 */}
              <input
                className="form-control mt-2"
                value={form.contact.email_2 || ""}
                onChange={(e) =>
                  handleChange("contact", "email_2", e.target.value)
                }
                placeholder="Email 2"
              />
              {errors.email_2 && (
                <small className="text-danger">{errors.email_2}</small>
              )}

              {/* PHONE 1 */}
              <input
                className="form-control mt-2"
                value={form.contact.phone_1 || ""}
                onChange={(e) =>
                  handleChange(
                    "contact",
                    "phone_1",
                    e.target.value.replace(/\D/g, "")
                  )
                }
                maxLength={10}
                placeholder="Phone 1"
              />
              {errors.phone_1 && (
                <small className="text-danger">{errors.phone_1}</small>
              )}

              {/* PHONE 2 */}
              <input
                className="form-control mt-2"
                value={form.contact.phone_2 || ""}
                onChange={(e) =>
                  handleChange(
                    "contact",
                    "phone_2",
                    e.target.value.replace(/\D/g, "")
                  )
                }
                maxLength={10}
                placeholder="Phone 2"
              />
              {errors.phone_2 && (
                <small className="text-danger">{errors.phone_2}</small>
              )}

              <button
                className="btn btn-success btn-sm mt-3"
                onClick={() => saveSection("contact")}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <div className="text-muted mt-2">
              {form.contact.email_1 || "No email"}
              <br />
              {form.contact.phone_1 || "No phone"}
            </div>
          )}
        </div>

        {/* SOCIAL */}
        <div className="card p-3 mb-4 shadow-sm">
          <div className="d-flex justify-content-between">
            <h5>Social Links</h5>

            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() =>
                setEdit((prev) => ({
                  ...prev,
                  social: !prev.social,
                }))
              }
            >
              {edit.social ? "Cancel" : "Edit"}
            </button>
          </div>

          {edit.social ? (
            <>
              <input
                className="form-control mt-3"
                value={form.social.facebook || ""}
                onChange={(e) =>
                  handleChange("social", "facebook", e.target.value)
                }
                placeholder="Facebook URL"
              />

              <input
                className="form-control mt-2"
                value={form.social.linkedin || ""}
                onChange={(e) =>
                  handleChange("social", "linkedin", e.target.value)
                }
                placeholder="LinkedIn URL"
              />

              <button
                className="btn btn-success btn-sm mt-3"
                onClick={() => saveSection("social")}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <div className="text-muted mt-2">
              {form.social.facebook || "No Facebook"}
              <br />
              {form.social.linkedin || "No LinkedIn"}
            </div>
          )}
        </div>

        {/* OFFICES */}
        <div className="card p-3 mb-4 shadow-sm">
          <div className="d-flex justify-content-between">
            <h5>Companies</h5>

            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() =>
                setEdit((prev) => ({
                  ...prev,
                  offices: !prev.offices,
                }))
              }
            >
              {edit.offices ? "Cancel" : "Edit"}
            </button>
          </div>

          {edit.offices ? (
            <>
              {form.offices.map((o, i) => (
                <div key={i} className="border p-2 mt-3 rounded">
                  <input
                    className="form-control mb-1"
                    value={o.name}
                    onChange={(e) =>
                      handleOfficeChange(i, "name", e.target.value)
                    }
                    placeholder="Office Name"
                  />

                  <input
                    className="form-control mb-1"
                    value={o.address}
                    onChange={(e) =>
                      handleOfficeChange(i, "address", e.target.value)
                    }
                    placeholder="Address"
                  />

                  <input
                    className="form-control mb-1"
                    value={o.map}
                    onChange={(e) =>
                      handleOfficeChange(i, "map", e.target.value)
                    }
                    placeholder="Map Link"
                  />

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeOffice(i)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button className="btn btn-primary btn-sm mt-3" onClick={addOffice}>
                + Add Company
              </button>

              <button
                className="btn btn-success btn-sm mt-3 ms-2"
                onClick={() => saveSection("offices")}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Offices"}
              </button>
            </>
          ) : (
            form.offices.length === 0 ? (
              <div className="text-muted mt-2">No offices added</div>
            ) : (
              form.offices.map((o, i) => (
                <div key={i} className="mt-2 text-muted">
                  <strong>{o.name}</strong>
                  <div>{o.address}</div>
                </div>
              ))
            )
          )}
        </div>

      </div>
    </AdminLayout>
  );
}