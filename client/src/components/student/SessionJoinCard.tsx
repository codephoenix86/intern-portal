import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Globe,
  Video,
  Users,
  Calendar,
  Clock,
  ExternalLink,
  Lock,
  Loader2,
} from "lucide-react";
import { joinSessionApi } from "@/services/session.service";
import { useToast } from "@/hooks/use-toast";
import type { LiveSession } from "@/services/session.service";

interface SessionJoinCardProps {
  session: LiveSession;
}

const SessionJoinCard = ({ session }: SessionJoinCardProps) => {
  const { toast } = useToast();
  const [isJoining, setIsJoining] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  const isFreeDemo = session.type === "free_demo";
  const isFull = session.attendeeCount >= session.maxAttendees;
  const isActive = session.status === "scheduled" || session.status === "live";

  const handleJoin = async (code?: string) => {
    setIsJoining(true);
    try {
      const result = await joinSessionApi(session._id, code);

      toast({
        title: "Joined Successfully! 🎉",
        description: "Opening session link...",
      });

      // Open session link in new tab
      if (result.data.link) {
        window.open(result.data.link, "_blank");
      }

      setShowCodeDialog(false);
    } catch (error: any) {
      toast({
        title: "Unable to Join",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleJoinClick = () => {
    if (isFreeDemo) {
      // Free demo — join directly
      handleJoin();
    } else {
      // Paid class — might need access code
      setShowCodeDialog(true);
    }
  };

  return (
    <>
      <div className="glass-card rounded-lg p-5 hover-lift">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-foreground">{session.topic}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {session.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {session.time}
              </span>
            </div>
          </div>

          <Badge variant={isFreeDemo ? "default" : "secondary"}>
            {isFreeDemo ? (
              <>
                <Globe className="h-3 w-3 mr-1" /> Free Demo
              </>
            ) : (
              <>
                <Video className="h-3 w-3 mr-1" /> Paid Class
              </>
            )}
          </Badge>
        </div>

        {/* Description */}
        {session.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {session.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {session.attendeeCount}/{session.maxAttendees} spots
          </span>
          {session.status === "live" && (
            <Badge className="bg-red-500 text-white text-[10px] animate-pulse">
              🔴 Live Now
            </Badge>
          )}
        </div>

        {/* Join Button */}
        {isActive && (
          <Button
            className="w-full gradient-primary text-primary-foreground border-0"
            onClick={handleJoinClick}
            disabled={isFull || isJoining}
          >
            {isJoining ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : isFull ? (
              "Session Full"
            ) : (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Session
              </>
            )}
          </Button>
        )}

        {session.status === "completed" && (
          <p className="text-sm text-muted-foreground text-center">
            This session has ended.
          </p>
        )}
      </div>

      {/* Access Code Dialog for Paid Classes */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              <Lock className="h-5 w-5 inline mr-2" />
              Enter Access Code
            </DialogTitle>
            <DialogDescription>
              This is a paid class. Enter the access code shared by your mentor,
              or join directly if you're enrolled in the course.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Enter access code (e.g. A1B2C3D4)"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              className="font-mono text-center text-lg tracking-wider"
              maxLength={8}
            />

            <p className="text-xs text-muted-foreground text-center">
              If you're enrolled in the course, you can join without a code.
            </p>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => handleJoin()}
              disabled={isJoining}
              className="flex-1"
            >
              {isJoining ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Join as Enrolled Student"
              )}
            </Button>
            <Button
              onClick={() => handleJoin(accessCode)}
              disabled={isJoining || !accessCode}
              className="flex-1"
            >
              {isJoining ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Join with Code"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SessionJoinCard;
