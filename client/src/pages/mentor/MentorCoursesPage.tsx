import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  mentorCoursesService,
  type MentorCourseSummary,
} from "@/services/mentorCourses.service";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";

const MentorCoursesPage = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<MentorCourseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const list = await mentorCoursesService.list();
        setCourses(list);
      } catch (e) {
        console.error(e);
        toast({
          title: "Failed to load courses",
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground max-w-xl">
          Create courses, add modules (videos, PDFs, notes), and see who is
          enrolled.
        </p>
        <Button asChild>
          <Link to="/mentor/courses/new">
            <Plus className="h-4 w-4" />
            New course
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle className="text-lg">{c.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {c.shortDescription || "—"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span>{c.level}</span>
              <span>·</span>
              <span>{c.duration}</span>
              <span>·</span>
              <span>{c.moduleCount} modules</span>
              <span>·</span>
              <span>{c.enrollmentCount} enrolled</span>
              <span>·</span>
              <span
                className={
                  c.isPublished ? "text-emerald-600 dark:text-emerald-400" : ""
                }
              >
                {c.isPublished ? "Published" : "Draft"}
              </span>
            </CardContent>
            <div className="px-6 pb-6 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/mentor/courses/${c.id}`}>Manage</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/mentor/courses/${c.id}/students`}>Students</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No courses yet. Create your first course to get started.
        </p>
      )}
    </div>
  );
};

export default MentorCoursesPage;
