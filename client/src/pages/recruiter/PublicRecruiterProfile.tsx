import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Building2,
  MapPin,
  Mail,
  Briefcase,
  Clock,
  IndianRupee,
} from "lucide-react";
import {
  publicRecruitersService,
  type PublicRecruiterProfile as RecruiterProfileType,
  type PublicRecruiterJob,
} from "@/services/publicRecruiters.service";

/* ─── Helpers ─── */

const initialsFromName = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return "RC";
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
};

const formatDate = (iso: string): string => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

/* ─── Job Card Sub-component ─── */

const JobCard = ({ job }: { job: PublicRecruiterJob }) => (
  <div className="rounded-lg border bg-card p-4 space-y-3 hover:shadow-sm transition-shadow">
    {/* Title row */}
    <div className="flex items-start justify-between gap-2">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{job.title}</h3>
        {job.company && (
          <p className="text-xs text-muted-foreground">{job.company}</p>
        )}
      </div>
      {job.postedDate && (
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatDate(job.postedDate)}
        </span>
      )}
    </div>

    {/* Meta badges */}
    <div className="flex flex-wrap gap-2">
      {job.location && (
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <Badge variant="outline" className="text-xs">
            {job.location}
          </Badge>
        </div>
      )}
      {job.workType && (
        <Badge variant="outline" className="text-xs">
          {job.workType}
        </Badge>
      )}
      {job.duration && (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <Badge variant="outline" className="text-xs">
            {job.duration}
          </Badge>
        </div>
      )}
      {job.stipend && (
        <div className="flex items-center gap-1">
          <IndianRupee className="h-3 w-3 text-muted-foreground" />
          <Badge variant="secondary" className="text-xs">
            {job.stipend}
          </Badge>
        </div>
      )}
    </div>

    {/* Skills */}
    {job.skills && job.skills.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {job.skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>
    )}

    {/* Link to internship detail */}
    <Link
      to={`/internships/${job.id}`}
      className="inline-block text-xs text-primary hover:underline"
    >
      View internship →
    </Link>
  </div>
);

/* ─── Main Component ─── */

const PublicRecruiterProfile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const recruiterId = params["id"] ?? "";

  const [recruiter, setRecruiter] = useState<RecruiterProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);

      if (!recruiterId) {
        setErrorMessage("Recruiter id is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await publicRecruitersService.getById(recruiterId);
        setRecruiter(data.recruiter);
      } catch (err) {
        console.error("Failed to load public recruiter profile:", err);
        setErrorMessage("Could not load this recruiter profile.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [recruiterId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Page header ── */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Recruiter Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Public profile (non-sensitive fields only)
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/recruiters")}>
            Back to Recruiters
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
        {!isLoading && !errorMessage && recruiter && (
          <div className="grid gap-4 lg:grid-cols-3">
            {/* ───── Left column: Recruiter info ───── */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={recruiter.avatar} alt={recruiter.name} />
                    <AvatarFallback className="font-semibold">
                      {initialsFromName(recruiter.name ?? "Recruiter")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{recruiter.name}</CardTitle>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {recruiter.companyName && (
                        <Badge variant="secondary">
                          {recruiter.companyName}
                        </Badge>
                      )}
                      {recruiter.location && (
                        <Badge variant="outline">{recruiter.location}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Bio */}
                {recruiter.bio && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Bio
                    </p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {recruiter.bio}
                    </p>
                  </div>
                )}

                {/* Company Details */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Company Details
                  </p>
                  <div className="space-y-2">
                    {recruiter.companyName && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4 shrink-0" />
                        <span>{recruiter.companyName}</span>
                      </div>
                    )}
                    {recruiter.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>{recruiter.location}</span>
                      </div>
                    )}
                    {recruiter.companyEmail && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 shrink-0" />
                        <a
                          href={`mailto:${recruiter.companyEmail}`}
                          className="hover:underline break-all"
                        >
                          {recruiter.companyEmail}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fallback if nothing is available */}
                {!recruiter.bio &&
                  !recruiter.companyName &&
                  !recruiter.location &&
                  !recruiter.companyEmail && (
                    <p className="text-sm text-muted-foreground">
                      No additional details shared.
                    </p>
                  )}
              </CardContent>
            </Card>

            {/* ───── Right column: Active Listings ───── */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">
                      Active Internship Listings (
                      {recruiter.activeListings?.length ?? 0})
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {recruiter.activeListings &&
                  recruiter.activeListings.length > 0 ? (
                    <div className="space-y-3">
                      {recruiter.activeListings.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No active internship listings at the moment.
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

export default PublicRecruiterProfile;
