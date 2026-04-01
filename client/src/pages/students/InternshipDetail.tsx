import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SkillTag from "@/components/SkillTag";
import MatchScoreBadge from "@/components/MatchScoreBadge";
import InternshipCard from "@/components/InternshipCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InternshipJob } from "@/services/jobService";
import { combinedInternshipsService } from "@/services/combinedInternships.service";
import { studentPortalService } from "@/services/studentPortal.service";
import { getMatch, getSuggestions, type MatchData, type SuggestionsData } from "@/services/matchService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, Users, Building2, ArrowLeft, CheckCircle, Loader2, ExternalLink, BookOpen } from "lucide-react";

type InternshipDetailRecord = InternshipJob & {
  description?: string;
  requirements?: string[];
};

interface InternshipLocationState {
  internship?: InternshipDetailRecord;
}

const InternshipDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const state = location.state as InternshipLocationState | null;
  const { toast } = useToast();

  const [internship, setInternship] = useState<InternshipDetailRecord | null>(
    state?.internship ?? null,
  );
  const [similar, setSimilar] = useState<InternshipJob[]>([]);
  const [isLoading, setIsLoading] = useState(!state?.internship);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionsData | null>(null);
  const [isLoadingMatch, setIsLoadingMatch] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const loadDetail = async (): Promise<void> => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        if (!state?.internship) {
          // Try DB-backed job detail first (works for recruiter/seed jobs when logged in).
          const dbJob = await studentPortalService
            .getJobById(id)
            .then((j) => ({
              id: j.id,
              title: j.title,
              company: j.company,
              location: j.location,
              type: j.type,
              duration: j.duration,
              stipend: j.stipend,
              skills: j.skills,
              postedDate: j.postedDate,
              applicants: j.applicants,
              matchScore: j.matchScore,
              description: j.description,
              requirements: j.requirements,
              applyUrl: undefined,
            }))
            .catch(() => null);

          if (dbJob) {
            setInternship(dbJob);
          } else {
            const combined = await combinedInternshipsService.list({ limit: 200 });
            setInternship(combined.items.find((x) => x.id === id) ?? null);
          }
        }

        const combined = await combinedInternshipsService.list({ limit: 60 });
        setSimilar(combined.items.filter((item) => item.id !== id).slice(0, 3));

        // Load match data if user is student
        if (user?.role === "student" && id) {
          setIsLoadingMatch(true);
          try {
            const [matchResult, suggestionsResult] = await Promise.all([
              getMatch(user._id, id),
              getSuggestions(user._id, id)
            ]);
            setMatchData(matchResult);
            setSuggestions(suggestionsResult);
          } catch (error) {
            console.error("Failed to load match data:", error);
          } finally {
            setIsLoadingMatch(false);
          }
        }
      } catch (error) {
        console.error("Failed to load internship details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadDetail();
  }, [id, state?.internship]);

  const applyOnPlatform = async (): Promise<void> => {
    if (!id) {
      toast({
        title: "Cannot apply",
        description: "Missing job id.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsApplying(true);
      await studentPortalService.applyToJob(id);
      setHasApplied(true);
      toast({
        title: "Application submitted",
        description: "Your application has been sent to the recruiter.",
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "Could not apply right now. Please try again.";
      toast({
        title: "Apply failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const description = useMemo(() => {
    if (!internship) {
      return "";
    }

    if (internship.description) {
      return internship.description;
    }

    return `This is a live internship listing from ${internship.company}. Review the details and use the apply link to submit your application on the source platform.`;
  }, [internship]);

  const requirements = useMemo(() => {
    if (!internship) {
      return [];
    }

    if (internship.requirements && internship.requirements.length > 0) {
      return internship.requirements;
    }

    const skillRequirements = internship.skills.map((skill) =>
      `Working knowledge of ${skill}`,
    );

    return [
      ...skillRequirements,
      "Strong communication and collaboration skills",
      "Willingness to learn and adapt quickly",
    ].slice(0, 6);
  }, [internship]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mx-auto mb-3" />
          <p>Loading internship details...</p>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-muted-foreground">Internship not found.</p>
          <Link to="/internships"><Button variant="outline" className="mt-4">Back to Listings</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/internships" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="glass-card rounded-xl p-6 sm:p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{internship.title}</h1>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <Building2 className="h-4 w-4" /> {internship.company}
              </div>
            </div>
            <MatchScoreBadge score={matchData?.score || internship.matchScore} size="lg" />
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{internship.location}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{internship.duration}</span>
            <span className="flex items-center gap-1"><Users className="h-4 w-4" />{internship.applicants} applicants</span>
            <span className="font-semibold text-foreground">{internship.stipend}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {internship.skills.map(s => <SkillTag key={s} skill={s} />)}
          </div>

          <h3 className="font-semibold text-foreground mb-2">Description</h3>
          <p className="text-sm text-muted-foreground mb-6">{description}</p>

          <h3 className="font-semibold text-foreground mb-2">Requirements</h3>
          <ul className="space-y-1.5 mb-6">
            {requirements.map((r, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> {r}
              </li>
            ))}
          </ul>

          {user?.role === "student" && matchData && (
            <>
              <h3 className="font-semibold text-foreground mb-2">Match Score</h3>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Your match with this internship</span>
                  <span className="text-sm font-medium">{Math.round(matchData.score)}%</span>
                </div>
                <Progress value={matchData.score} className="h-2" />
              </div>

              {matchData.missingSkills.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">Missing Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {matchData.missingSkills.map(skill => (
                      <SkillTag key={skill} skill={skill} />
                    ))}
                  </div>
                </div>
              )}

              {suggestions?.recommendedCourses.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">Suggested Courses</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {suggestions.recommendedCourses.map(course => (
                      <Card key={course._id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            {course.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/courses/${course.link}`} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                              View Course <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {internship.applyUrl ? (
            <a href={internship.applyUrl} target="_blank" rel="noreferrer">
              <Button size="lg" className="gradient-primary text-primary-foreground border-0">
                Apply Now
              </Button>
            </a>
          ) : (
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground border-0"
              disabled={isApplying || hasApplied}
              onClick={() => void applyOnPlatform()}
            >
              {hasApplied ? "Applied" : isApplying ? "Applying..." : "Apply Now"}
            </Button>
          )}
        </div>

        {similar.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Similar Internships</h2>
            <div className="grid gap-4">
              {similar.map(i => <InternshipCard key={i.id} {...i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipDetail;
