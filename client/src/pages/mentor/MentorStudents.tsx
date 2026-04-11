import StudentCard from "@/components/mentor/StudentCard";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { publicStudentsService } from "@/services/publicStudents.service";

type MentorStudentCardData = {
  id: string;
  name: string;
  skill: string;
  progress: number;
};

const MentorStudents = () => {
  const [students, setStudents] = useState<MentorStudentCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStudents = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await publicStudentsService.list({
          page: 1,
          limit: 12,
          sort: "updatedAt",
          order: "desc",
        });

        const mapped = data.items.map((s) => ({
          id: s.id,
          name: s.name,
          skill: s.studentSkills[0] ?? s.branch ?? "General",
          progress: Math.max(0, Math.min(100, s.profileCompletion ?? 0)),
        }));

        setStudents(mapped);
      } catch (e) {
        console.error("Failed to load mentor students:", e);
        setError("Could not load students right now.");
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadStudents();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-6">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading students...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (students.length === 0) {
    return <p className="text-sm text-muted-foreground">No students found.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {students.map((s) => (
        <StudentCard key={s.id} student={s} />
      ))}
    </div>
  );
};

export default MentorStudents;
