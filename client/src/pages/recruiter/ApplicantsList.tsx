import { useEffect, useState } from "react";
import ApplicantCard from "@/components/recruiter/ApplicantCard";
import ApplicantStatusFilterBar from "@/components/recruiter/ApplicantStatusFilter";
import { ApplicantCardSkeleton } from "@/components/ListingSkeletons";
import EmptyState from "@/components/EmptyState";
import type { ApplicantStatusFilter } from "@/constants/recruiter.constants";
import { applicationService, type RecruiterApplicantItem } from "@/services/applicationService";
import { UserSearch } from "lucide-react";

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
    <div className="space-y-6">
      <ApplicantStatusFilterBar
        active={statusFilter}
        onChange={setStatusFilter}
      />

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ApplicantCardSkeleton key={i} />
          ))}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {!isLoading && !errorMessage ? (
        <div className="space-y-4">
          {items.map((a) => (
            <ApplicantCard key={a.applicationId} applicant={a} />
          ))}
        </div>
      ) : null}

      {!isLoading && !errorMessage && items.length === 0 ? (
        <EmptyState
          icon={UserSearch}
          title="No applicants in this view"
          description="Try another filter or share your listings to start receiving applications."
          action={{ label: "My listings", to: "/recruiter/listings" }}
        />
      ) : null}
    </div>
  );
};

export default ApplicantsList;
