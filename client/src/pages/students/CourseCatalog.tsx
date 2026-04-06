import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  studentCoursesService,
  type PlatformCourseCard,
} from "@/services/studentCourses.service";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BookOpen } from "lucide-react";

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
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Course catalog</h2>
        <p className="text-sm text-muted-foreground">
          Browse published courses and enroll to learn on the platform.
        </p>
      </div>

      <Input
        placeholder="Search by title, skill, or category..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="max-w-lg"
      />

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading courses...
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {!loading &&
          courses.map((c) => (
            <Card key={c.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{c.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {c.shortDescription || "—"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">{c.level}</span>
                  {" · "}
                  {c.duration}
                  {" · "}
                  {c.category}
                </p>
                <p>
                  {c.pricing.amount === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Free
                    </span>
                  ) : (
                    <>
                      {c.pricing.currency}{" "}
                      {c.pricing.discountedAmount ?? c.pricing.amount}
                    </>
                  )}
                  {c.enrolled && (
                    <span className="ml-2 rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      Enrolled
                    </span>
                  )}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/student/courses/${c.id}`}>
                    <BookOpen className="h-4 w-4" />
                    View details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>

      {!loading && courses.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No courses match your search. Try a different keyword or check back
          later.
        </p>
      )}
    </div>
  );
};

export default CourseCatalog;
