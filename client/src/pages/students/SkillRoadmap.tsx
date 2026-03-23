// client/src/pages/student/SkillRoadmap.tsx

import { Progress } from "@/components/ui/progress";
import RoadmapTaskItem from "@/components/student/RoadmapTaskItem";
import RecommendedCourseCard from "@/components/student/RecommendedCourseCard";
import { roadmapTasks, recommendedCourses } from "@/data/mockData";

const SkillRoadmap = () => {
  const completed = roadmapTasks.filter((t) => t.completed).length;
  const percentage = Math.round((completed / roadmapTasks.length) * 100);

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
        {roadmapTasks.map((t) => (
          <RoadmapTaskItem key={t.id} task={{ ...t, id: Number(t.id) }} />
        ))}
      </div>

      {/* Recommended Courses */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">
          Recommended Courses
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {recommendedCourses.map((c) => (
            <RecommendedCourseCard
              key={c.id}
              course={{ ...c, id: Number(c.id) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillRoadmap;
