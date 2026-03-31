import { useEffect, useState } from "react";
import ApplicantCard from "@/components/recruiter/ApplicantCard";
import ApplicantStatusFilterBar from "@/components/recruiter/ApplicantStatusFilter";
import type { ApplicantStatusFilter } from "@/constants/recruiter.constants";
import { applicationService, type RecruiterApplicantItem } from "@/services/applicationService";

const ApplicantsList = () => {
  const [statusFilter, setStatusFilter] =
    useState<ApplicantStatusFilter>("all");
  const [items, setItems] = useState<RecruiterApplicantItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await applicationService.getApplicants(statusFilter);
        setItems(data);
      } catch (e) {
        console.error("Failed to load applicants:", e);
        setErrorMessage("Could not load applicants right now.");
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [statusFilter]);

  return (
    <div className="space-y-4">
      <ApplicantStatusFilterBar
        active={statusFilter}
        onChange={setStatusFilter}
      />

      <div className="space-y-3">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading applicants...</p>
        )}

        {errorMessage && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        {!isLoading &&
          !errorMessage &&
          items.map((a) => (
            <ApplicantCard key={a.applicationId} applicant={a} />
          ))}
      </div>
    </div>
  );
};

export default ApplicantsList;
