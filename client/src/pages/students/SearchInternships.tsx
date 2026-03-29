import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import InternshipCard from "@/components/InternshipCard";
import { jobService, type InternshipJob } from "@/services/jobService";
import { Loader2, SlidersHorizontal } from "lucide-react";

const SearchInternships = () => {
  const [keyword, setKeyword] = useState("");
  const [internships, setInternships] = useState<InternshipJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchInternships = async (): Promise<void> => {
        setErrorMessage(null);
        setIsLoading(true);

        try {
          const result = await jobService.getJobs({
            keyword: keyword.trim() || undefined,
            limit: keyword.trim() ? 80 : 120,
          });
          setInternships(result.data);
        } catch (error) {
          console.error("Failed to search internships:", error);
          setErrorMessage("Could not load internships right now. Please try again.");
          setInternships([]);
        } finally {
          setIsLoading(false);
        }
      };

      void fetchInternships();
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by title, company, or skill..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="max-w-lg"
      />

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Searching live internships...</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4">
        {!isLoading && internships.map((i) => (
          <InternshipCard key={i.id} {...i} />
        ))}

        {!isLoading && internships.length === 0 && !errorMessage && (
          <div className="text-center py-10 text-muted-foreground">
            <SlidersHorizontal className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No internships found for this search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInternships;
