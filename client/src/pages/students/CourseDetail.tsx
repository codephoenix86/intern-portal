import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  studentCoursesService,
  type PlatformCourseDetail,
} from "@/services/studentCourses.service";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

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
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading course...
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
    <div className="space-y-6 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link to="/student/courses">
          <ArrowLeft className="h-4 w-4" />
          Back to catalog
        </Link>
      </Button>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{course.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          By {course.mentorName} · {course.level} · {course.duration} ·{" "}
          {course.category}
        </p>
        <p className="mt-2 text-sm font-medium">{priceLabel}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {!enrolled && (
          <Button
            onClick={() => void handleEnroll()}
            disabled={actionLoading}
          >
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
        {enrolled && enrollment && (
          <span className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm">
            Progress: {enrollment.progress}% · {enrollment.status}
          </span>
        )}
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="whitespace-pre-wrap text-foreground">{course.description}</p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Modules</h3>
        <ul className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
          {course.modules
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((m) => (
              <li key={m.id ?? `${m.order}-${m.title}`}>
                {m.title}
                {m.isFree && (
                  <span className="ml-2 text-xs text-primary">Preview</span>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseDetail;
