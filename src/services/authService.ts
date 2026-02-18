const API_BASE = "/api";

export const authService = {
  login: async (email: string, password: string) => {
    // Placeholder - returns mock data
    return { token: "mock-token", user: { email, role: "student" } };
  },
  register: async (data: { email: string; password: string; role: string; name: string }) => {
    return { token: "mock-token", user: { ...data } };
  },
  googleAuth: async () => {
    return { redirectUrl: `${API_BASE}/auth/google` };
  },
};
