import api from "@/lib/axios";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "student" | "mentor" | "recruiter";
  avatar: string | null;
}

interface AuthData {
  user: AuthUser;
  accessToken: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthData> => {
    const { data } = await api.post<ApiEnvelope<AuthData>>("/auth/login", {
      email,
      password,
    });
    return data.data;
  },

  register: async (payload: {
    email: string;
    password: string;
    role: "student" | "mentor" | "recruiter";
    name: string;
  }): Promise<AuthData> => {
    const { data } = await api.post<ApiEnvelope<AuthData>>(
      "/auth/register",
      payload,
    );
    return data.data;
  },

  googleAuth: async (role?: "student" | "mentor" | "recruiter") => {
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const roleParam = role ? `?role=${role}` : "";
    return { redirectUrl: `${apiBase}/api/auth/google${roleParam}` };
  },
};
