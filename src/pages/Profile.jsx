import { useEffect, useState } from "react";
import API from "../services/api";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaEdit } from "react-icons/fa";

function Profile() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");
      setUser(res.data.data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  // ✅ fake profile % (you can calculate later)
  const profilePercent = 28;

  return (
    <div className="container py-5">

      <div className="card shadow-lg p-4 rounded-4">

        <div className="row align-items-center">

          {/* LEFT - PROFILE IMAGE + PROGRESS */}
          <div className="col-md-3 text-center position-relative">

            <div className="position-relative d-inline-block">

              {/* Profile Image */}
              <img
                src="/assets/img/default.png"
                alt="profile"
                className="rounded-circle"
                style={{ width: 120, height: 120 }}
              />

              {/* Progress Circle */}
              <svg
                width="140"
                height="140"
                style={{
                  position: "absolute",
                  top: -10,
                  left: -10,
                }}
              >
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  stroke="#eee"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  stroke="#ff4d4f"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(profilePercent / 100) * 377}, 377`}
                  transform="rotate(-90 70 70)"
                />
              </svg>

              {/* Percentage */}
              <div
                style={{
                  position: "absolute",
                  bottom: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#fff",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {profilePercent}%
              </div>

            </div>

          </div>

          {/* RIGHT - DETAILS */}
          <div className="col-md-9">

            {/* NAME + EDIT */}
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="mb-1">{user.name}</h3>
              <FaEdit style={{ cursor: "pointer" }} />
            </div>

            <p className="text-muted">
              Profile last updated - {new Date().toDateString()}
            </p>

            <hr />

            {/* INFO GRID */}
            <div className="row">

              <div className="col-md-6 mb-2">
                <FaMapMarkerAlt className="me-2 text-primary" />
                {user.location || "Location not added"}
              </div>

              <div className="col-md-6 mb-2">
                <FaPhone className="me-2 text-success" />
                {user.phone || "Phone not added"}
              </div>

              <div className="col-md-6 mb-2">
                <FaEnvelope className="me-2 text-danger" />
                {user.email}
              </div>

              <div className="col-md-6 mb-2">
                🎓 {user.experience || "Fresher"}
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;