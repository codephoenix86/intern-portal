// client/src/pages/student/StudentSessions.tsx

import { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Video } from "lucide-react";
import SessionJoinCard from "@/components/student/SessionJoinCard";
import api from "@/lib/axios";
import type { LiveSession, SessionsResponse } from "@/services/session.service";
import { useToast } from "@/hooks/use-toast";

// Student-facing API to get available sessions
const getAvailableSessions = async (query: {
  page?: number;
  limit?: number;
  type?: string;
}): Promise<SessionsResponse> => {
  const params = new URLSearchParams();
  if (query.page) params.set("page", query.page.toString());
  if (query.limit) params.set("limit", query.limit.toString());
  if (query.type && query.type !== "all") params.set("type", query.type);

  const { data } = await api.get<SessionsResponse>(
    `/sessions/available?${params.toString()}`,
  );
  return data;
};

const StudentSessions = () => {
  const { toast } = useToast();

  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAvailableSessions({
        page: 1,
        limit: 20,
        type: typeFilter,
      });

      // response is SessionsResponse: { success, message, data: { sessions, total, ... } }
      setSessions(response.data?.sessions ?? []);
    } catch (error: any) {
      toast({
        title: "Failed to load sessions",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, [typeFilter, toast]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <div className="space-y-5">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sessions</SelectItem>
            <SelectItem value="free_demo">Free Demos</SelectItem>
            <SelectItem value="paid_class">Paid Classes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sessions Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16">
          <Video className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="font-semibold text-foreground mb-1">
            No sessions available
          </h3>
          <p className="text-sm text-muted-foreground">
            Check back later for upcoming live sessions.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {sessions.map((session) => (
            <SessionJoinCard key={session._id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSessions;
