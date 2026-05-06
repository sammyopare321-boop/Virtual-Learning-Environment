import api from "@/utils/axiosInstance";

export const authApi = {
  register: (data) => api.post("/api/auth/register", data),
  login: (data) => api.post("/api/auth/login", data),
  getMe: () => api.get("/api/auth/me"),
  updateMe: (data) => api.put("/api/auth/me", data)
};
