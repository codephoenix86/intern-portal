export interface RecruiterSidebarItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

export interface StatusPieItem {
  name: string;
  value: number;
  color: string;
}

export interface Applicant {
  id: number;
  applicationId: string;
  name: string;
  email: string;
  appliedFor: string;
  matchScore: number;
  skills: string[];
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
  status: string;
  resumeUrl?: string | null;
}
