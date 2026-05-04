import axios from "axios";
import { emitLogout } from "./authEvents";

const baseURL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL,
  withCredentials: true, // sends httpOnly cookies on every request
  headers: { "Content-Type": "application/json" },
});

// Unwrap response data
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const errorCode = error.response?.data?.errorCode;

    // TOKEN_REUSE: all sessions revoked — force logout immediately
    if (errorCode === "TOKEN_REUSE") {
      emitLogout();
      return Promise.reject(error);
    }

    // 401 on any request (except the refresh call itself) — try silent refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch {
        emitLogout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
