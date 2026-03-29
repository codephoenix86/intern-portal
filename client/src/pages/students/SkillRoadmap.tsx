// client/src/pages/student/SkillRoadmap.tsx

import { useEffect, useMemo, useState } from "react";
import { Progress } from "@/components/ui/progress";
import RoadmapTaskItem from "@/components/student/RoadmapTaskItem";
import RecommendedCourseCard from "@/components/student/RecommendedCourseCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, X } from "lucide-react";
import {
  studentPortalService,
  type StudentCourse,
  type StudentRoadmapData,
  type StudentRoadmapTask,
} from "@/services/studentPortal.service";
import { useToast } from "@/hooks/use-toast";

const SkillRoadmap = () => {
  const { toast } = useToast();
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [fieldInput, setFieldInput] = useState("");
  const [tasks, setTasks] = useState<StudentRoadmapTask[]>([]);
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    remaining: 0,
    nextTask: null as string | null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const applyRoadmapData = (data: StudentRoadmapData): void => {
    setAvailableFields(data.availableFields);
    setSelectedFields(data.selectedFields);
    setTasks(data.tasks);
    setSummary(data.summary);
  };

  useEffect(() => {
    const loadRoadmap = async (): Promise<void> => {
      try {
        const [roadmapData, courseList] = await Promise.all([
          studentPortalService.getRoadmap(),
          studentPortalService.getCourses(),
        ]);
        applyRoadmapData(roadmapData);
        const initialFields = roadmapData.selectedFields;
        const filteredCourses = await studentPortalService.getCourses(initialFields);
        setCourses(filteredCourses.length > 0 ? filteredCourses : courseList);
      } catch (error) {
        console.error("Failed to load roadmap:", error);
        toast({
          title: "Failed to load roadmap",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    void loadRoadmap();
  }, [toast]);

  const addField = (value: string): void => {
    const normalized = value.trim();
    if (!normalized) return;
    const alreadySelected = selectedFields.some(
      (field) => field.toLowerCase() === normalized.toLowerCase(),
    );
    if (alreadySelected) {
      setFieldInput("");
      return;
    }
    setSelectedFields((prev) => [...prev, normalized]);
    setFieldInput("");
  };

  const removeField = (value: string): void => {
    setSelectedFields((prev) => prev.filter((field) => field !== value));
  };

  const regenerateRoadmap = async (): Promise<void> => {
    if (selectedFields.length === 0) {
      toast({
        title: "Select at least one field",
        description: "Choose your interests to generate a roadmap.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRegenerating(true);
      const data = await studentPortalService.getRoadmap(selectedFields);
      applyRoadmapData(data);
      const filteredCourses = await studentPortalService.getCourses(data.selectedFields);
      setCourses(filteredCourses);
      toast({
        title: "Roadmap updated",
        description: "Your personalized roadmap is ready.",
      });
    } catch (error) {
      console.error("Failed to regenerate roadmap:", error);
      toast({
        title: "Could not generate roadmap",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleToggleTask = async (taskId: string): Promise<void> => {
    try {
      setUpdatingTaskId(taskId);
      const data = await studentPortalService.toggleRoadmapTask(taskId);
      applyRoadmapData(data);
    } catch (error) {
      console.error("Failed to update task:", error);
      toast({
        title: "Could not update task",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const filteredSuggestions = useMemo(() => {
    const query = fieldInput.trim().toLowerCase();
    const selectedSet = new Set(selectedFields.map((f) => f.toLowerCase()));
    return availableFields.filter((field) => {
      if (selectedSet.has(field.toLowerCase())) return false;
      if (!query) return true;
      return field.toLowerCase().includes(query);
    });
  }, [availableFields, fieldInput, selectedFields]);

  const completed = useMemo(
    () => tasks.filter((t) => t.completed).length,
    [tasks],
  );

  const percentage = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading roadmap...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground">Choose Your Interest Fields</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Pick one or more trending/on-demand fields. Your roadmap will be tailored
          to these selections.
        </p>

        <div className="flex gap-2">
          <Input
            value={fieldInput}
            onChange={(e) => setFieldInput(e.target.value)}
            placeholder="Try AI/ML, Data Science, Full Stack Development"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addField(fieldInput);
              }
            }}
          />
          <Button variant="outline" onClick={() => addField(fieldInput)}>
            Add Field
          </Button>
        </div>

        {filteredSuggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Trending Suggestions</p>
            <div className="flex flex-wrap gap-2">
              {filteredSuggestions.slice(0, 12).map((field) => (
                <button
                  key={field}
                  type="button"
                  onClick={() => addField(field)}
                  className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 text-foreground"
                >
                  {field}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Selected Fields</p>
          <div className="flex flex-wrap gap-2">
            {selectedFields.length > 0 ? (
              selectedFields.map((field) => (
                <Badge key={field} variant="secondary" className="gap-1 pr-1">
                  <span>{field}</span>
                  <button
                    type="button"
                    onClick={() => removeField(field)}
                    aria-label={`Remove ${field}`}
                    className="rounded-sm hover:bg-foreground/10 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No fields selected.</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void regenerateRoadmap()} disabled={isRegenerating}>
            {isRegenerating ? "Generating..." : "Generate Personalized Roadmap"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedFields([])}
            disabled={isRegenerating || selectedFields.length === 0}
          >
            Clear Selection
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="glass-card rounded-lg p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-foreground">
            Overall Progress
          </span>
          <span className="text-sm text-primary font-semibold">
            {percentage}%
          </span>
        </div>
        <Progress value={percentage} className="h-2" />
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span>Completed: {summary.completed}</span>
          <span>Remaining: {summary.remaining}</span>
          <span>Total Steps: {summary.total}</span>
        </div>
        {summary.nextTask && (
          <p className="mt-2 text-sm text-foreground">
            Next Recommended Step: <span className="font-medium">{summary.nextTask}</span>
          </p>
        )}
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <RoadmapTaskItem
            key={task.id}
            task={task}
            onToggle={(id) => void handleToggleTask(id)}
            disabled={updatingTaskId !== null}
          />
        ))}

        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground">No roadmap tasks available right now.</p>
        )}
      </div>

      {/* Recommended Courses */}
      <div>
        <h3 className="font-semibold text-foreground mb-1">
          Recommended Courses
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Based on your selected interest fields.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {courses.map((course) => (
            <RecommendedCourseCard key={course.id} course={course} />
          ))}

          {courses.length === 0 && (
            <p className="text-sm text-muted-foreground">No courses available right now.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillRoadmap;
