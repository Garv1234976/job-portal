import axios from "axios";

const api = axios.create({
    baseURL: "https://server.budes.online/api",
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const currentPath = window.location.pathname;

            // ✅ Only redirect if NOT already on login page
            if (currentPath !== "/login") {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);

export default api;