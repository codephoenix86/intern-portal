import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import SkillTag from "@/components/SkillTag";
import MatchScoreBadge from "@/components/MatchScoreBadge";
import InternshipCard from "@/components/InternshipCard";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Users,
  Building2,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { getPublicJob, listPublicJobs } from "@/services/publicJobs.service";
import { getStudentJob, applyToStudentJob } from "@/services/studentPortal.service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const InternshipDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const isStudent = user?.role === "student";

  const { data: publicData, isLoading: loadingPublic } = useQuery({
    queryKey: ["public", "job", id],
    queryFn: () => getPublicJob(id!),
    enabled: !!id && (!isAuthenticated || !isStudent),
  });

  const { data: studentData, isLoading: loadingStudent } = useQuery({
    queryKey: ["student", "job", id],
    queryFn: () => getStudentJob(id!),
    enabled: !!id && isAuthenticated && isStudent,
  });

  const loading =
    (!isAuthenticated || !isStudent) ? loadingPublic : loadingStudent;
  const internship =
    isAuthenticated && isStudent
      ? studentData?.job
      : publicData?.job;

  const { data: listData } = useQuery({
    queryKey: ["public", "jobs", "browse"],
    queryFn: () => listPublicJobs({ sort: "newest" }),
    enabled: !!id,
  });

  const applyMutation = useMutation({
    mutationFn: () => applyToStudentJob(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "applications"] });
      queryClient.invalidateQueries({ queryKey: ["student", "dashboard"] });
      toast.success("Application submitted");
    },
    onError: (err: unknown) => {
      const msg =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        err.response !== null &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        err.response.data !== null &&
        "message" in err.response.data
          ? String((err.response.data as { message?: string }).message)
          : "Could not apply";
      toast.error(msg);
    },
  });

  const similar =
    listData?.jobs.filter((j) => j.id !== id).slice(0, 3) ?? [];

  if (!id) {
    return null;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <p className="text-center py-20 text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <p className="text-center py-20 text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-muted-foreground">Internship not found.</p>
          <Link to="/internships">
            <Button variant="outline" className="mt-4">
              Back to Listings
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const showMatchBadge = internship.matchScore > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/internships"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="glass-card rounded-xl p-6 sm:p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {internship.title}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <Building2 className="h-4 w-4" /> {internship.company}
              </div>
            </div>
            {showMatchBadge && (
              <MatchScoreBadge score={internship.matchScore} size="lg" />
            )}
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {internship.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {internship.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {internship.applicants} applicants
            </span>
            <span className="font-semibold text-foreground">
              {internship.stipend}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {internship.skills.map((s) => (
              <SkillTag key={s} skill={s} />
            ))}
          </div>

          <h3 className="font-semibold text-foreground mb-2">Description</h3>
          <p className="text-sm text-muted-foreground mb-6">
            {internship.description}
          </p>

          <h3 className="font-semibold text-foreground mb-2">Requirements</h3>
          <ul className="space-y-1.5 mb-6">
            {internship.requirements.map((r, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />{" "}
                {r}
              </li>
            ))}
          </ul>

          {isStudent ? (
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground border-0"
              disabled={applyMutation.isPending}
              onClick={() => applyMutation.mutate()}
            >
              {applyMutation.isPending ? "Submitting…" : "Apply Now"}
            </Button>
          ) : (
            <Button size="lg" className="gradient-primary text-primary-foreground border-0" asChild>
              <Link to="/login">Sign in to apply</Link>
            </Button>
          )}
        </div>

        {similar.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Similar Internships
            </h2>
            <div className="grid gap-4">
              {similar.map((i) => (
                <InternshipCard key={i.id} {...i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipDetail;
