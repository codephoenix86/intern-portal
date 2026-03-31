/**
 * Simple overlap-based match score (0–100) between student skills and job skills.
 */
export declare function computeMatchScore(studentSkills: string[], jobSkills: string[]): number;
/**
 * Derive stable sub-scores for recruiter applicant cards from the stored match score.
 * Uses a deterministic seed (e.g. application id) so values do not flicker between requests.
 */
export declare function stableMatchBreakdown(matchScore: number, seed: string): {
    skillMatch: number;
    experienceMatch: number;
    educationMatch: number;
};
//# sourceMappingURL=match-score.utils.d.ts.map