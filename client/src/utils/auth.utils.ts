import { EMAIL_ROLE_RULES, ROLE_REDIRECT } from "@/constants/auth.constants";
import type { UserRole } from "@/types/auth.types";

export const detectRoleFromEmail = (email: string): UserRole => {
  const lower = email.toLowerCase();

  // Check recruiter rules
  const isRecruiter =
    EMAIL_ROLE_RULES.recruiter.keywords.some((k) => lower.includes(k)) ||
    EMAIL_ROLE_RULES.recruiter.domains.some((d) => lower.endsWith(d));

  if (isRecruiter) return "recruiter";

  // Check mentor rules
  const isMentor =
    EMAIL_ROLE_RULES.mentor.keywords.some((k) => lower.includes(k)) ||
    EMAIL_ROLE_RULES.mentor.domains.some((d) => lower.endsWith(d));

  if (isMentor) return "mentor";

  // Default
  return "student";
};

export const getRoleRedirect = (role: UserRole): string => {
  return ROLE_REDIRECT[role];
};

export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    student: "Student",
    recruiter: "Recruiter",
    mentor: "Mentor",
  };
  return labels[role];
};
