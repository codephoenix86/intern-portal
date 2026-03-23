import SkillTag from "@/components/SkillTag";
import type { RecommendedCourse } from "@/types/student.types";

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
      <SkillTag skill={course.level} className="mt-2" />
    </div>
  );
};

export default RecommendedCourseCard;
