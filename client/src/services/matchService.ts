import api from "@/lib/axios";

export interface MatchData {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface CourseSuggestion {
  _id: string;
  name: string;
  link: string;
}

export interface SuggestionsData {
  missingSkills: string[];
  recommendedCourses: CourseSuggestion[];
}

/**
 * Get match score and skills for a student and internship
 */
export const getMatch = async (
  studentId: string,
  internshipId: string
): Promise<MatchData> => {
  const response = await api.get(`/match/${studentId}/${internshipId}`);
  return response.data.data;
};

/**
 * Get missing skills and course suggestions for a student and internship
 */
export const getSuggestions = async (
  studentId: string,
  internshipId: string
): Promise<SuggestionsData> => {
  const response = await api.get(`/suggestions/${studentId}/${internshipId}`);
  return response.data.data;
};