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
  UserPlus,
} from "lucide-react";
import {
  publicStudentsService,
  type PublicStudentCard,
  type PublicStudentsListResponse,
} from "@/services/publicStudents.service";
import {
  connectionService,
  type FriendStatusMap,
  type PendingRequestItem,
} from "@/services/connection.service";
import FriendButton from "@/components/student/FriendButton";
import { useAuth } from "@/contexts/AuthContext";

const DashboardStudents = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  // Filter: "all" or "friends"
  const [filter, setFilter] = useState<"all" | "friends">("all");

  // Friend statuses for displayed students
  const [friendStatuses, setFriendStatuses] = useState<FriendStatusMap>({});

  // Pending requests
  const [pendingRequests, setPendingRequests] = useState<PendingRequestItem[]>(
    [],
  );
  const [showPending, setShowPending] = useState(false);
  const [pendingLoading, setPendingLoading] = useState(false);

  const canPrev = page > 1;
  const canNext = page < meta.totalPages;

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (filter === "friends") {
        const data = await connectionService.listFriends({
          page,
          limit: 12,
          q: debouncedQ.trim() || undefined,
        });
        // Map friend items to PublicStudentCard shape
        const items: PublicStudentCard[] = data.items.map((f) => ({
          id: f.id,
          name: f.name,
          avatar: f.avatar ?? undefined,
          college: f.college ?? undefined,
          branch: f.branch ?? undefined,
          location: f.location ?? undefined,
          bio: f.bio ?? undefined,
          studentSkills: f.studentSkills ?? [],
          studentProjects: [],
          achievements: [],
          profileCompletion: 0,
          updatedAt: "",
        }));
        setStudents(items);
        setMeta({
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages,
        });

        // All displayed are friends
        const statuses: FriendStatusMap = {};
        for (const item of items) {
          statuses[item.id] = { status: "accepted" };
        }
        setFriendStatuses(statuses);
      } else {
        const data = await publicStudentsService.list({
          page,
          limit: 12,
          q: debouncedQ.trim() || undefined,
          sort: "updatedAt",
          order: "desc",
        });
        setStudents(data.items);
        setMeta({
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages,
        });

        // Fetch friend statuses for displayed students (exclude self)
        const ids = data.items.map((s) => s.id).filter((id) => id !== user?.id);
        if (ids.length > 0) {
          const statuses = await connectionService.getBulkFriendStatuses(ids);
          setFriendStatuses(statuses);
        } else {
          setFriendStatuses({});
        }
      }
    } catch (error) {
      console.error("Failed to load students:", error);
      setErrorMessage("Could not load students. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedQ, filter, user?.id]);

  const fetchPendingRequests = async () => {
    setPendingLoading(true);
    try {
      const data = await connectionService.listPendingRequests({ limit: 50 });
      setPendingRequests(data.items);
    } catch (err) {
      console.error("Failed to load pending requests:", err);
    } finally {
      setPendingLoading(false);
    }
  };

  useEffect(() => {
    void fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedQ(q), 300);
    return () => window.clearTimeout(handle);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ, filter]);

  useEffect(() => {
    if (showPending) void fetchPendingRequests();
  }, [showPending]);

  const handleRespondRequest = async (
    connectionId: string,
    action: "accept" | "reject",
  ) => {
    try {
      await connectionService.respondFriendRequest(connectionId, action);
      setPendingRequests((prev) =>
        prev.filter((r) => r.connectionId !== connectionId),
      );
      // Refresh students to update statuses
      void fetchStudents();
    } catch (err) {
      console.error("Failed to respond:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">Students</h2>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            <Users className="h-3 w-3 mr-1" />
            All Students
          </Button>
          <Button
            size="sm"
            variant={filter === "friends" ? "default" : "outline"}
            onClick={() => setFilter("friends")}
          >
            <Users className="h-3 w-3 mr-1" />
            My Friends
          </Button>
          <Button
            size="sm"
            variant={showPending ? "default" : "outline"}
            onClick={() => setShowPending(!showPending)}
          >
            <UserPlus className="h-3 w-3 mr-1" />
            Pending Requests
            {pendingRequests.length > 0 && !showPending && (
              <Badge variant="destructive" className="ml-1 text-xs px-1.5">
                {pendingRequests.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* ── Pending Requests Section ── */}
      {showPending && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Friend Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingLoading && (
              <div className="flex items-center gap-2 text-muted-foreground py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            )}
            {!pendingLoading && pendingRequests.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No pending requests.
              </p>
            )}
            {!pendingLoading && pendingRequests.length > 0 && (
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div
                    key={req.connectionId}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={req.avatar ?? undefined} />
                        <AvatarFallback>
                          {(req.name ?? "S").slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{req.name}</p>
                        <div className="flex gap-1 mt-0.5">
                          {req.college && (
                            <Badge variant="secondary" className="text-xs">
                              {req.college}
                            </Badge>
                          )}
                          {req.branch && (
                            <Badge variant="outline" className="text-xs">
                              {req.branch}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleRespondRequest(req.connectionId, "accept")
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleRespondRequest(req.connectionId, "reject")
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Search ── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search students by name…"
          className="pl-10"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground py-6">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading students...</span>
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
          students.map((s) => (
            <Card key={s.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate(`/students/${s.id}`)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={s.avatar} alt={s.name} />
                      <AvatarFallback className="font-semibold">
                        {(s.name ?? "S").trim().slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{s.name}</CardTitle>
                  </div>
                  {/* Friend button (don't show for self) */}
                  {s.id !== user?.id && (
                    <FriendButton
                      targetUserId={s.id}
                      initialStatus={friendStatuses[s.id]?.status ?? "none"}
                      connectionId={friendStatuses[s.id]?.connectionId}
                      onStatusChange={(newStatus, newConnId) => {
                        setFriendStatuses((prev) => ({
                          ...prev,
                          [s.id]: {
                            status: newStatus,
                            connectionId: newConnId,
                          },
                        }));
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {s.college && <Badge variant="secondary">{s.college}</Badge>}
                  {s.branch && <Badge variant="outline">{s.branch}</Badge>}
                  {s.location && <Badge variant="outline">{s.location}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {s.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
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
                      <Badge variant="outline">
                        +{s.studentSkills.length - 6}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>

      {/* ── Empty ── */}
      {!isLoading && students.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <SlidersHorizontal className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p>
            {filter === "friends"
              ? "No friends yet. Add friends from the All Students view!"
              : "No students found."}
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

export default DashboardStudents;
