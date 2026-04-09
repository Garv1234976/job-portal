import axios from "axios";

const api = axios.create({
    baseURL: "https://server.budes.online/public_html/api"
});

// 🔥 ADD THIS INTERCEPTOR
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;