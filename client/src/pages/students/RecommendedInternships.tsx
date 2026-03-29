import { useEffect, useState } from "react";
import InternshipCard from "@/components/InternshipCard";
import { Loader2 } from "lucide-react";
import { studentPortalService, type StudentJobCard } from "@/services/studentPortal.service";

const RecommendedInternships = () => {
  const [recommended, setRecommended] = useState<StudentJobCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommended = async (): Promise<void> => {
      try {
        const jobs = await studentPortalService.getRecommendedJobs();
        setRecommended(jobs);
      } catch (error) {
        console.error("Failed to load recommended internships:", error);
        setErrorMessage("Could not load recommendations right now.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadRecommended();
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Based on your profile and skills
      </p>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading recommendations...</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4">
        {!isLoading && recommended.map((i) => (
          <InternshipCard key={i.id} {...i} />
        ))}

        {!isLoading && !errorMessage && recommended.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No recommendations yet. Add more skills and projects in your profile.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecommendedInternships;
