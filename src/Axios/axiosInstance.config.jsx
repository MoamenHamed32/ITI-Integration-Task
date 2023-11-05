import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    "accept-language": "ar",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const authToken = window.localStorage.getItem("auth");
  config.headers.Authorization = authToken;
  return config;
});
export default axiosInstance;
