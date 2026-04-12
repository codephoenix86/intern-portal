export type UserRole = "student" | "recruiter" | "mentor";

// User's role can be null if they signed up via OAuth without selecting a role
export type UserRoleOrNull = UserRole | null;

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
