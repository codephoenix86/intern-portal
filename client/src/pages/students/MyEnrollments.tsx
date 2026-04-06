import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  type PlatformEnrollmentRow,
} from "@/services/studentCourses.service";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading your courses...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">My courses</h2>
        <p className="text-sm text-muted-foreground">
          Courses you are enrolled in on this platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((r) => (
          <Card key={r.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{r.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {r.shortDescription || "—"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 text-sm text-muted-foreground">
              <p>
                Progress: <span className="font-medium text-foreground">{r.progress}%</span>
                {" · "}
                {r.status}
              </p>
              <p className="mt-1">
                {r.level} · {r.duration}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" size="sm">
                <Link to={`/student/courses/${r.courseId}`}>Open course</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {rows.length === 0 && (
        <p className="text-sm text-muted-foreground">
          You are not enrolled yet.{" "}
          <Link to="/student/courses" className="text-primary underline-offset-4 hover:underline">
            Browse the catalog
          </Link>
          .
        </p>
      )}
    </div>
  );
};

export default MyEnrollments;
