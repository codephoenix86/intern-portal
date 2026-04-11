import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AssignmentCard from "@/components/mentor/AssignmentCard";
import { MOCK_ASSIGNMENTS } from "@/constants/mentor.constant.ts";
import type { Assignment } from "@/types/mentor.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const MentorAssignments = () => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [createOpen, setCreateOpen] = useState(false);
  const [reviewing, setReviewing] = useState<Assignment | null>(null);
  const [form, setForm] = useState({
    title: "",
    deadline: "",
    totalSubmissions: "",
  });

  const createAssignment = (): void => {
    const title = form.title.trim();
    const deadline = form.deadline.trim();
    const total = Number(form.totalSubmissions);

    if (!title || !deadline || Number.isNaN(total) || total <= 0) {
      toast({
        title: "Invalid assignment details",
        description: "Enter title, deadline, and valid total submissions.",
        variant: "destructive",
      });
      return;
    }

    const nextId = assignments.length > 0
      ? Math.max(...assignments.map((a) => a.id)) + 1
      : 1;

    const newAssignment: Assignment = {
      id: nextId,
      title,
      deadline,
      submissions: `0/${total}`,
    };

    setAssignments((prev) => [newAssignment, ...prev]);
    setForm({ title: "", deadline: "", totalSubmissions: "" });
    setCreateOpen(false);
    toast({ title: "Assignment created" });
  };

  return (
    <div className="space-y-3">
      <Button
        className="gradient-primary text-primary-foreground border-0"
        onClick={() => setCreateOpen(true)}
      >
        + Create Assignment
      </Button>

      {assignments.map((a) => (
        <AssignmentCard
          key={a.id}
          assignment={a}
          onReview={(assignment) => setReviewing(assignment)}
        />
      ))}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Assignment</DialogTitle>
            <DialogDescription>
              Add a new assignment for your students.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="assignment-title">Title</Label>
              <Input
                id="assignment-title"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. System Design Basics"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="assignment-deadline">Deadline Label</Label>
              <Input
                id="assignment-deadline"
                value={form.deadline}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, deadline: e.target.value }))
                }
                placeholder="e.g. 5 Days Left"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="assignment-total">Total Students</Label>
              <Input
                id="assignment-total"
                type="number"
                min={1}
                value={form.totalSubmissions}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    totalSubmissions: e.target.value,
                  }))
                }
                placeholder="e.g. 30"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createAssignment}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(reviewing)}
        onOpenChange={(open) => {
          if (!open) setReviewing(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{reviewing?.title ?? "Review Assignment"}</DialogTitle>
            <DialogDescription>
              Submission snapshot for this assignment.
            </DialogDescription>
          </DialogHeader>

          {reviewing ? (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Deadline: <span className="font-medium text-foreground">{reviewing.deadline}</span>
              </p>
              <p>
                Submissions: <span className="font-medium text-foreground">{reviewing.submissions}</span>
              </p>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewing(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorAssignments;
