import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Globe, Video } from "lucide-react";
import { updateSession } from "@/services/session.service";
import { useToast } from "@/hooks/use-toast";
import type { LiveSession } from "@/services/session.service";
import type { AxiosError } from "axios";

interface EditSessionDialogProps {
  session: LiveSession;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

const EditSessionDialog = ({
  session,
  open,
  onOpenChange,
  onUpdated,
}: EditSessionDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form state — pre-filled with current values
  const [topic, setTopic] = useState(session.topic);
  const [date, setDate] = useState(session.date);
  const [time, setTime] = useState(session.time);
  const [type, setType] = useState<"free_demo" | "paid_class">(session.type);
  const [description, setDescription] = useState(session.description);
  const [maxAttendees, setMaxAttendees] = useState(session.maxAttendees);

  // Reset form when session changes
  useEffect(() => {
    setTopic(session.topic);
    setDate(session.date);
    setTime(session.time);
    setType(session.type);
    setDescription(session.description);
    setMaxAttendees(session.maxAttendees);
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateSession(session._id, {
        topic,
        date,
        time,
        type,
        description,
        maxAttendees,
      });

      toast({
        title: "Session Updated ✅",
        description: `"${topic}" has been updated successfully.`,
      });

      onOpenChange(false);
      onUpdated();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        title: "Update Failed",
        description:
          axiosError.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Session</DialogTitle>
          <DialogDescription>
            Update the details of your scheduled session.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-topic">Topic</Label>
            <Input
              id="edit-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading}
              required
              minLength={3}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isLoading}
                required
                min={today}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-time">Time</Label>
              <Input
                id="edit-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={isLoading}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Session Type</Label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                type="button"
                onClick={() => setType("free_demo")}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  type === "free_demo"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <Globe
                  className={`h-5 w-5 mx-auto mb-1 ${
                    type === "free_demo"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
                <p className="text-sm font-medium">Free Demo</p>
              </button>
              <button
                type="button"
                onClick={() => setType("paid_class")}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  type === "paid_class"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <Video
                  className={`h-5 w-5 mx-auto mb-1 ${
                    type === "paid_class"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
                <p className="text-sm font-medium">Paid Class</p>
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="edit-max">Max Attendees</Label>
            <Input
              id="edit-max"
              type="number"
              value={maxAttendees}
              onChange={(e) => setMaxAttendees(parseInt(e.target.value) || 100)}
              min={1}
              max={1000}
              disabled={isLoading}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="edit-desc">Description</Label>
            <Textarea
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              className="mt-1"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSessionDialog;
