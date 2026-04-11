// client/src/pages/mentor/MentorTrainings.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SkillTag from "@/components/SkillTag";
import TrainingCard from "@/components/mentor/TrainingCard";
import { MOCK_TRAININGS } from "@/constants/mentor.constant";
import type { Training } from "@/types/mentor.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type TrainingEditorState = {
  id?: number;
  title: string;
  level: string;
  duration: string;
  skills: string;
};

const toSkillList = (csv: string): string[] =>
  csv
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

const MentorTrainings = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [trainings, setTrainings] = useState<Training[]>(MOCK_TRAININGS);

  const [viewingTraining, setViewingTraining] = useState<Training | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [editor, setEditor] = useState<TrainingEditorState>({
    title: "",
    level: "",
    duration: "",
    skills: "",
  });

  const openCreateDialog = (): void => {
    setEditorMode("create");
    setEditor({
      title: "",
      level: "",
      duration: "",
      skills: "",
    });
    setEditorOpen(true);
  };

  const openEditDialog = (training: Training): void => {
    setEditorMode("edit");
    setEditor({
      id: training.id,
      title: training.title,
      level: training.level,
      duration: training.duration,
      skills: training.skills.join(", "),
    });
    setEditorOpen(true);
  };

  const saveTraining = (): void => {
    const title = editor.title.trim();
    const level = editor.level.trim();
    const duration = editor.duration.trim();
    const skills = toSkillList(editor.skills);

    if (!title || !level || !duration || skills.length === 0) {
      toast({
        title: "Missing fields",
        description: "Title, level, duration, and at least one skill are required.",
        variant: "destructive",
      });
      return;
    }

    if (editorMode === "create") {
      const nextId = trainings.length > 0 ? Math.max(...trainings.map((t) => t.id)) + 1 : 1;
      const newTraining: Training = {
        id: nextId,
        title,
        level,
        duration,
        skills,
      };

      setTrainings((prev) => [newTraining, ...prev]);
      toast({ title: "Training created" });
    } else {
      setTrainings((prev) =>
        prev.map((t) =>
          t.id === editor.id
            ? {
                ...t,
                title,
                level,
                duration,
                skills,
              }
            : t,
        ),
      );
      toast({ title: "Training updated" });
    }

    setEditorOpen(false);
  };

  const filtered = trainings.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Input
          placeholder="Search trainings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-lg"
        />
        <Button
          className="gradient-primary text-primary-foreground border-0"
          onClick={openCreateDialog}
        >
          + Create Training
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <TrainingCard
            key={t.id}
            training={t}
            onView={(training) => setViewingTraining(training)}
            onEdit={openEditDialog}
          />
        ))}
      </div>

      <Dialog
        open={Boolean(viewingTraining)}
        onOpenChange={(open) => {
          if (!open) setViewingTraining(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewingTraining?.title ?? "Training Details"}</DialogTitle>
            <DialogDescription>
              Review complete training information.
            </DialogDescription>
          </DialogHeader>

          {viewingTraining ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Level: <span className="text-foreground font-medium">{viewingTraining.level}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Duration: <span className="text-foreground font-medium">{viewingTraining.duration}</span>
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {viewingTraining.skills.map((skill) => (
                    <SkillTag key={skill} skill={skill} />
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingTraining(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editorMode === "create" ? "Create Training" : "Edit Training"}
            </DialogTitle>
            <DialogDescription>
              Fill all fields to {editorMode === "create" ? "add" : "update"} a training.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="training-title">Title</Label>
              <Input
                id="training-title"
                value={editor.title}
                onChange={(e) =>
                  setEditor((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. Advanced React"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="training-level">Level</Label>
              <Input
                id="training-level"
                value={editor.level}
                onChange={(e) =>
                  setEditor((prev) => ({ ...prev, level: e.target.value }))
                }
                placeholder="Beginner / Intermediate / Advanced"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="training-duration">Duration</Label>
              <Input
                id="training-duration"
                value={editor.duration}
                onChange={(e) =>
                  setEditor((prev) => ({ ...prev, duration: e.target.value }))
                }
                placeholder="e.g. 6 Weeks"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="training-skills">Skills (comma separated)</Label>
              <Input
                id="training-skills"
                value={editor.skills}
                onChange={(e) =>
                  setEditor((prev) => ({ ...prev, skills: e.target.value }))
                }
                placeholder="React, TypeScript, Node.js"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveTraining}>
              {editorMode === "create" ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorTrainings;
