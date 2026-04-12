import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import SkillTag from "@/components/SkillTag";
import {
  studentCoursesService,
  type PlatformCourseDetail,
} from "@/services/studentCourses.service";
import { combinedInternshipsService } from "@/services/combinedInternships.service";
import { useToast } from "@/hooks/use-toast";
import { countJobsMatchingCourseSkills } from "@/lib/skill-overlap";
import { ArrowLeft, Briefcase, Route } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_DISPLAY_NAME } from "@/constants/brand";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();
  const [course, setCourse] = useState<PlatformCourseDetail | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState<{
    id: string;
    progress: number;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [openRolesCount, setOpenRolesCount] = useState<number | null>(null);

  useEffect(() => {
    if (!courseId) return;
    const load = async (): Promise<void> => {
      setLoading(true);
      try {
        const res = await studentCoursesService.getCourse(courseId);
        setCourse(res.course);
        setEnrolled(res.enrolled);
        setEnrollment(res.enrollment);
      } catch (e) {
        console.error(e);
        toast({
          title: "Course not found",
          variant: "destructive",
        });
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [courseId, toast]);

  useEffect(() => {
    if (!course?.skills?.length) {
      setOpenRolesCount(null);
      return;
    }
    let cancelled = false;
    const run = async (): Promise<void> => {
      try {
        const { items } = await combinedInternshipsService.list({ limit: 200 });
        if (cancelled) return;
        setOpenRolesCount(countJobsMatchingCourseSkills(course.skills, items));
      } catch {
        if (!cancelled) setOpenRolesCount(null);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [course?.id, course?.skills]);

  const handleEnroll = async (): Promise<void> => {
    if (!courseId) return;
    setActionLoading(true);
    try {
      await studentCoursesService.enroll(courseId);
      setEnrolled(true);
      const res = await studentCoursesService.getCourse(courseId);
      setEnrollment(res.enrollment);
      toast({ title: "You are enrolled in this course." });
    } catch (e: unknown) {
      console.error(e);
      toast({
        title: "Could not enroll",
        description: "You may already be enrolled.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async (): Promise<void> => {
    if (!courseId) return;
    setActionLoading(true);
    try {
      await studentCoursesService.unenroll(courseId);
      setEnrolled(false);
      setEnrollment(null);
      toast({ title: "You left this course." });
    } catch (e) {
      console.error(e);
      toast({
        title: "Could not update enrollment",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-10 w-3/4 max-w-xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!course) {
    return (
      <p className="text-sm text-muted-foreground">
        This course is unavailable.
      </p>
    );
  }

  const priceLabel =
    course.pricing.amount === 0
      ? "Free"
      : `${course.pricing.currency} ${course.pricing.discountedAmount}`;

  return (
    <div className="max-w-3xl space-y-8">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link to="/student/courses">
          <ArrowLeft className="h-4 w-4" />
          Back to catalog
        </Link>
      </Button>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{course.level}</Badge>
          <Badge variant="outline">{course.category}</Badge>
          <Badge variant="outline" className="font-normal">
            {course.duration}
          </Badge>
        </div>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          {course.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          Instructor <span className="font-medium text-foreground">{course.mentorName}</span>
        </p>
        <p className="text-lg font-semibold text-foreground">{priceLabel}</p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.07] to-transparent shadow-card">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-2 font-display font-semibold text-foreground">
            <Route className="h-5 w-5 stroke-[1.55] text-primary" />
            Career impact
          </div>
          <p className="text-sm text-muted-foreground">
            Skills taught in this course appear in live internship listings on{" "}
            {APP_DISPLAY_NAME}.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {course.skills.map((s) => (
              <SkillTag key={s} skill={s} />
            ))}
          </div>
          {openRolesCount != null ? (
            <p className="flex flex-wrap items-center gap-2 text-sm text-foreground">
              <Briefcase className="h-4 w-4 text-primary shrink-0" />
              <span>
                <span className="font-semibold">{openRolesCount}</span> open listings mention at least one
                of these skills (from the current job feed).
              </span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Exploring how this course maps to open roles…</p>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link to="/internships">Browse internships</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        {!enrolled && (
          <Button onClick={() => void handleEnroll()} disabled={actionLoading}>
            {actionLoading ? "Please wait..." : "Enroll"}
          </Button>
        )}
        {enrolled && enrollment?.status === "active" && (
          <Button
            variant="outline"
            onClick={() => void handleLeave()}
            disabled={actionLoading}
          >
            Leave course
          </Button>
        )}
      </div>

      {enrolled && enrollment ? (
        <div className="space-y-2 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Your progress</span>
            <span className="font-semibold text-foreground">{enrollment.progress}%</span>
          </div>
          <Progress value={enrollment.progress} className="h-2" />
          <p className="text-xs text-muted-foreground capitalize">Status: {enrollment.status}</p>
        </div>
      ) : null}

      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="whitespace-pre-wrap text-foreground">{course.description}</p>
      </div>

      <div>
        <h3 className="font-display mb-3 font-semibold text-foreground">Modules</h3>
        <ul className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          {course.modules
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((m) => (
              <li key={m.id ?? `${m.order}-${m.title}`}>
                {m.title}
                {m.isFree && (
                  <span className="ml-2 text-xs font-medium text-primary">Preview</span>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseDetail;
