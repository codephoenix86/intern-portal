import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import InternshipCard from "@/components/InternshipCard";
import EmptyState from "@/components/EmptyState";
import { InternshipCardSkeleton } from "@/components/ListingSkeletons";
import { combinedInternshipsService, type CombinedInternship } from "@/services/combinedInternships.service";
import { studentCoursesService } from "@/services/studentCourses.service";
import { useAuth } from "@/contexts/AuthContext";
import { enrolledSkillsFromRows, jobHasEnrolledSkillOverlap } from "@/lib/skill-overlap";
import { Binoculars } from "lucide-react";

const SearchInternships = () => {
  const { user } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [internships, setInternships] = useState<CombinedInternship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [enrolledSkillSet, setEnrolledSkillSet] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (user?.role !== "student") {
      setEnrolledSkillSet(new Set());
      return;
    }
    let cancelled = false;
    const run = async (): Promise<void> => {
      try {
        const rows = await studentCoursesService.listMyEnrollments();
        if (!cancelled) {
          setEnrolledSkillSet(enrolledSkillsFromRows(rows.map((r) => r.skills)));
        }
      } catch {
        if (!cancelled) setEnrolledSkillSet(new Set());
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [user?.role]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchInternships = async (): Promise<void> => {
        setErrorMessage(null);
        setIsLoading(true);

        try {
          const result = await combinedInternshipsService.list({
            keyword: keyword.trim() || undefined,
            limit: keyword.trim() ? 80 : 120,
          });
          setInternships(result.items);
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
    <div className="space-y-6">
      <Input
        placeholder="Search by title, company, or skill..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="max-w-lg h-11"
      />

      {errorMessage ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <InternshipCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {internships.map((i) => (
            <InternshipCard
              key={i.id}
              {...i}
              hasRelatedCourseCoverage={
                user?.role === "student" &&
                jobHasEnrolledSkillOverlap(i.skills, enrolledSkillSet)
              }
            />
          ))}
        </div>
      )}

      {!isLoading && internships.length === 0 && !errorMessage ? (
        <EmptyState
          icon={Binoculars}
          title="No internships match"
          description="Try a broader keyword or browse the public listings to explore more roles."
          action={{ label: "Browse all internships", to: "/internships" }}
        />
      ) : null}
    </div>
  );
};

export default SearchInternships;
