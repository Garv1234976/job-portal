import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();

    // optional: call API logout
    // await api.post("/logout");

    navigate("/login");
  }, []);

  return null;
}

export default Logout;