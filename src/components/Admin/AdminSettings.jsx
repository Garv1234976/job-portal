import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "./Layout"; //  import layout

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

  useEffect(() => {
    API.get("/settings").then((res) => {
      if (res.data.data) setForm(res.data.data);
    });
  }, []);

  // 🔁 handle nested change
  const handleChange = (section, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // ➕ add office
  const addOffice = () => {
    setForm((prev) => ({
      ...prev,
      offices: [
        ...(prev.offices || []),
        { name: "", address: "", map: "" },
      ],
    }));
  };

  // 🔁 update office
  const handleOfficeChange = (index, key, value) => {
    const updated = [...form.offices];
    updated[index][key] = value;

    setForm({
      ...form,
      offices: updated,
    });
  };

  // ❌ remove office
  const removeOffice = (index) => {
    const updated = form.offices.filter((_, i) => i !== index);
    setForm({ ...form, offices: updated });
  };

  const handleSubmit = async () => {
    await API.post("/admin/settings", form);
    alert("Saved!");
  };

  return (
    <AdminLayout>
      <div className="container mt-4">

        <h3 className="mb-4">Settings</h3>

        {/* CONTACT */}
        <div className="card p-3 mb-4">
          <h5>Contact Info</h5>

          <input
            className="form-control mb-2"
            placeholder="Email 1"
            value={form.contact?.email_1 || ""}
            onChange={(e) =>
              handleChange("contact", "email_1", e.target.value)
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Email 2"
            value={form.contact?.email_2 || ""}
            onChange={(e) =>
              handleChange("contact", "email_2", e.target.value)
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Phone 1"
            value={form.contact?.phone_1 || ""}
            onChange={(e) =>
              handleChange("contact", "phone_1", e.target.value)
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Phone 2"
            value={form.contact?.phone_2 || ""}
            onChange={(e) =>
              handleChange("contact", "phone_2", e.target.value)
            }
          />
        </div>

        {/* SOCIAL */}
        <div className="card p-3 mb-4">
          <h5>Social Links</h5>

          <input
            className="form-control mb-2"
            placeholder="Facebook URL"
            value={form.social?.facebook || ""}
            onChange={(e) =>
              handleChange("social", "facebook", e.target.value)
            }
          />

          <input
            className="form-control mb-2"
            placeholder="LinkedIn URL"
            value={form.social?.linkedin || ""}
            onChange={(e) =>
              handleChange("social", "linkedin", e.target.value)
            }
          />
        </div>

        {/* OFFICES */}
        <div className="card p-3 mb-4">
          <h5>Offices</h5>

          {form.offices?.map((office, i) => (
            <div key={i} className="border p-2 mb-2 rounded">
              <input
                className="form-control mb-2"
                placeholder="Office Name"
                value={office.name}
                onChange={(e) =>
                  handleOfficeChange(i, "name", e.target.value)
                }
              />

              <input
                className="form-control mb-2"
                placeholder="Address"
                value={office.address}
                onChange={(e) =>
                  handleOfficeChange(i, "address", e.target.value)
                }
              />

              <input
                className="form-control mb-2"
                placeholder="Google Map Link"
                value={office.map}
                onChange={(e) =>
                  handleOfficeChange(i, "map", e.target.value)
                }
              />

              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeOffice(i)}
              >
                Remove
              </button>
            </div>
          ))}

          <button className="btn btn-primary btn-sm" onClick={addOffice}>
            + Add Office
          </button>
        </div>

        {/* SAVE */}
        <div className="text-end">
          <button className="btn btn-success" onClick={handleSubmit}>
            Save Settings
          </button>
        </div>

      </div>
    </AdminLayout>
  );
}