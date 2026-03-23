import { useState } from "react";
import ApplicantCard from "@/components/recruiter/ApplicantCard";
import ApplicantStatusFilterBar from "@/components/recruiter/ApplicantStatusFilter";
import { applicants } from "@/data/mockData";
import type { ApplicantStatusFilter } from "@/constants/recruiter.constants";

const ApplicantsList = () => {
  const [statusFilter, setStatusFilter] =
    useState<ApplicantStatusFilter>("all");

  const filtered =
    statusFilter === "all"
      ? applicants
      : applicants.filter((a) => a.status === statusFilter);

  return (
    <div className="space-y-4">
      <ApplicantStatusFilterBar
        active={statusFilter}
        onChange={setStatusFilter}
      />

      <div className="space-y-3">
        {filtered.map((a) => (
          <ApplicantCard key={a.id} applicant={{ ...a, id: Number(a.id) }} />
        ))}
      </div>
    </div>
  );
};

export default ApplicantsList;
