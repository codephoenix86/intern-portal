// client/src/components/recruiter/applicants/ApplicantCard.tsx

import { Button } from "@/components/ui/button";
import SkillTag from "@/components/SkillTag";
import MatchScoreBadge from "@/components/MatchScoreBadge";
import ApplicantMatchStats from "./ApplicantMatchStats";
import ApplicantStatusSelect from "./ApplicantStatusSelect";
import type { Applicant } from "@/types/recruiter.types";

interface ApplicantCardProps {
  applicant: Applicant;
}

const ApplicantCard = ({ applicant }: ApplicantCardProps) => {
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
      <div className="flex gap-2">
        <ApplicantStatusSelect currentStatus={applicant.status} />
        <Button size="sm" variant="outline">
          View Resume
        </Button>
      </div>
    </div>
  );
};

export default ApplicantCard;
