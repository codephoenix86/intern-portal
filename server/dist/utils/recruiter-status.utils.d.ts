import type { ApplicationStatus } from "../models/application.model.js";
/** Labels used by the recruiter UI (`ApplicantStatusFilter`, `Applicant` type). */
export declare const RECRUITER_APPLICATION_STATUSES: readonly ["Pending", "Shortlisted", "Interview", "Accepted", "Rejected"];
export type RecruiterApplicationStatus = (typeof RECRUITER_APPLICATION_STATUSES)[number];
export declare function applicationStatusToRecruiter(s: ApplicationStatus): RecruiterApplicationStatus;
export declare function recruiterStatusToApplication(s: RecruiterApplicationStatus): ApplicationStatus;
export declare function isRecruiterApplicationStatus(s: string): s is RecruiterApplicationStatus;
//# sourceMappingURL=recruiter-status.utils.d.ts.map