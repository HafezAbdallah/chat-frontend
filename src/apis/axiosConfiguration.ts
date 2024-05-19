import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5151/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
