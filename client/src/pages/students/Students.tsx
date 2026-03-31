import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import {
  publicStudentsService,
  type PublicStudentCard,
  type PublicStudentsListResponse,
} from "@/services/publicStudents.service";

const Students = () => {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState<PublicStudentCard[]>([]);
  const [meta, setMeta] = useState<Omit<PublicStudentsListResponse, "items">>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canPrev = page > 1;
  const canNext = page < meta.totalPages;

  const fetchStudents = async (opts?: { showLoading?: boolean }): Promise<void> => {
    const showLoading = opts?.showLoading ?? false;
    if (showLoading) setIsLoading(true);

    setErrorMessage(null);

    try {
      const data = await publicStudentsService.list({
        page,
        limit: meta.limit,
        q: debouncedQ.trim() ? debouncedQ.trim() : undefined,
        sort: "updatedAt",
        order: "desc",
      });
      setStudents(data.items);
      // keep meta from server (it clamps page/totalPages correctly)
      setMeta({ page: data.page, limit: data.limit, total: data.total, totalPages: data.totalPages });
    } catch (error) {
      console.error("Failed to load students:", error);
      setErrorMessage("Could not load students. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchStudents({ showLoading: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedQ]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedQ(q);
    }, 300);

    return () => window.clearTimeout(handle);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Students</h1>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students by name…"
              className="pl-10"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setDebouncedQ(q);
                }
              }}
            />
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground py-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading students...</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {!isLoading &&
            students.map((s) => (
              <Card key={s.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={s.avatar} alt={s.name} />
                      <AvatarFallback className="font-semibold">
                        {(s.name ?? "S").trim().slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{s.name}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {s.college && <Badge variant="secondary">{s.college}</Badge>}
                    {s.branch && <Badge variant="outline">{s.branch}</Badge>}
                    {s.location && <Badge variant="outline">{s.location}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {s.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {s.bio}
                    </p>
                  )}

                  {s.studentSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {s.studentSkills.slice(0, 6).map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                      {s.studentSkills.length > 6 && (
                        <Badge variant="outline">+{s.studentSkills.length - 6}</Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>

        {!isLoading && students.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <SlidersHorizontal className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>No students found. Try another search.</p>
          </div>
        )}

        {!isLoading && meta.totalPages > 1 && (
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t pt-6">
            <div className="text-sm text-muted-foreground">
              Page <span className="text-foreground font-medium">{meta.page}</span> of {meta.totalPages}
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!canPrev}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!canNext}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;

