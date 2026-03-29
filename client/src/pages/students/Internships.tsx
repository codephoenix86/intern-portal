import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import InternshipCard from "@/components/InternshipCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { listPublicJobs } from "@/services/publicJobs.service";

const Internships = () => {
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "match">("newest");
  const [locationFilter, setLocationFilter] = useState("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public", "jobs", { keyword, sortBy, locationFilter }],
    queryFn: () =>
      listPublicJobs({
        keyword: keyword.trim() || undefined,
        sort: sortBy,
        location: locationFilter === "all" ? "all" : locationFilter,
      }),
  });

  const jobs = data?.jobs ?? [];
  const locations = [
    "all",
    ...new Set(jobs.map((i) => i.location)),
  ] as string[];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          Browse Internships
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by keyword, skill..."
              className="pl-10"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Select
            value={locationFilter}
            onValueChange={setLocationFilter}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((l) => (
                <SelectItem key={l} value={l}>
                  {l === "all" ? "All Locations" : l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as "newest" | "match")}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="match">Highest Match</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground mb-4">Loading…</p>
        )}
        {isError && (
          <p className="text-sm text-destructive mb-4">
            Failed to load internships. Is the API running?
          </p>
        )}

        <p className="text-sm text-muted-foreground mb-4">
          {jobs.length} internships found
        </p>
        <div className="grid gap-4">
          {jobs.map((i) => (
            <InternshipCard key={i.id} {...i} />
          ))}
          {!isLoading && jobs.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <SlidersHorizontal className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No internships found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Internships;
