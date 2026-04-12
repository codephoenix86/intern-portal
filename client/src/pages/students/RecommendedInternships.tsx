import { useEffect, useState } from "react";
import InternshipCard from "@/components/InternshipCard";
import { Loader2 } from "lucide-react";
import type { InternshipJob } from "@/services/jobService";
import { studentProfileService } from "@/services/studentProfile.service";
import { studentCoursesService } from "@/services/studentCourses.service";
import { combinedInternshipsService } from "@/services/combinedInternships.service";
import { enrolledSkillsFromRows, jobHasEnrolledSkillOverlap } from "@/lib/skill-overlap";

const normalize = (value: string): string => value.trim().toLowerCase();

const computeMatchScore = (
  internship: InternshipJob,
  profileSkills: string[],
): number => {
  if (profileSkills.length === 0) return 0;

  const internshipText = `${internship.title} ${internship.skills.join(" ")}`.toLowerCase();
  const matched = profileSkills.filter((skill) => internshipText.includes(normalize(skill)));

  if (matched.length === 0) {
    return 0;
  }

  return Math.min(100, Math.round((matched.length / profileSkills.length) * 100));
};

const RecommendedInternships = () => {
  const [recommended, setRecommended] = useState<InternshipJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [enrolledSkillSet, setEnrolledSkillSet] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const loadRecommended = async (): Promise<void> => {
      try {
        const [profile, combined, enrollRows] = await Promise.all([
          studentProfileService.getProfile(),
          combinedInternshipsService.list({ limit: 200 }),
          studentCoursesService.listMyEnrollments().catch(() => []),
        ]);

        setEnrolledSkillSet(enrolledSkillsFromRows(enrollRows.map((r) => r.skills)));

        const profileSkills = profile.studentSkills.map(normalize).filter(Boolean);

        const scored = combined.items
          .map((internship) => ({
            ...internship,
            matchScore: computeMatchScore(internship, profileSkills),
          }))
          .filter((internship) => (internship.matchScore ?? 0) > 0)
          .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
          .slice(0, 24);

        setRecommended(scored);
      } catch (error) {
        console.error("Failed to load recommended internships:", error);
        setErrorMessage("Could not load recommendations right now.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadRecommended();
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Based on your profile and skills
      </p>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading recommendations...</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4">
        {!isLoading &&
          recommended.map((i) => (
            <InternshipCard
              key={i.id}
              {...i}
              hasRelatedCourseCoverage={jobHasEnrolledSkillOverlap(i.skills, enrolledSkillSet)}
            />
          ))}

        {!isLoading && !errorMessage && recommended.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No matching recommendations yet. Add more skills in your profile.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecommendedInternships;
