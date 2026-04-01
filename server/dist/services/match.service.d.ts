export interface MatchResult {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
}
export interface CourseSuggestion {
    _id: string;
    name: string;
    link: string;
}
export interface SuggestionsResult {
    missingSkills: string[];
    recommendedCourses: CourseSuggestion[];
}
/**
 * Calculate match score between student skills and internship requirements
 */
export declare function calculateMatch(studentSkills: string[], requiredSkills: string[]): MatchResult;
/**
 * Find missing skills from required skills
 */
export declare function findMissingSkills(studentSkills: string[], requiredSkills: string[]): string[];
/**
 * Suggest courses for missing skills
 */
export declare function suggestCourses(missingSkills: string[]): Promise<CourseSuggestion[]>;
//# sourceMappingURL=match.service.d.ts.map