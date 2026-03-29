import { useQuery } from "@tanstack/react-query";
import ListingCard from "@/components/recruiter/ListingCard";
import { listRecruiterJobs } from "@/services/recruiterPortal.service";

const MyListings = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recruiter", "jobs"],
    queryFn: listRecruiterJobs,
  });

  const jobs = data?.jobs ?? [];

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading listings…</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">Could not load your listings.</p>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((i) => (
        <ListingCard
          key={i.id}
          id={i.id}
          title={i.title}
          applicants={i.applicants}
          postedDate={i.postedDate}
        />
      ))}
      {jobs.length === 0 && (
        <p className="text-sm text-muted-foreground">
          You have no listings yet. Post an internship to get started.
        </p>
      )}
    </div>
  );
};

export default MyListings;
