import SkillTag from "@/components/SkillTag";
import type { RecommendedCourse } from "@/types/student.types";
import { Button } from "@/components/ui/button";

interface RecommendedCourseCardProps {
  course: RecommendedCourse;
}

const RecommendedCourseCard = ({ course }: RecommendedCourseCardProps) => {
  return (
    <div className="glass-card rounded-lg p-4 hover-lift">
      <h4 className="font-medium text-sm text-foreground">{course.title}</h4>
      <p className="text-xs text-muted-foreground mt-1">
        {course.provider} • {course.duration}
      </p>
      <div className="mt-2 flex flex-wrap gap-2 items-center">
        <SkillTag skill={course.level} />
        {course.tags?.slice(0, 2).map((tag) => (
          <SkillTag key={tag} skill={tag} />
        ))}
      </div>
      <div className="mt-3">
        <a href={course.url} target="_blank" rel="noreferrer">
          <Button variant="outline" size="sm">Open Course</Button>
        </a>
      </div>
    </div>
  );
};

export default RecommendedCourseCard;
