import { useQuery } from "@tanstack/react-query";
import InternshipCard from "@/components/InternshipCard";
import { listRecommendedJobs } from "@/services/studentPortal.service";

const RecommendedInternships = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["student", "jobs", "recommended"],
    queryFn: listRecommendedJobs,
  });

  const jobs = data?.jobs ?? [];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Based on your profile and skills (match score 80% and above)
      </p>
      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading…</p>
      )}
      {isError && (
        <p className="text-sm text-destructive">Could not load recommendations.</p>
      )}
      <div className="grid gap-4">
        {jobs.map((i) => (
          <InternshipCard key={i.id} {...i} />
        ))}
      </div>
      {!isLoading && jobs.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No strong matches yet — add skills to your profile for better recommendations.
        </p>
      )}
    </div>
  );
};

export default RecommendedInternships;
