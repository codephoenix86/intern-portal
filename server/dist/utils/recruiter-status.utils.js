/** Labels used by the recruiter UI (`ApplicantStatusFilter`, `Applicant` type). */
export const RECRUITER_APPLICATION_STATUSES = [
    "Pending",
    "Shortlisted",
    "Interview",
    "Accepted",
    "Rejected",
];
const toRecruiter = {
    Applied: "Pending",
    Screening: "Shortlisted",
    Interview: "Interview",
    Offer: "Accepted",
    Rejected: "Rejected",
};
const toDb = {
    Pending: "Applied",
    Shortlisted: "Screening",
    Interview: "Interview",
    Accepted: "Offer",
    Rejected: "Rejected",
};
export function applicationStatusToRecruiter(s) {
    return toRecruiter[s];
}
export function recruiterStatusToApplication(s) {
    return toDb[s];
}
export function isRecruiterApplicationStatus(s) {
    return RECRUITER_APPLICATION_STATUSES.includes(s);
}
//# sourceMappingURL=recruiter-status.utils.js.map