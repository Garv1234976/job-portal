import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const handleLogout = async () => {
  try {
    const res = await api.post("/logout");

    const role = res.data.role;

    // ✅ remove token
    localStorage.removeItem("token");

    // ✅ redirect based on role
    if (role === "recruiter") {
      navigate("/recruiter/login");
    } else {
      navigate("/login");
    }

  } catch (err) {
    console.error(err);
  }
};

export default Logout;