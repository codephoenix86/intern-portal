import { Link } from "react-router-dom";
import { NotebookPen, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import SkillTag from "@/components/SkillTag";
import { cn } from "@/lib/utils";
import type { PlatformCourseCard } from "@/services/studentCourses.service";

interface CourseCardProps {
  course: PlatformCourseCard;
  /** Student app: link into dashboard course detail */
  detailTo: string;
  progressPercent?: number | null;
  className?: string;
  /** "enrollment" hides price and cohort size on My courses */
  variant?: "catalog" | "enrollment";
}

const CourseCard = ({
  course,
  detailTo,
  progressPercent,
  className,
  variant = "catalog",
}: CourseCardProps) => {
  const priceLabel =
    course.pricing.amount === 0
      ? "Free"
      : `${course.pricing.currency} ${course.pricing.discountedAmount}`;
  const isEnrollment = variant === "enrollment";

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover",
        className,
      )}
    >
      <Link
        to={detailTo}
        className="relative block aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/15 via-muted to-accent/10"
      >
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <NotebookPen className="h-14 w-14 stroke-[1.35] text-primary/40" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
            {course.level}
          </Badge>
          {course.enrolled ? (
            <Badge className="bg-accent text-accent-foreground">Enrolled</Badge>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          <Badge variant="outline" className="font-normal">
            {course.category}
          </Badge>
        </div>
        <Link to={detailTo}>
          <h3 className="font-display text-lg font-semibold text-foreground transition-colors group-hover:text-primary line-clamp-2">
            {course.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {course.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {course.skills.slice(0, 5).map((s) => (
            <SkillTag key={s} skill={s} />
          ))}
          {course.skills.length > 5 ? (
            <span className="text-xs text-muted-foreground self-center">
              +{course.skills.length - 5}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 shrink-0" />
            {course.duration}
          </span>
          {!isEnrollment ? (
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 shrink-0" />
              {course.enrollmentCount} enrolled
            </span>
          ) : null}
        </div>

        {progressPercent != null && progressPercent >= 0 ? (
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Your progress</span>
              <span className="font-medium text-foreground">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          {!isEnrollment ? (
            <span className="text-lg font-semibold text-foreground">{priceLabel}</span>
          ) : (
            <span className="text-sm text-muted-foreground">Keep learning</span>
          )}
          <Button size="sm" asChild>
            <Link to={detailTo}>{course.enrolled ? "Continue" : "View course"}</Link>
          </Button>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
