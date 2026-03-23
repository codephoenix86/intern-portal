import type { StatusPieItem } from "@/types/recruiter.types";

export const STATUS_PIE_DATA: StatusPieItem[] = [
  { name: "Pending", value: 12, color: "hsl(35, 92%, 56%)" },
  { name: "Shortlisted", value: 8, color: "hsl(217, 71%, 53%)" },
  { name: "Interview", value: 5, color: "hsl(162, 72%, 40%)" },
  { name: "Accepted", value: 2, color: "hsl(162, 72%, 30%)" },
  { name: "Rejected", value: 3, color: "hsl(0, 72%, 51%)" },
];

export const APPLICANT_STATUS_FILTERS = [
  "all",
  "Pending",
  "Shortlisted",
  "Interview",
  "Accepted",
  "Rejected",
] as const;

export type ApplicantStatusFilter = (typeof APPLICANT_STATUS_FILTERS)[number];
