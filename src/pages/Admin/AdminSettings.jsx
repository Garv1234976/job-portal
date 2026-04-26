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

  // FETCH SETTINGS
  useEffect(() => {
    API.get("/admin/settings").then((res) => {
      if (res.data.data) {
        setForm({
          contact: res.data.data.contact || {},
          social: res.data.data.social || {},
          offices: res.data.data.offices || [],
        });
      }
    });
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (section, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // OFFICE CHANGE (FIXED)
  const handleOfficeChange = (index, key, value) => {
    setForm((prev) => {
      const updated = [...prev.offices];
      updated[index] = { ...updated[index], [key]: value };

      return {
        ...prev,
        offices: updated,
      };
    });
  };

  // ADD OFFICE
  const addOffice = () => {
    setForm((prev) => ({
      ...prev,
      offices: [
        ...(prev.offices || []),
        { name: "", address: "", map: "" },
      ],
    }));
  };

  // REMOVE OFFICE
  const removeOffice = (index) => {
    setForm((prev) => ({
      ...prev,
      offices: prev.offices.filter((_, i) => i !== index),
    }));
  };

  // SAVE
  const saveSection = async (section) => {
    try {
      await API.post("/admin/settings", form);

      toast.success("Saved successfully ✅");

      setEdit((prev) => ({
        ...prev,
        [section]: false,
      }));
    } catch {
      toast.error("Something went wrong ❌");
    }
  };

  return (
    <AdminLayout>
      <div className="container mt-4">

        <h3 className="fw-bold mb-4">⚙️ Settings</h3>

        {/* CONTACT */}
        <div className="card shadow-sm p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Contact Info</h5>

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
              <input
                className="form-control mt-3"
                placeholder="Email 1"
                value={form.contact.email_1 || ""}
                onChange={(e) =>
                  handleChange("contact", "email_1", e.target.value)
                }
              />

              <input
                className="form-control mt-2"
                placeholder="Email 2"
                value={form.contact.email_2 || ""}
                onChange={(e) =>
                  handleChange("contact", "email_2", e.target.value)
                }
              />

              <input
                className="form-control mt-2"
                placeholder="Phone 1"
                value={form.contact.phone_1 || ""}
                onChange={(e) =>
                  handleChange("contact", "phone_1", e.target.value)
                }
              />

              <input
                className="form-control mt-2"
                placeholder="Phone 2"
                value={form.contact.phone_2 || ""}
                onChange={(e) =>
                  handleChange("contact", "phone_2", e.target.value)
                }
              />

              <button
                className="btn btn-success btn-sm mt-3"
                onClick={() => saveSection("contact")}
              >
                Save
              </button>
            </>
          ) : (
            <div className="text-muted mt-2">
              <p>{form.contact.email_1}</p>
              <p>{form.contact.phone_1}</p>
            </div>
          )}
        </div>

        {/* SOCIAL */}
        <div className="card shadow-sm p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Social Links</h5>

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
                placeholder="Facebook URL"
                value={form.social.facebook || ""}
                onChange={(e) =>
                  handleChange("social", "facebook", e.target.value)
                }
              />

              <input
                className="form-control mt-2"
                placeholder="LinkedIn URL"
                value={form.social.linkedin || ""}
                onChange={(e) =>
                  handleChange("social", "linkedin", e.target.value)
                }
              />

              <button
                className="btn btn-success btn-sm mt-3"
                onClick={() => saveSection("social")}
              >
                Save
              </button>
            </>
          ) : (
            <div className="text-muted mt-2">
              <p>{form.social.facebook}</p>
              <p>{form.social.linkedin}</p>
            </div>
          )}
        </div>

        {/* OFFICES */}
        <div className="card shadow-sm p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Offices</h5>

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
              {form.offices.map((office, i) => (
                <div
                  key={i}
                  className="border rounded p-2 mt-3"
                >
                  <input
                    className="form-control mb-1"
                    placeholder="Office Name"
                    value={office.name}
                    onChange={(e) =>
                      handleOfficeChange(i, "name", e.target.value)
                    }
                  />

                  <input
                    className="form-control mb-1"
                    placeholder="Address"
                    value={office.address}
                    onChange={(e) =>
                      handleOfficeChange(i, "address", e.target.value)
                    }
                  />

                  <input
                    className="form-control mb-1"
                    placeholder="Google Map Link"
                    value={office.map}
                    onChange={(e) =>
                      handleOfficeChange(i, "map", e.target.value)
                    }
                  />

                  <button
                    className="btn btn-danger btn-sm mt-1"
                    onClick={() => removeOffice(i)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                className="btn btn-primary btn-sm mt-3"
                onClick={addOffice}
              >
                + Add Office
              </button>

              <button
                className="btn btn-success btn-sm mt-3 ms-2"
                onClick={() => saveSection("offices")}
              >
                Save Offices
              </button>
            </>
          ) : (
            form.offices.map((o, i) => (
              <div key={i} className="mt-2 text-muted">
                <strong>{o.name}</strong>
                <div>{o.address}</div>
              </div>
            ))
          )}
        </div>

      </div>
    </AdminLayout>
  );
}