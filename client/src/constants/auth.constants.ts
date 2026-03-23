export const ROLE_REDIRECT: Record<string, string> = {
  student: "/student",
  recruiter: "/recruiter",
  mentor: "/mentor",
};

export const EMAIL_ROLE_RULES = {
  recruiter: {
    keywords: ["recruit", "hr"],
    domains: ["@company.com", "@recruiter.com"],
  },
  mentor: {
    keywords: ["mentor", "teacher", "faculty"],
    domains: ["@college.com", "@mentor.com"],
  },
} as const;
