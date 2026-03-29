import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import RoadmapTaskItem from "@/components/student/RoadmapTaskItem";
import RecommendedCourseCard from "@/components/student/RecommendedCourseCard";
import {
  getStudentRoadmap,
  getStudentCourses,
  toggleRoadmapTask,
} from "@/services/studentPortal.service";
import { toast } from "sonner";

const SkillRoadmap = () => {
  const queryClient = useQueryClient();

  const { data: roadmapData, isLoading: roadmapLoading } = useQuery({
    queryKey: ["student", "content", "roadmap"],
    queryFn: getStudentRoadmap,
  });

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["student", "content", "courses"],
    queryFn: getStudentCourses,
  });

  const toggle = useMutation({
    mutationFn: (taskId: string | number) => toggleRoadmapTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "content", "roadmap"] });
    },
    onError: () => {
      toast.error("Could not update task");
    },
  });

  const roadmapTasks = roadmapData?.tasks ?? [];
  const recommendedCourses = coursesData?.courses ?? [];

  const completed = roadmapTasks.filter((t) => t.completed).length;
  const percentage =
    roadmapTasks.length > 0
      ? Math.round((completed / roadmapTasks.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
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

      {roadmapLoading ? (
        <p className="text-sm text-muted-foreground">Loading roadmap…</p>
      ) : (
        <div className="space-y-2">
          {roadmapTasks.map((t) => (
            <RoadmapTaskItem
              key={t.id}
              task={{ ...t, id: Number(t.id) }}
              disabled={toggle.isPending}
              onToggle={() => toggle.mutate(String(t.id))}
            />
          ))}
        </div>
      )}

      <div>
        <h3 className="font-semibold text-foreground mb-3">
          Recommended Courses
        </h3>
        {coursesLoading ? (
          <p className="text-sm text-muted-foreground">Loading courses…</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {recommendedCourses.map((c) => (
              <RecommendedCourseCard
                key={c.id}
                course={{ ...c, id: Number(c.id) }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillRoadmap;
