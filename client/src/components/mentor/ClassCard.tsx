// client/src/components/mentor/ClassCard.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Video,
  Globe,
  MoreVertical,
  Copy,
  CheckCircle,
  Trash2,
  Users,
  Loader2,
  ExternalLink,
  Lock,
  Pencil,
  Clock,
  Calendar,
} from "lucide-react";
import {
  completeSessionApi,
  deleteSessionApi,
} from "@/services/session.service";
import EditSessionDialog from "./EditSessionDialog";
import { useToast } from "@/hooks/use-toast";
import type { LiveSession } from "@/services/session.service";

interface ClassCardProps {
  session: LiveSession | null | undefined;
  onUpdate: () => void;
}

const ClassCard = ({ session, onUpdate }: ClassCardProps) => {
  // ✅ ALL hooks MUST be called before any conditional returns
  const { toast } = useToast();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // ✅ Now safe to early return after all hooks
  if (!session) return null;

  const isFreeDemo = session.type === "free_demo";
  const isActive = session.status === "scheduled" || session.status === "live";

  const getStatusBadge = () => {
    switch (session.status) {
      case "scheduled":
        return <Badge variant="default">Scheduled</Badge>;
      case "live":
        return (
          <Badge className="bg-red-500 text-white animate-pulse">🔴 Live</Badge>
        );
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const handleCopyLink = () => {
    if (session.link) {
      navigator.clipboard.writeText(session.link);
      toast({
        title: "Link Copied! 📋",
        description: "Session link copied to clipboard.",
      });
    }
  };

  const handleCopyAccessCode = () => {
    if (session.accessCode) {
      navigator.clipboard.writeText(session.accessCode);
      toast({
        title: "Access Code Copied! 🔐",
        description: `Code: ${session.accessCode}`,
      });
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await completeSessionApi(session._id);
      toast({
        title: "Session Completed ✅",
        description: `"${session.topic}" marked as complete.`,
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSessionApi(session._id);
      toast({
        title: "Session Deleted 🗑️",
        description: `"${session.topic}" has been removed.`,
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="glass-card rounded-lg p-5 hover-lift">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-foreground">{session.topic}</h3>
              {getStatusBadge()}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {session.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {session.time}
              </span>
              {session.duration && (
                <span className="text-xs">({session.duration} min)</span>
              )}
            </div>
          </div>

          {/* Actions Dropdown */}
          {isActive && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Session
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Session Link
                </DropdownMenuItem>
                {session.accessCode && (
                  <DropdownMenuItem onClick={handleCopyAccessCode}>
                    <Lock className="h-4 w-4 mr-2" />
                    Copy Access Code
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleComplete}
                  disabled={isCompleting}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Description */}
        {session.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {session.description}
          </p>
        )}

        {/* Meta Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge
            variant={isFreeDemo ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            {isFreeDemo ? (
              <Globe className="h-3 w-3" />
            ) : (
              <Video className="h-3 w-3" />
            )}
            {isFreeDemo ? "Free Demo" : "Paid Class"}
          </Badge>

          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            {session.attendeeCount}/{session.maxAttendees} attendees
          </span>

          {session.courseId && typeof session.courseId === "object" && (
            <Badge variant="outline" className="text-xs">
              📘 {session.courseId.title}
            </Badge>
          )}
        </div>

        {/* Action Row */}
        {isActive && (
          <div className="flex items-center gap-2 flex-wrap">
            {session.link && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(session.link!, "_blank")}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open Link
              </Button>
            )}

            {session.accessCode && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted 
                           text-xs font-mono cursor-pointer hover:bg-muted/80 transition"
                onClick={handleCopyAccessCode}
                title="Click to copy"
              >
                <Lock className="h-3 w-3 text-muted-foreground" />
                <span>{session.accessCode}</span>
                <Copy className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
          </div>
        )}

        {/* Cancelled reason */}
        {session.status === "cancelled" && session.cancelReason && (
          <p className="text-sm text-destructive mt-2">
            Reason: {session.cancelReason}
          </p>
        )}
      </div>

      {/* Edit Dialog */}
      <EditSessionDialog
        session={session}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onUpdated={onUpdate}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{session.topic}". Students who were
              notified will not be able to join. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClassCard;
