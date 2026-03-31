import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Search,
  SlidersHorizontal,
  Users,
  UserCheck,
} from "lucide-react";
import {
  publicMentorsService,
  type PublicMentorCard,
  type PublicMentorsListResponse,
} from "@/services/publicMentors.service";
import {
  connectionService,
  type FollowStatusMap,
} from "@/services/connection.service";
import FollowButton from "@/components/student/FollowButton";

const MAX_VISIBLE_EXPERTISE = 5;

const DashboardMentors = () => {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const [mentors, setMentors] = useState<PublicMentorCard[]>([]);
  const [meta, setMeta] = useState<Omit<PublicMentorsListResponse, "items">>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [filter, setFilter] = useState<"all" | "following">("all");
  const [followStatuses, setFollowStatuses] = useState<FollowStatusMap>({});

  const canPrev = page > 1;
  const canNext = page < meta.totalPages;

  const fetchMentors = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (filter === "following") {
        const data = await connectionService.listFollowingMentors({
          page,
          limit: 12,
          q: debouncedQ.trim() || undefined,
        });
        const items: PublicMentorCard[] = data.items.map(
          (m: Record<string, unknown>) => ({
            id: m.id as string,
            name: m.name as string,
            avatar: (m.avatar as string) ?? undefined,
            bio: (m.bio as string) ?? undefined,
            expertise: (m.expertise as string[]) ?? [],
            profileCompletion: 0,
            updatedAt: "",
          }),
        );
        setMentors(items);
        setMeta({
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages,
        });

        const statuses: FollowStatusMap = {};
        for (const item of items) {
          statuses[item.id] = true;
        }
        setFollowStatuses(statuses);
      } else {
        const data = await publicMentorsService.list({
          page,
          limit: 12,
          q: debouncedQ.trim() || undefined,
          sort: "updatedAt",
          order: "desc",
        });
        setMentors(data.items);
        setMeta({
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages,
        });

        const ids = data.items.map((m) => m.id);
        if (ids.length > 0) {
          const statuses = await connectionService.getBulkFollowStatuses(ids);
          setFollowStatuses(statuses);
        } else {
          setFollowStatuses({});
        }
      }
    } catch (error) {
      console.error("Failed to load mentors:", error);
      setErrorMessage("Could not load mentors. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedQ, filter]);

  useEffect(() => {
    void fetchMentors();
  }, [fetchMentors]);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedQ(q), 300);
    return () => window.clearTimeout(handle);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ, filter]);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">Mentors</h2>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            <Users className="h-3 w-3 mr-1" />
            All Mentors
          </Button>
          <Button
            size="sm"
            variant={filter === "following" ? "default" : "outline"}
            onClick={() => setFilter("following")}
          >
            <UserCheck className="h-3 w-3 mr-1" />
            My Mentors
          </Button>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search mentors by name…"
          className="pl-10"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground py-6">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading mentors...</span>
        </div>
      )}

      {/* ── Error ── */}
      {errorMessage && (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {/* ── Grid ── */}
      <div className="grid gap-4 md:grid-cols-2">
        {!isLoading &&
          mentors.map((m) => (
            <Card key={m.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate(`/mentors/${m.id}`)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={m.avatar} alt={m.name} />
                      <AvatarFallback className="font-semibold">
                        {(m.name ?? "M").trim().slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{m.name}</CardTitle>
                  </div>
                  <FollowButton
                    targetUserId={m.id}
                    initialFollowing={followStatuses[m.id] ?? false}
                    onStatusChange={(following) => {
                      setFollowStatuses((prev) => ({
                        ...prev,
                        [m.id]: following,
                      }));
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {m.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {m.bio}
                  </p>
                )}
                {m.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {m.expertise
                      .slice(0, MAX_VISIBLE_EXPERTISE)
                      .map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    {m.expertise.length > MAX_VISIBLE_EXPERTISE && (
                      <Badge variant="outline">
                        +{m.expertise.length - MAX_VISIBLE_EXPERTISE}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>

      {/* ── Empty ── */}
      {!isLoading && mentors.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <SlidersHorizontal className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p>
            {filter === "following"
              ? "Not following any mentors yet. Follow mentors from the All Mentors view!"
              : "No mentors found."}
          </p>
        </div>
      )}

      {/* ── Pagination ── */}
      {!isLoading && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </span>
          <div className="flex gap-2">
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
  );
};

export default DashboardMentors;
