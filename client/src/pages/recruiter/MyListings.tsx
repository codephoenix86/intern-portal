import ListingCard from "@/components/recruiter/ListingCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { recruiterPortalService, type RecruiterJob } from "@/services/recruiterPortal.service";
import { useToast } from "@/hooks/use-toast";

const MyListings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [closingId, setClosingId] = useState<string | null>(null);

  const loadJobs = async (): Promise<void> => {
    try {
      const result = await recruiterPortalService.listJobs();
      setJobs(result);
    } catch (e) {
      console.error("Failed to load recruiter jobs:", e);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadJobs();
  }, []);

  const closeJob = async (jobId: string): Promise<void> => {
    try {
      setClosingId(jobId);
      await recruiterPortalService.closeJob(jobId);
      toast({ title: "Listing closed" });
      await loadJobs();
    } catch (e) {
      console.error("Failed to close job:", e);
      toast({
        title: "Failed to close listing",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setClosingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading listings...</p>
      ) : (
        jobs.slice(0, 3).map((i) => (
          <ListingCard
            key={i.id}
            id={i.id}
            title={i.title}
            applicants={i.applicants}
            postedDate={i.postedDate}
            isActive={i.isActive}
            isClosing={closingId === i.id}
            onEdit={(id) => navigate(`/recruiter/post?edit=${encodeURIComponent(id)}`)}
            onClose={(id) => void closeJob(id)}
          />
        ))
      )}
    </div>
  );
};

export default MyListings;
