// client/src/components/recruiter/applicants/ApplicantCard.tsx

import { Button } from "@/components/ui/button";
import SkillTag from "@/components/SkillTag";
import MatchScoreBadge from "@/components/MatchScoreBadge";
import ApplicantMatchStats from "./ApplicantMatchStats";
import ApplicantStatusSelect from "./ApplicantStatusSelect";
import type { Applicant } from "@/types/recruiter.types";

interface ApplicantCardProps {
  applicant: Applicant;
  onStatusChange?: (applicationId: string, status: string) => void;
  statusUpdating?: boolean;
}

const ApplicantCard = ({
  applicant,
  onStatusChange,
  statusUpdating,
}: ApplicantCardProps) => {
  return (
    <div className="glass-card rounded-lg p-5 hover-lift">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-foreground">{applicant.name}</h4>
          <p className="text-sm text-muted-foreground">
            {applicant.email} • Applied for: {applicant.appliedFor}
          </p>
        </div>
        <MatchScoreBadge score={applicant.matchScore} />
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {applicant.skills.map((s) => (
          <SkillTag key={s} skill={s} />
        ))}
      </div>

      {/* Match Stats */}
      <div className="mb-3">
        <ApplicantMatchStats
          skillMatch={applicant.skillMatch}
          experienceMatch={applicant.experienceMatch}
          educationMatch={applicant.educationMatch}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <ApplicantStatusSelect
          currentStatus={applicant.status}
          onChange={(v) =>
            onStatusChange?.(applicant.applicationId, v)
          }
        />
        {applicant.resumeUrl ? (
          <Button size="sm" variant="outline" asChild>
            <a
              href={applicant.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </a>
          </Button>
        ) : (
          <Button size="sm" variant="outline" disabled>
            No resume
          </Button>
        )}
      </div>
      {statusUpdating && (
        <p className="text-xs text-muted-foreground mt-2">Updating status…</p>
      )}
    </div>
  );
};

export default ApplicantCard;
