import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Video } from "lucide-react";
import ClassCard from "@/components/mentor/ClassCard";
import ScheduleSessionDialog from "@/components/mentor/ScheduleSessionDialog";
import {
  getMentorSessions,
  type LiveSession,
} from "@/services/session.service";
import { useToast } from "@/hooks/use-toast";

const MentorClasses = () => {
  const { toast } = useToast();

  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<
    "all" | "free_demo" | "paid_class"
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "upcoming" | "completed"
  >("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getMentorSessions({
        page,
        limit: 10,
        type: typeFilter,
        status: statusFilter,
      });
      setSessions(response.data.sessions);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error: any) {
      toast({
        title: "Failed to load sessions",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, typeFilter, statusFilter, toast]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [typeFilter, statusFilter]);

  return (
    <div className="space-y-5">
      {/* Header: Filters + Schedule Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Select
            value={typeFilter}
            onValueChange={(v) =>
              setTypeFilter(v as "all" | "free_demo" | "paid_class")
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="free_demo">Free Demo</SelectItem>
              <SelectItem value="paid_class">Paid Class</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter(v as "all" | "upcoming" | "completed")
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScheduleSessionDialog onSessionCreated={fetchSessions} />
      </div>

      {/* Result count */}
      <p className="text-sm text-muted-foreground">
        {total} session{total !== 1 ? "s" : ""} found
      </p>

      {/* Sessions list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16">
          <Video className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="font-semibold text-foreground mb-1">
            No sessions found
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {statusFilter === "all"
              ? "Schedule your first live session to get started."
              : `No ${statusFilter} sessions.`}
          </p>
          <ScheduleSessionDialog onSessionCreated={fetchSessions} />
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <ClassCard key={s._id} session={s} onUpdate={fetchSessions} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default MentorClasses;
