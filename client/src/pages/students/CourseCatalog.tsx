import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import CourseCard from "@/components/CourseCard";
import EmptyState from "@/components/EmptyState";
import { CourseCardSkeleton } from "@/components/ListingSkeletons";
import {
  studentCoursesService,
  type PlatformCourseCard,
} from "@/services/studentCourses.service";
import { useToast } from "@/hooks/use-toast";
import { Layers2 } from "lucide-react";

const CourseCatalog = () => {
  const { toast } = useToast();
  const [keyword, setKeyword] = useState("");
  const [courses, setCourses] = useState<PlatformCourseCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      const run = async (): Promise<void> => {
        setLoading(true);
        try {
          const res = await studentCoursesService.listCatalog({
            keyword: keyword.trim() || undefined,
            limit: 40,
          });
          setCourses(res.courses);
        } catch (e) {
          console.error(e);
          toast({
            title: "Could not load courses",
            variant: "destructive",
          });
          setCourses([]);
        } finally {
          setLoading(false);
        }
      };
      void run();
    }, 300);
    return () => clearTimeout(t);
  }, [keyword, toast]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">Course catalog</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse published courses and enroll to learn on the platform.
        </p>
      </div>

      <Input
        placeholder="Search by title, skill, or category..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="max-w-lg h-11"
      />

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} detailTo={`/student/courses/${c.id}`} />
          ))}
        </div>
      )}

      {!loading && courses.length === 0 ? (
        <EmptyState
          icon={Layers2}
          title="No courses found"
          description="Try another keyword or check back soon for new programs aligned with your skills."
          action={{ label: "Browse internships", to: "/student/search" }}
        />
      ) : null}
    </div>
  );
};

export default CourseCatalog;
