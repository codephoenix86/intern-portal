import InternshipCard from "@/components/InternshipCard";
import { internships } from "@/data/mockData";

const RecommendedInternships = () => {
  const recommended = internships.filter((i) => i.matchScore >= 80);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Based on your profile and skills
      </p>
      <div className="grid gap-4">
        {recommended.map((i) => (
          <InternshipCard key={i.id} {...i} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedInternships;
