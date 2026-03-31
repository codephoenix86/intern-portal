import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  publicStudentsService,
  type PublicStudentCard,
} from "@/services/publicStudents.service";

const initialsFromName = (name: string): string => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) return "ST";
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
};

const asCleanList = (items: string[] | undefined): string[] =>
  (items ?? []).map((x) => x.trim()).filter(Boolean);

const PublicStudentProfile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const studentId = params["id"] ?? "";

  const [student, setStudent] = useState<PublicStudentCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const codingLinks = useMemo(() => {
    const cp = student?.codingProfiles;
    if (!cp) return [];
    return [
      cp.github ? { label: "GitHub", href: cp.github } : null,
      cp.linkedin ? { label: "LinkedIn", href: cp.linkedin } : null,
      cp.leetcode ? { label: "LeetCode", href: cp.leetcode } : null,
      cp.codechef ? { label: "CodeChef", href: cp.codechef } : null,
      cp.codeforces ? { label: "Codeforces", href: cp.codeforces } : null,
      cp.portfolio ? { label: "Portfolio", href: cp.portfolio } : null,
    ].filter(Boolean) as { label: string; href: string }[];
  }, [student]);

  useEffect(() => {
    const load = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);

      if (!studentId) {
        setErrorMessage("Student id is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await publicStudentsService.getById(studentId);
        setStudent(data.student);
      } catch (err) {
        console.error("Failed to load public student profile:", err);
        setErrorMessage("Could not load this student profile.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [studentId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Student Profile</h1>
            <p className="text-sm text-muted-foreground">
              Public profile (non-sensitive fields only)
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/students")}>
            Back to Students
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground py-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading profile...</span>
          </div>
        )}

        {errorMessage && !isLoading && (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && student && (
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback className="font-semibold">
                      {initialsFromName(student.name ?? "Student")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {student.college && <Badge variant="secondary">{student.college}</Badge>}
                      {student.branch && <Badge variant="outline">{student.branch}</Badge>}
                      {student.location && <Badge variant="outline">{student.location}</Badge>}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {student.bio && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Bio</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {student.bio}
                    </p>
                  </div>
                )}

                {student.experienceSummary && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Experience</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {student.experienceSummary}
                    </p>
                  </div>
                )}

                {codingLinks.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      Coding profiles
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {codingLinks.map((l) => (
                        <a
                          key={l.label}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Badge variant="secondary" className="hover:opacity-90">
                            {l.label}
                          </Badge>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  {asCleanList(student.studentSkills).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {asCleanList(student.studentSkills).map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills shared.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {asCleanList(student.studentProjects).length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      {asCleanList(student.studentProjects).map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No projects shared.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  {asCleanList(student.achievements).length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      {asCleanList(student.achievements).map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No achievements shared.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicStudentProfile;

