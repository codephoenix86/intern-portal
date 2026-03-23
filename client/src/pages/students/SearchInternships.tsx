import { useState } from "react";
import { Input } from "@/components/ui/input";
import InternshipCard from "@/components/InternshipCard";
import { internships } from "@/data/mockData";

const SearchInternships = () => {
  const [keyword, setKeyword] = useState("");

  const filtered = internships.filter(
    (i) =>
      i.title.toLowerCase().includes(keyword.toLowerCase()) ||
      i.company.toLowerCase().includes(keyword.toLowerCase()) ||
      i.skills.some((s) => s.toLowerCase().includes(keyword.toLowerCase())),
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by title, company, or skill..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="max-w-lg"
      />
      <div className="grid gap-4">
        {filtered.map((i) => (
          <InternshipCard key={i.id} {...i} />
        ))}
      </div>
    </div>
  );
};

export default SearchInternships;
