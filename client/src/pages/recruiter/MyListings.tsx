import ListingCard from "@/components/recruiter/ListingCard";
import { internships } from "@/data/mockData";

const MyListings = () => {
  return (
    <div className="space-y-3">
      {internships.slice(0, 3).map((i) => (
        <ListingCard
          key={i.id}
          id={i.id}
          title={i.title}
          applicants={i.applicants}
          postedDate={i.postedDate}
        />
      ))}
    </div>
  );
};

export default MyListings;
