import { Course } from "../models/course.model.js";

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
export function calculateMatch(
  studentSkills: string[],
  requiredSkills: string[]
): MatchResult {
  const matchedRequired = requiredSkills.filter(skill =>
    studentSkills.includes(skill)
  );

  const score = requiredSkills.length > 0
    ? (matchedRequired.length / requiredSkills.length) * 100
    : 0;

  const matchedSkills = matchedRequired;
  const missingSkills = requiredSkills.filter(skill =>
    !studentSkills.includes(skill)
  );

  return { score, matchedSkills, missingSkills };
}

/**
 * Find missing skills from required skills
 */
export function findMissingSkills(
  studentSkills: string[],
  requiredSkills: string[]
): string[] {
  return requiredSkills.filter(skill => !studentSkills.includes(skill));
}

/**
 * Suggest courses for missing skills
 */
export async function suggestCourses(
  missingSkills: string[]
): Promise<CourseSuggestion[]> {
  if (missingSkills.length === 0) {
    return [];
  }

  const courses = await Course.find({
    skills: { $in: missingSkills },
    isPublished: true
  }).select('_id title slug').lean();

  return courses.map(course => ({
    _id: course._id.toString(),
    name: course.title,
    link: course.slug
  }));
}