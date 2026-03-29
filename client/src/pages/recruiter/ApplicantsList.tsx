import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ApplicantCard from "@/components/recruiter/ApplicantCard";
import ApplicantStatusFilterBar from "@/components/recruiter/ApplicantStatusFilter";
import {
  listRecruiterApplicants,
  patchRecruiterApplication,
} from "@/services/recruiterPortal.service";
import type { ApplicantStatusFilter } from "@/constants/recruiter.constants";
import type { Applicant } from "@/types/recruiter.types";
import { toast } from "sonner";

const ApplicantsList = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] =
    useState<ApplicantStatusFilter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["recruiter", "applicants", statusFilter],
    queryFn: () =>
      listRecruiterApplicants(
        statusFilter === "all" ? undefined : statusFilter,
      ),
  });

  const patchStatus = useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: string;
    }) => patchRecruiterApplication(applicationId, status),
    onMutate: ({ applicationId }) => {
      setUpdatingId(applicationId);
    },
    onSettled: () => {
      setUpdatingId(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruiter", "applicants"] });
      queryClient.invalidateQueries({ queryKey: ["recruiter", "dashboard"] });
      toast.success("Status updated");
    },
    onError: () => {
      toast.error("Could not update status");
    },
  });

  const applicants = data?.applicants ?? [];

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Loading applicants…</p>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">Could not load applicants.</p>
    );
  }

  return (
    <div className="space-y-4">
      <ApplicantStatusFilterBar
        active={statusFilter}
        onChange={setStatusFilter}
      />

      <div className="space-y-3">
        {applicants.map((a) => (
          <ApplicantCard
            key={a.applicationId}
            applicant={a as Applicant}
            onStatusChange={(applicationId, status) =>
              patchStatus.mutate({ applicationId, status })
            }
            statusUpdating={updatingId === a.applicationId}
          />
        ))}
      </div>
      {applicants.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No applicants in this filter.
        </p>
      )}
    </div>
  );
};

export default ApplicantsList;
