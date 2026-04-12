import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import EmptyState from "@/components/EmptyState";
import { CourseCardSkeleton } from "@/components/ListingSkeletons";
import {
  studentCoursesService,
  type PlatformCourseCard,
  type PlatformEnrollmentRow,
} from "@/services/studentCourses.service";
import { useToast } from "@/hooks/use-toast";
import { BookmarkCheck } from "lucide-react";

function rowToCourseCard(r: PlatformEnrollmentRow): PlatformCourseCard {
  return {
    id: r.courseId,
    title: r.title,
    shortDescription: r.shortDescription,
    level: r.level,
    duration: r.duration,
    category: r.category,
    skills: r.skills,
    thumbnailUrl: r.thumbnailUrl,
    enrollmentCount: 0,
    pricing: { amount: 0, currency: "INR", discountedAmount: 0 },
    enrolled: true,
  };
}

const MyEnrollments = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<PlatformEnrollmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const list = await studentCoursesService.listMyEnrollments();
        setRows(list);
      } catch (e) {
        console.error(e);
        toast({
          title: "Could not load your courses",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [toast]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">My courses</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Courses you are enrolled in on this platform.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">My courses</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Courses you are enrolled in on this platform.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((r) => (
          <CourseCard
            key={r.id}
            course={rowToCourseCard(r)}
            detailTo={`/student/courses/${r.courseId}`}
            progressPercent={r.progress}
            variant="enrollment"
          />
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={BookmarkCheck}
          title="No enrollments yet"
          description="Browse the catalog and enroll in a course to build skills employers are hiring for."
          action={{ label: "Open course catalog", to: "/student/courses" }}
        />
      ) : null}
    </div>
  );
};

export default MyEnrollments;
