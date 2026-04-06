import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  mentorCoursesService,
  type EnrolledStudentRow,
} from "@/services/mentorCourses.service";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

const MentorCourseStudentsPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [students, setStudents] = useState<EnrolledStudentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    const load = async (): Promise<void> => {
      setLoading(true);
      try {
        const res = await mentorCoursesService.listStudents(courseId);
        setTitle(res.courseTitle);
        setStudents(res.students);
      } catch (e) {
        console.error(e);
        toast({
          title: "Could not load students",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [courseId, toast]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" size="sm" className="-ml-2" asChild>
        <Link to={courseId ? `/mentor/courses/${courseId}` : "/mentor/courses"}>
          <ArrowLeft className="h-4 w-4" />
          Back to course
        </Link>
      </Button>

      <div>
        <h2 className="text-xl font-semibold">Enrolled students</h2>
        <p className="text-sm text-muted-foreground mt-1">{title}</p>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Progress</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.enrollmentId} className="border-b last:border-0">
                <td className="p-3">{s.name}</td>
                <td className="p-3 text-muted-foreground">{s.email}</td>
                <td className="p-3">{s.progress}%</td>
                <td className="p-3 capitalize">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground text-center">
            No enrollments yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default MentorCourseStudentsPage;
