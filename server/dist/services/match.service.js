import { Course } from "../models/course.model.js";
/**
 * Calculate match score between student skills and internship requirements
 */
export function calculateMatch(studentSkills, requiredSkills) {
    const matchedRequired = requiredSkills.filter(skill => studentSkills.includes(skill));
    const score = requiredSkills.length > 0
        ? (matchedRequired.length / requiredSkills.length) * 100
        : 0;
    const matchedSkills = matchedRequired;
    const missingSkills = requiredSkills.filter(skill => !studentSkills.includes(skill));
    return { score, matchedSkills, missingSkills };
}
/**
 * Find missing skills from required skills
 */
export function findMissingSkills(studentSkills, requiredSkills) {
    return requiredSkills.filter(skill => !studentSkills.includes(skill));
}
/**
 * Suggest courses for missing skills
 */
export async function suggestCourses(missingSkills) {
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
//# sourceMappingURL=match.service.js.map