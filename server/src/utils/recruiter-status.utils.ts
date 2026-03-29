import type { ApplicationStatus } from "../models/application.model.js";

/** Labels used by the recruiter UI (`ApplicantStatusFilter`, `Applicant` type). */
export const RECRUITER_APPLICATION_STATUSES = [
  "Pending",
  "Shortlisted",
  "Interview",
  "Accepted",
  "Rejected",
] as const;
export type RecruiterApplicationStatus =
  (typeof RECRUITER_APPLICATION_STATUSES)[number];

const toRecruiter: Record<ApplicationStatus, RecruiterApplicationStatus> = {
  Applied: "Pending",
  Screening: "Shortlisted",
  Interview: "Interview",
  Offer: "Accepted",
  Rejected: "Rejected",
};

const toDb: Record<RecruiterApplicationStatus, ApplicationStatus> = {
  Pending: "Applied",
  Shortlisted: "Screening",
  Interview: "Interview",
  Accepted: "Offer",
  Rejected: "Rejected",
};

export function applicationStatusToRecruiter(
  s: ApplicationStatus,
): RecruiterApplicationStatus {
  return toRecruiter[s];
}

export function recruiterStatusToApplication(
  s: RecruiterApplicationStatus,
): ApplicationStatus {
  return toDb[s];
}

export function isRecruiterApplicationStatus(
  s: string,
): s is RecruiterApplicationStatus {
  return (RECRUITER_APPLICATION_STATUSES as readonly string[]).includes(s);
}
