import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {

    const logoutUser = async () => {
      try {
        const role = localStorage.getItem("role");

        await api.post("/logout");

        localStorage.clear();

        if (role === "recruiter") {
          navigate("/recruiter/login");
        } else {
          navigate("/login");
        }

      } catch (err) {
        console.error(err);

        navigate("/login");
      }
    };

    logoutUser();

  }, []);

  return null;
}

export default Logout;