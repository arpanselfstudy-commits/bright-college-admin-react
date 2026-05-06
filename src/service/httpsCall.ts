import axios from "axios";

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

    // Lazy import avoids circular dependency (store → authSlice → AuthApi → httpsCall → store)
    const { store } = await import("../store/store");
    const { forceLogout } = await import("../store/auth.store");

    // TOKEN_REUSE: all sessions revoked — force logout immediately
    if (errorCode === "TOKEN_REUSE") {
      store.dispatch(forceLogout("Your session was revoked. Please log in again."));
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
        store.dispatch(forceLogout("Session expired. Please log in again."));
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
