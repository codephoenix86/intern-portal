// client/src/pages/student/SkillRoadmap.tsx

import { useEffect, useMemo, useState } from "react";
import { Progress } from "@/components/ui/progress";
import RoadmapTaskItem from "@/components/student/RoadmapTaskItem";
import RecommendedCourseCard from "@/components/student/RecommendedCourseCard";
import { Loader2 } from "lucide-react";
import {
  studentPortalService,
  type StudentCourse,
  type StudentRoadmapTask,
} from "@/services/studentPortal.service";
import { useToast } from "@/hooks/use-toast";

const SkillRoadmap = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<StudentRoadmapTask[]>([]);
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

  useEffect(() => {
    const loadRoadmap = async (): Promise<void> => {
      try {
        const [taskList, courseList] = await Promise.all([
          studentPortalService.getRoadmap(),
          studentPortalService.getCourses(),
        ]);
        setTasks(taskList);
        setCourses(courseList);
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

  const handleToggleTask = async (taskId: number): Promise<void> => {
    try {
      setUpdatingTaskId(taskId);
      const updatedTasks = await studentPortalService.toggleRoadmapTask(taskId);
      setTasks(updatedTasks);
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
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <RoadmapTaskItem
            key={task.id}
            task={task}
            onToggle={(id) => void handleToggleTask(id)}
            disabled={updatingTaskId === task.id}
          />
        ))}

        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground">No roadmap tasks available right now.</p>
        )}
      </div>

      {/* Recommended Courses */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">
          Recommended Courses
        </h3>
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
