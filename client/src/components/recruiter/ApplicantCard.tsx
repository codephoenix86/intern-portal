// client/src/components/recruiter/applicants/ApplicantCard.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SkillTag from "@/components/SkillTag";
import MatchScoreBadge from "@/components/MatchScoreBadge";
import ApplicantMatchStats from "./ApplicantMatchStats";
import ApplicantStatusSelect from "./ApplicantStatusSelect";
import type { Applicant } from "@/types/recruiter.types";
import { applicationService, type RecruiterApplicantItem } from "@/services/applicationService";
import { toast } from "@/components/ui/use-toast";

interface ApplicantCardProps {
  applicant: Applicant;
}

const ApplicantCard = ({ applicant }: ApplicantCardProps) => {
  const [status, setStatus] = useState(applicant.status);
  const [isSaving, setIsSaving] = useState(false);

  const onStatusChange = async (nextStatus: string): Promise<void> => {
    // Optimistically reflect selection (and revert if API fails).
    const prev = status;
    setStatus(nextStatus);
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
        <ApplicantStatusSelect value={status} onChange={onStatusChange} disabled={isSaving} />
        <Button size="sm" variant="outline" onClick={onViewResume}>
          View Resume
        </Button>
      </div>
    </div>
  );
};

export default ApplicantCard;
