import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Create Axios Instance ────────────────────────────
const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Send cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Flag to prevent multiple refresh calls ───────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// ── Request Interceptor ──────────────────────────────
// Attach access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor ─────────────────────────────
// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry refresh/login/register endpoints
      const skipPaths = ["/auth/login", "/auth/register", "/auth/refresh"];
      if (skipPaths.some((p) => originalRequest.url?.includes(p))) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint (refresh token is in httpOnly cookie)
        const { data } = await axios.post(
          `${API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newToken = data.data.accessToken;
        localStorage.setItem("accessToken", newToken);

        // Process queued requests
        processQueue(null, newToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Refresh failed — clear everything and redirect to login
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
