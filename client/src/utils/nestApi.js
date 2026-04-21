import axios from "axios";

// This will use localhost during development and the VITE_NEST_API_URL during production (Vercel)
const isProd = import.meta.env.PROD;
const baseURL = isProd 
  ? (import.meta.env.VITE_NEST_API_URL || "https://your-nest-domain.up.railway.app") 
  : "http://localhost:5001";

const nestApi = axios.create({
  baseURL,
});

nestApi.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo && userInfo !== "undefined") {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (error) {
        console.error("[NEST API] Invalid JSON in localStorage", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default nestApi;
