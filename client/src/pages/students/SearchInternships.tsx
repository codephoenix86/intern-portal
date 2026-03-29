import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import InternshipCard from "@/components/InternshipCard";
import { listStudentJobs } from "@/services/studentPortal.service";

const SearchInternships = () => {
  const [keyword, setKeyword] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(keyword.trim()), 350);
    return () => clearTimeout(t);
  }, [keyword]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["student", "jobs", { keyword: debounced, sort: "newest" as const }],
    queryFn: () =>
      listStudentJobs({
        keyword: debounced || undefined,
        sort: "newest",
      }),
  });

  const jobs = data?.jobs ?? [];

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by title, company, or skill..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="max-w-lg"
      />
      {isLoading && (
        <p className="text-sm text-muted-foreground">Searching…</p>
      )}
      {isError && (
        <p className="text-sm text-destructive">Could not load internships.</p>
      )}
      <div className="grid gap-4">
        {jobs.map((i) => (
          <InternshipCard key={i.id} {...i} />
        ))}
      </div>
      {!isLoading && jobs.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No internships match your search.
        </p>
      )}
    </div>
  );
};

export default SearchInternships;
