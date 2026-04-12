import { MapPin, Clock, Users, Building2, Calendar, Link2 } from "lucide-react";
import SkillTag from "./SkillTag";
import MatchScoreBadge from "./MatchScoreBadge";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface InternshipCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  stipend: string;
  skills: string[];
  postedDate: string;
  applicants: number;
  matchScore?: number;
  description?: string;
  requirements?: string[];
  applyUrl?: string;
  showApply?: boolean;
  /** When true, show skill-to-learning callout (set by parent from enrollments + job skills) */
  hasRelatedCourseCoverage?: boolean;
}

const companyInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const internshipState = (props: Omit<InternshipCardProps, "showApply" | "hasRelatedCourseCoverage">) => ({
  internship: {
    id: props.id,
    title: props.title,
    company: props.company,
    location: props.location,
    type: props.type,
    duration: props.duration,
    stipend: props.stipend,
    skills: props.skills,
    postedDate: props.postedDate,
    applicants: props.applicants,
    matchScore: props.matchScore,
    description: props.description,
    requirements: props.requirements,
    applyUrl: props.applyUrl,
  },
});

const InternshipCard = ({
  id,
  title,
  company,
  location,
  type,
  duration,
  stipend,
  skills,
  postedDate,
  applicants,
  matchScore,
  description,
  requirements,
  applyUrl,
  showApply = true,
  hasRelatedCourseCoverage = false,
}: InternshipCardProps) => {
  const state = internshipState({
    id,
    title,
    company,
    location,
    type,
    duration,
    stipend,
    skills,
    postedDate,
    applicants,
    matchScore,
    description,
    requirements,
    applyUrl,
  });

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/20",
        "flex flex-col gap-4",
      )}
    >
      <div className="flex gap-4">
        <Avatar className="h-12 w-12 rounded-xl border border-border/60 shadow-sm">
          <AvatarFallback className="rounded-xl bg-primary/10 font-display text-sm font-semibold text-primary">
            {companyInitials(company)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                to={`/internships/${id}`}
                state={state}
                className="font-display text-lg font-semibold text-foreground transition-colors hover:text-primary line-clamp-2"
              >
                {title}
              </Link>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{company}</span>
              </div>
            </div>
            {matchScore ? <MatchScoreBadge score={matchScore} size="sm" /> : null}
          </div>
        </div>
      </div>

      {hasRelatedCourseCoverage ? (
        <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm text-foreground">
          <Link2 className="h-4 w-4 shrink-0 stroke-[1.65] text-accent" />
          <span>Your enrolled courses overlap these skills</span>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="font-normal">
          {type}
        </Badge>
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {location}
        </span>
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {duration}
        </span>
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {applicants} applicants
        </span>
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          Posted {postedDate}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <SkillTag key={s} skill={s} />
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-lg font-semibold text-foreground">{stipend}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {showApply ? (
            <Button size="sm" asChild>
              <Link to={`/internships/${id}`} state={state}>
                View details
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InternshipCard;
