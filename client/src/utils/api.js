import axios from "axios";

const api = axios.create({
  baseURL: "https://tea-production-c79c.up.railway.app/api",
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`[API] Token attached to ${config.url}`);
      } else {
        console.warn(`[API] UserInfo found but NO TOKEN for ${config.url}`);
      }
    } else {
      console.warn(`[API] No UserInfo found for ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
