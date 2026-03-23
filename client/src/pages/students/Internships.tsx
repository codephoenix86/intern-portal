import { useState } from "react";
import Navbar from "@/components/Navbar";
import InternshipCard from "@/components/InternshipCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { internships } from "@/data/mockData";
import { Search, SlidersHorizontal } from "lucide-react";

const Internships = () => {
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [locationFilter, setLocationFilter] = useState("all");

  const locations = ["all", ...new Set(internships.map(i => i.location))];

  let filtered = internships.filter(i =>
    (keyword === "" || i.title.toLowerCase().includes(keyword.toLowerCase()) || i.skills.some(s => s.toLowerCase().includes(keyword.toLowerCase()))) &&
    (locationFilter === "all" || i.location === locationFilter)
  );

  if (sortBy === "match") filtered = [...filtered].sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Browse Internships</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by keyword, skill..." className="pl-10" value={keyword} onChange={e => setKeyword(e.target.value)} />
          </div>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Location" /></SelectTrigger>
            <SelectContent>{locations.map(l => <SelectItem key={l} value={l}>{l === "all" ? "All Locations" : l}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="match">Highest Match</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{filtered.length} internships found</p>
        <div className="grid gap-4">
          {filtered.map(i => <InternshipCard key={i.id} {...i} />)}
          {filtered.length === 0 && (
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
