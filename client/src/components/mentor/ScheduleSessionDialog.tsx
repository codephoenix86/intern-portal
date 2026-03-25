import { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus, Video, Globe } from "lucide-react";
import { createSession } from "@/services/session.service";
import type { SessionResponse } from "@/services/session.service";
import { useToast } from "@/hooks/use-toast";
import type { AxiosError } from "axios";

interface ScheduleSessionDialogProps {
  onSessionCreated: () => void;
}

const ScheduleSessionDialog = ({
  onSessionCreated,
}: ScheduleSessionDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<"free_demo" | "paid_class">("free_demo");
  const [description, setDescription] = useState("");
  const [maxAttendees, setMaxAttendees] = useState(100);

  const resetForm = () => {
    setTopic("");
    setDate("");
    setTime("");
    setType("free_demo");
    setDescription("");
    setMaxAttendees(100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // createSession already returns SessionResponse (not AxiosResponse)
      const result: SessionResponse = await createSession({
        topic,
        date,
        time,
        type,
        description: description || undefined,
        maxAttendees,
      });

      // Access session directly from result.data (not result.data.data)
      const session = result.data.session;

      toast({
        title: "Session Scheduled! 📅",
        description: `"${session.topic}" scheduled for ${session.date} at ${session.time}`,
      });

      // If paid class, show access code
      if (session.accessCode) {
        toast({
          title: "Access Code Generated 🔐",
          description: `Share this code with enrolled students: ${session.accessCode}`,
        });
      }

      resetForm();
      setOpen(false);
      onSessionCreated();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        title: "Scheduling Failed",
        description:
          axiosError.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get today's date for min value
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-primary-foreground border-0">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Class
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule a Live Session</DialogTitle>
          <DialogDescription>
            Create a new live class or free demo for your students.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Topic */}
          <div>
            <Label htmlFor="topic">Topic *</Label>
            <Input
              id="topic"
              placeholder="e.g. Arrays & Strings Masterclass"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading}
              required
              minLength={3}
              maxLength={200}
              className="mt-1"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isLoading}
                required
                className="mt-1"
                min={today}
              />
            </div>
            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={isLoading}
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Session Type */}
          <div>
            <Label>Session Type *</Label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                type="button"
                onClick={() => setType("free_demo")}
                disabled={isLoading}
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
                <p className="text-xs text-muted-foreground">
                  Open to everyone
                </p>
              </button>

              <button
                type="button"
                onClick={() => setType("paid_class")}
                disabled={isLoading}
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
                <p className="text-xs text-muted-foreground">Enrolled only</p>
              </button>
            </div>
          </div>

          {/* Max Attendees */}
          <div>
            <Label htmlFor="maxAttendees">Max Attendees</Label>
            <Input
              id="maxAttendees"
              type="number"
              value={maxAttendees}
              onChange={(e) => setMaxAttendees(parseInt(e.target.value) || 100)}
              min={1}
              max={1000}
              disabled={isLoading}
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="What will be covered in this session?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              className="mt-1"
              rows={3}
              maxLength={2000}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-primary text-primary-foreground border-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Session"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleSessionDialog;
