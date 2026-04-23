const handleLogout = async () => {
  try {
    const res = await api.post("/logout");

    const role = res.data.role;

    localStorage.removeItem("token");

    if (role === "recruiter") {
      navigate("/recruiter/login");
    } else {
      navigate("/login");
    }

  } catch (err) {
    console.error(err);
  }
};