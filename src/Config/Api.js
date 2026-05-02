import axios from "axios"; 
export const API_BASE_URL = "https://project-mgmt-backend-production-b1d3.up.railway.app";
 //export const API_BASE_URL = "http://localhost:8080";

const api = axios.create({ baseURL: API_BASE_URL });

// Use interceptor for dynamic token reading
api.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
