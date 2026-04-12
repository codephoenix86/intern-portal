import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SkillTag from "@/components/SkillTag";
import MatchScoreBadge from "@/components/MatchScoreBadge";
import ApplicantMatchStats from "./ApplicantMatchStats";
import ApplicantStatusSelect from "./ApplicantStatusSelect";
import { applicationService, type RecruiterApplicantItem } from "@/services/applicationService";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Mail, BriefcaseBusiness } from "lucide-react";

interface ApplicantCardProps {
  applicant: RecruiterApplicantItem;
}

const statusBadgeClass = (status: string): string => {
  switch (status) {
    case "Shortlisted":
      return "border-primary/30 bg-primary/10 text-primary";
    case "Interview":
      return "border-chart-4/30 bg-chart-4/10 text-chart-4";
    case "Accepted":
      return "border-accent/30 bg-accent/15 text-accent-foreground";
    case "Rejected":
      return "border-destructive/30 bg-destructive/10 text-destructive";
    default:
      return "border-border bg-muted/50 text-muted-foreground";
  }
};

const initials = (name: string): string => {
  const p = name.trim().split(/\s+/);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
};

const ApplicantCard = ({ applicant }: ApplicantCardProps) => {
  const [status, setStatus] = useState(applicant.status);
  const [isSaving, setIsSaving] = useState(false);

  const onStatusChange = async (nextStatus: string): Promise<void> => {
    const prev = status;
    setStatus(nextStatus as RecruiterApplicantItem["status"]);
    setIsSaving(true);
    try {
      await applicationService.updateStatus(
        applicant.applicationId,
        nextStatus as RecruiterApplicantItem["status"],
      );
    } catch (e) {
      console.error("Failed to update applicant status:", e);
      setStatus(prev);
    } finally {
      setIsSaving(false);
    }
  };

  const onViewResume = (): void => {
    if (!applicant.resumeUrl) {
      toast({
        title: "Resume not available",
        description: "This applicant has not uploaded a resume yet.",
      });
      return;
    }

    const w = window.open(applicant.resumeUrl, "_blank", "noopener,noreferrer");
    if (!w) {
      toast({
        title: "Could not open resume",
        description: "Popup was blocked by the browser. Please allow popups and try again.",
      });
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <Avatar className="h-12 w-12 shrink-0 rounded-xl border border-border">
            <AvatarFallback className="rounded-xl bg-primary/10 font-display text-sm font-semibold text-primary">
              {initials(applicant.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-display font-semibold text-foreground">{applicant.name}</h4>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wide",
                  statusBadgeClass(status),
                )}
              >
                {status}
              </Badge>
            </div>
            <a
              href={`mailto:${applicant.email}`}
              className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{applicant.email}</span>
            </a>
            <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
              <BriefcaseBusiness className="mt-0.5 h-3.5 w-3.5 shrink-0 stroke-[1.65]" />
              <span>Applied for: {applicant.appliedFor}</span>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Match</span>
              <MatchScoreBadge score={applicant.matchScore} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {applicant.skills.slice(0, 10).map((s) => (
                <SkillTag key={s} skill={s} />
              ))}
              {applicant.skills.length > 10 ? (
                <span className="self-center text-xs text-muted-foreground">
                  +{applicant.skills.length - 10}
                </span>
              ) : null}
            </div>
            <div className="mt-4 max-w-md">
              <ApplicantMatchStats
                skillMatch={applicant.skillMatch}
                experienceMatch={applicant.experienceMatch}
                educationMatch={applicant.educationMatch}
              />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 border-t border-border pt-4 sm:flex-row lg:w-52 lg:border-0 lg:pt-0">
          <ApplicantStatusSelect value={status} onChange={onStatusChange} disabled={isSaving} />
          <Button size="sm" variant="outline" onClick={onViewResume}>
            View resume
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantCard;
