// client/src/types/auth.types.ts

export type UserRole = "student" | "recruiter" | "mentor";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: React.ReactNode;
}
