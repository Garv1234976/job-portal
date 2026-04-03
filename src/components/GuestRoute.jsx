import { Navigate } from "react-router-dom";

function GuestRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If already logged in → redirect dashboard
  if (token) {
    if (role === "candidate") {
      return <Navigate to="/candidate/dashboard" />;
    } else {
      return <Navigate to="/recruiter/dashboard" />;
    }
  }

  return children;
}

export default GuestRoute;