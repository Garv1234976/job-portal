import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CandidateSidebar from "../components/candidate/CandidateSidebar";

import { FaEdit, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ SAFE ARRAY (MAIN FIX)
  const safeArray = (data) => {
    if (!data) return [];

    try {
      if (Array.isArray(data)) return data;
      if (typeof data === "string") return JSON.parse(data);
      return [];
    } catch {
      return [];
    }
  };

  // ✅ PROFILE COMPLETION
  const getCompletion = () => {
    let total = 6;
    let filled = 0;

    if (profile.full_name) filled++;
    if (profile.phone) filled++;
    if (profile.preferred_location) filled++;
    if (safeArray(profile.skills).length) filled++;
    if (safeArray(profile.qualification).length) filled++;
    if (profile.cv) filled++;

    return Math.round((filled / total) * 100);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");
      const data = res.data.data;

      // ✅ NORMALIZE HERE (IMPORTANT)
      setProfile({
        ...data,
        skills: safeArray(data.skills),
        qualification: safeArray(data.qualification),
      });

      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-4 mb-5">
        <div className="row">

          {/* SIDEBAR */}
          <div className="col-md-3 col-lg-2">
            <CandidateSidebar />
          </div>

          {/* MAIN */}
          <div className="col-md-9 col-lg-10">

            {/* PROFILE HEADER */}
            <div className="card shadow-sm p-4 mb-4">
              <div className="d-flex align-items-center justify-content-between">

                <div className="d-flex align-items-center gap-3">
                  <img
                    src={
                      profile.photo
                        ? `https://server.budes.online/public/${profile.photo}`
                        : "/assets/img/default.png"
                    }
                    alt=""
                    className="rounded-circle"
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                  />

                  <div>
                    <h4 className="mb-1">{profile.full_name}</h4>
                    <p className="text-muted mb-0">
                      <FaMapMarkerAlt /> {profile.preferred_location || "N/A"}
                    </p>
                    <p className="text-muted mb-0">
                      <FaPhone /> {profile.phone}
                    </p>
                  </div>
                </div>

                <button className="btn btn-outline-primary">
                  <FaEdit /> Edit Profile
                </button>
              </div>

              {/* PROGRESS */}
              <div className="mt-3">
                <small>Profile Completion: {getCompletion()}%</small>
                <div className="progress">
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${getCompletion()}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* SKILLS */}
            <div className="card shadow-sm p-4 mb-4">
              <div className="d-flex justify-content-between">
                <h5>Skills</h5>
                <FaEdit style={{ cursor: "pointer" }} />
              </div>

              <div className="mt-2">
                {safeArray(profile.skills).length ? (
                  safeArray(profile.skills).map((s, i) => (
                    <span key={i} className="badge bg-primary me-2 mb-2">
                      {s}
                    </span>
                  ))
                ) : (
                  <p className="text-muted">No skills added</p>
                )}
              </div>
            </div>

            {/* QUALIFICATION */}
            <div className="card shadow-sm p-4 mb-4">
              <div className="d-flex justify-content-between">
                <h5>Qualification</h5>
                <FaEdit style={{ cursor: "pointer" }} />
              </div>

              <div className="mt-2">
                {safeArray(profile.qualification).length ? (
                  safeArray(profile.qualification).map((q, i) => (
                    <span key={i} className="badge bg-success me-2 mb-2">
                      {q}
                    </span>
                  ))
                ) : (
                  <p className="text-muted">No qualification added</p>
                )}
              </div>
            </div>

            {/* RESUME */}
            <div className="card shadow-sm p-4 mb-4">
              <div className="d-flex justify-content-between">
                <h5>Resume</h5>
                <FaEdit style={{ cursor: "pointer" }} />
              </div>

              <div className="mt-2">
                {profile.cv ? (
                  <a
                    href={`https://server.budes.online/public/${profile.cv}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-primary"
                  >
                    View Resume
                  </a>
                ) : (
                  <p className="text-muted">No resume uploaded</p>
                )}
              </div>
            </div>

            {/* ABOUT */}
            <div className="card shadow-sm p-4 mb-4">
              <div className="d-flex justify-content-between">
                <h5>About</h5>
                <FaEdit style={{ cursor: "pointer" }} />
              </div>

              <p className="text-muted mt-2">
                {profile.introduction || "Add your introduction"}
              </p>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Profile;