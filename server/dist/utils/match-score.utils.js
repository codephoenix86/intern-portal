/**
 * Simple overlap-based match score (0–100) between student skills and job skills.
 */
export function computeMatchScore(studentSkills, jobSkills) {
    if (jobSkills.length === 0)
        return 0;
    const norm = (s) => s.trim().toLowerCase();
    const set = new Set(studentSkills.map(norm));
    let overlap = 0;
    for (const j of jobSkills) {
        if (set.has(norm(j)))
            overlap += 1;
    }
    const base = Math.round((overlap / jobSkills.length) * 100);
    return Math.min(100, Math.max(40, base || 45));
}
/**
 * Derive stable sub-scores for recruiter applicant cards from the stored match score.
 * Uses a deterministic seed (e.g. application id) so values do not flicker between requests.
 */
export function stableMatchBreakdown(matchScore, seed) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    }
    const u = (n) => ((h >>> n) & 0xff) / 255;
    const jitter = (range, shift) => Math.round((u(shift) - 0.5) * 2 * range);
    const skillMatch = Math.min(100, Math.max(40, matchScore + jitter(6, 3)));
    const experienceMatch = Math.min(100, Math.max(40, matchScore - 4 + jitter(8, 7)));
    const educationMatch = Math.min(100, Math.max(40, matchScore + 2 + jitter(7, 11)));
    return { skillMatch, experienceMatch, educationMatch };
}
//# sourceMappingURL=match-score.utils.js.map