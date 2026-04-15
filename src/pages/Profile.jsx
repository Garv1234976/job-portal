import { useEffect, useState } from "react";
import API from "../services/api";

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

  // ✅ PROFILE COMPLETION LOGIC
  const calculateProfile = () => {
    let percent = 0;

    if (user.name) percent += 10;
    if (user.phone) percent += 10;
    if (user.email) percent += 10;
    if (user.full_name) percent += 10;
    if (user.gender) percent += 10;
    if (user.dob) percent += 10;
    if (user.skills) percent += 10;
    if (user.qualification) percent += 10;
    if (user.preferred_location) percent += 10;
    if (user.cv) percent += 10;

    return percent;
  };

  const profilePercent = calculateProfile();

  return (
    <div className="container py-5">

      <div className="card shadow-lg p-4 rounded-4">

        <div className="row align-items-center">

          {/* LEFT SIDE */}
          <div className="col-md-3 text-center position-relative">

            <div className="position-relative d-inline-block">

              {/* PROFILE IMAGE */}
              <img
                src="/assets/img/default.png"
                className="rounded-circle"
                style={{ width: 120, height: 120 }}
                alt="profile"
              />

              {/* PROGRESS */}
              <svg
                width="140"
                height="140"
                style={{ position: "absolute", top: -10, left: -10 }}
              >
                <circle cx="70" cy="70" r="60" stroke="#eee" strokeWidth="8" fill="none" />
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  stroke="#28a745"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(profilePercent / 100) * 377}, 377`}
                  transform="rotate(-90 70 70)"
                />
              </svg>

              {/* % */}
              <div
                style={{
                  position: "absolute",
                  bottom: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#fff",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
              >
                {profilePercent}%
              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="col-md-9">

            {/* NAME */}
            <div className="d-flex justify-content-between">
              <h3>{user.full_name || user.name}</h3>
              <i className="fa fa-edit" style={{ cursor: "pointer" }}></i>
            </div>

            <p className="text-muted">
              Last updated: {new Date(user.updated_at).toDateString()}
            </p>

            <hr />

            {/* DETAILS */}
            <div className="row">

              <div className="col-md-6 mb-2">
                <i className="fa fa-map-marker text-primary me-2"></i>
                {user.preferred_location || "Add location"}
              </div>

              <div className="col-md-6 mb-2">
                <i className="fa fa-phone text-success me-2"></i>
                {user.phone || "Add phone"}
              </div>

              <div className="col-md-6 mb-2">
                <i className="fa fa-envelope text-danger me-2"></i>
                {user.email}
              </div>

              <div className="col-md-6 mb-2">
                <i className="fa fa-briefcase me-2"></i>
                {user.experience_details || "Fresher"}
              </div>

              <div className="col-md-6 mb-2">
                🎓 {user.qualification || "Add qualification"}
              </div>

              <div className="col-md-6 mb-2">
                🛠 Skills: {user.skills || "Add skills"}
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;