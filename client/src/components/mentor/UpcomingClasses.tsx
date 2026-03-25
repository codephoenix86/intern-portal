import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Video, Calendar, Clock, Globe } from "lucide-react";
import {
  getMentorSessions,
  type LiveSession,
} from "@/services/session.service";
import ScheduleSessionDialog from "./ScheduleSessionDialog";

const UpcomingClasses = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUpcoming = async () => {
    try {
      const response = await getMentorSessions({
        page: 1,
        limit: 3,
        status: "upcoming",
      });
      setSessions(response.data.sessions);
    } catch {
      // Silently fail on dashboard widget
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcoming();
  }, []);

  return (
    <div className="glass-card rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Upcoming Classes</h3>
        <Badge variant="outline" className="text-xs">
          {sessions.length} upcoming
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-6">
          <Video className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground mb-3">
            No upcoming sessions
          </p>
          <ScheduleSessionDialog onSessionCreated={fetchUpcoming} />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {sessions.map((session, idx) => (
              <div
                key={session._id}
                className={`flex items-center justify-between pb-3 ${
                  idx < sessions.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {session.topic}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {session.type === "free_demo" ? (
                        <Globe className="h-2.5 w-2.5 mr-0.5" />
                      ) : (
                        <Video className="h-2.5 w-2.5 mr-0.5" />
                      )}
                      {session.type === "free_demo" ? "Free" : "Paid"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {session.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {session.time}
                    </span>
                  </div>
                </div>

                <span className="text-xs text-muted-foreground">
                  {session.attendeeCount}/{session.maxAttendees}
                </span>
              </div>
            ))}
          </div>

          <Button
            className="w-full mt-4"
            variant="outline"
            onClick={() => navigate("/mentor/classes")}
          >
            View All Classes
          </Button>
        </>
      )}
    </div>
  );
};

export default UpcomingClasses;
