export const logoutUser = async(navigate) => {
    try {
        // optional API logout
        // await API.post("/logout");
    } catch (e) {}

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/recruiter/login");

    // optional but recommended
    window.location.reload();
};