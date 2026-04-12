import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import InternshipCard from "@/components/InternshipCard";
import EmptyState from "@/components/EmptyState";
import { InternshipCardSkeleton } from "@/components/ListingSkeletons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Binoculars, Loader2 } from "lucide-react";
import { combinedInternshipsService, type CombinedInternship } from "@/services/combinedInternships.service";
import { studentCoursesService } from "@/services/studentCourses.service";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { enrolledSkillsFromRows, jobHasEnrolledSkillOverlap } from "@/lib/skill-overlap";

const Internships = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [locationFilter, setLocationFilter] = useState("all");
  const [internships, setInternships] = useState<CombinedInternship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  const fetchInternships = useCallback(
    async (showLoading: boolean): Promise<void> => {
      if (showLoading) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      setErrorMessage(null);

      try {
        const result = await combinedInternshipsService.list({ limit: 120 });
        setInternships(result.items);

        if (result.sourceWarnings.length > 0) {
          toast({
            title: "Web source warning",
            description: result.sourceWarnings[0],
          });
        }
      } catch (error) {
        console.error("Failed to load internships:", error);
        setErrorMessage("Could not load live internships. Please try again.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    void fetchInternships(true);
  }, [fetchInternships]);

  const locations = useMemo(
    () => ["all", ...new Set(internships.map((i) => i.location))],
    [internships],
  );

  let filtered = internships.filter(
    (i) =>
      (keyword === "" ||
        i.title.toLowerCase().includes(keyword.toLowerCase()) ||
        i.company.toLowerCase().includes(keyword.toLowerCase()) ||
        i.skills.some((s) => s.toLowerCase().includes(keyword.toLowerCase()))) &&
      (locationFilter === "all" || i.location === locationFilter),
  );

  if (sortBy === "match") {
    filtered = [...filtered].sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Browse internships
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Live listings from the platform and partner feeds — filter by location and skill.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by keyword, skill…"
              className="h-11 pl-10"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="h-11 w-full sm:w-[200px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((l) => (
                <SelectItem key={l} value={l}>
                  {l === "all" ? "All locations" : l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-11 w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="match">Highest match</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="h-11"
            onClick={() => void fetchInternships(false)}
            disabled={isRefreshing}
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>

        <p className="mb-6 text-sm text-muted-foreground">
          {isLoading ? "Loading…" : `${filtered.length} internships in this view`}
        </p>

        {errorMessage ? (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <InternshipCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((i) => (
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

        {!isLoading && filtered.length === 0 && !errorMessage ? (
          <EmptyState
            icon={Binoculars}
            title="No internships in this view"
            description="Try clearing filters or refreshing — new roles are added regularly."
            actionNode={
              <Button
                variant="outline"
                onClick={() => {
                  setKeyword("");
                  setLocationFilter("all");
                  void fetchInternships(false);
                }}
              >
                Reset filters & refresh
              </Button>
            }
          />
        ) : null}
      </div>
    </div>
  );
};

export default Internships;
