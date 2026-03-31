import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  BookOpen,
  Calendar,
  Clock,
  Users,
  Star,
  Video,
} from "lucide-react";
import {
  publicMentorsService,
  type PublicMentorProfile as MentorProfileType,
  type PublicMentorCourse,
  type PublicMentorSession,
} from "@/services/publicMentors.service";

/* ─── Helpers ─── */

const initialsFromName = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return "MT";
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatSessionType = (type: string): string => {
  if (type === "free_demo") return "Free Demo";
  if (type === "paid_class") return "Paid Class";
  return type;
};

/* ─── Course Card Sub-component ─── */

const CourseCard = ({ course }: { course: PublicMentorCourse }) => (
  <div className="rounded-lg border bg-card p-4 space-y-3 hover:shadow-sm transition-shadow">
    {/* Title row */}
    <div className="flex items-start justify-between gap-2">
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          {course.title}
        </h3>
        {course.category && (
          <p className="text-xs text-muted-foreground">{course.category}</p>
        )}
      </div>
      <Badge
        variant={course.isFree ? "secondary" : "outline"}
        className="text-xs shrink-0"
      >
        {course.isFree ? "Free" : "Paid"}
      </Badge>
    </div>

    {/* Short description */}
    {course.shortDescription && (
      <p className="text-xs text-muted-foreground line-clamp-2">
        {course.shortDescription}
      </p>
    )}

    {/* Meta badges */}
    <div className="flex flex-wrap gap-2">
      {course.level && (
        <Badge variant="outline" className="text-xs">
          {course.level}
        </Badge>
      )}
      {course.duration && (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <Badge variant="outline" className="text-xs">
            {course.duration}
          </Badge>
        </div>
      )}
      {course.enrollmentCount > 0 && (
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {course.enrollmentCount} enrolled
          </span>
        </div>
      )}
      {course.averageRating > 0 && (
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500" />
          <span className="text-xs text-muted-foreground">
            {course.averageRating.toFixed(1)}
          </span>
        </div>
      )}
    </div>

    {/* Skills */}
    {course.skills && course.skills.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {course.skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>
    )}
  </div>
);

/* ─── Session Card Sub-component ─── */

const SessionCard = ({ session }: { session: PublicMentorSession }) => (
  <div className="rounded-lg border bg-card p-4 space-y-3 hover:shadow-sm transition-shadow">
    {/* Title row */}
    <div className="flex items-start justify-between gap-2">
      <h3 className="text-sm font-semibold text-foreground">{session.topic}</h3>
      <Badge
        variant={session.type === "free_demo" ? "secondary" : "outline"}
        className="text-xs shrink-0"
      >
        {formatSessionType(session.type)}
      </Badge>
    </div>

    {/* Description */}
    {session.description && (
      <p className="text-xs text-muted-foreground line-clamp-2">
        {session.description}
      </p>
    )}

    {/* Meta */}
    <div className="flex flex-wrap gap-2">
      {session.date && (
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {formatDate(session.date)}
          </span>
        </div>
      )}
      {session.time && (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{session.time}</span>
        </div>
      )}
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          {session.duration} min
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Users className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          {session.attendeeCount}/{session.maxAttendees} spots
        </span>
      </div>
    </div>
  </div>
);

/* ─── Main Component ─── */

const PublicMentorProfile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const mentorId = params["id"] ?? "";

  const [mentor, setMentor] = useState<MentorProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);

      if (!mentorId) {
        setErrorMessage("Mentor id is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await publicMentorsService.getById(mentorId);
        setMentor(data.mentor);
      } catch (err) {
        console.error("Failed to load public mentor profile:", err);
        setErrorMessage("Could not load this mentor profile.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [mentorId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Page header ── */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Mentor Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Public profile (non-sensitive fields only)
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/mentors")}>
            Back to Mentors
          </Button>
        </div>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground py-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading profile...</span>
          </div>
        )}

        {/* ── Error ── */}
        {errorMessage && !isLoading && (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        {/* ── Profile content ── */}
        {!isLoading && !errorMessage && mentor && (
          <div className="grid gap-4 lg:grid-cols-3">
            {/* ───── Left column: Mentor info ───── */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={mentor.avatar} alt={mentor.name} />
                    <AvatarFallback className="font-semibold">
                      {initialsFromName(mentor.name ?? "Mentor")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{mentor.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Bio */}
                {mentor.bio && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Bio
                    </p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {mentor.bio}
                    </p>
                  </div>
                )}

                {/* Expertise */}
                {mentor.expertise.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      Expertise
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fallback */}
                {!mentor.bio && mentor.expertise.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No additional details shared.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* ───── Right column: Courses & Sessions ───── */}
            <div className="lg:col-span-2 space-y-4">
              {/* Courses */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">
                      Courses ({mentor.courses?.length ?? 0})
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {mentor.courses && mentor.courses.length > 0 ? (
                    <div className="space-y-3">
                      {mentor.courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No published courses at the moment.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Sessions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">
                      Upcoming Sessions ({mentor.upcomingSessions?.length ?? 0})
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {mentor.upcomingSessions &&
                  mentor.upcomingSessions.length > 0 ? (
                    <div className="space-y-3">
                      {mentor.upcomingSessions.map((session) => (
                        <SessionCard key={session.id} session={session} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No upcoming sessions scheduled.
                    </p>
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

export default PublicMentorProfile;
