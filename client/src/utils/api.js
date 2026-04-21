import axios from "axios";

const isProd = import.meta.env.PROD;
const expressURL = isProd
  ? (import.meta.env.VITE_EXPRESS_API_URL || "https://tea-production-c79c.up.railway.app/api")
  : "http://localhost:5000/api";

const api = axios.create({
  baseURL: expressURL,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo && userInfo !== "undefined") {
      try {
        const parsed = JSON.parse(userInfo);

        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
          console.log(`[API] Token attached to ${config.url}`);
        } else {
          console.warn(`[API] No token inside userInfo for ${config.url}`);
        }
      } catch (error) {
        console.error("[API] Invalid JSON in localStorage", error);
      }
    } else {
      console.warn(`[API] No userInfo found for ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);
export default api;
