import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { calculateMatch, findMissingSkills, suggestCourses } from "../services/match.service.js";
/**
 * Get match score and skills for a student and internship
 */
export const getMatch = async (req, res) => {
    try {
        const { studentId, internshipId } = req.params;
        // Fetch student
        const student = await User.findById(studentId);
        if (!student || student.role !== "student") {
            res.status(404).json({ success: false, message: "Student not found" });
            return;
        }
        // Fetch internship
        const internship = await Job.findById(internshipId);
        if (!internship) {
            res.status(404).json({ success: false, message: "Internship not found" });
            return;
        }
        const studentSkills = student.studentSkills || [];
        const requiredSkills = internship.skills || [];
        const result = calculateMatch(studentSkills, requiredSkills);
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        console.error("Error in getMatch:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
/**
 * Get missing skills and course suggestions for a student and internship
 */
export const getSuggestions = async (req, res) => {
    try {
        const { studentId, internshipId } = req.params;
        // Fetch student
        const student = await User.findById(studentId);
        if (!student || student.role !== "student") {
            res.status(404).json({ success: false, message: "Student not found" });
            return;
        }
        // Fetch internship
        const internship = await Job.findById(internshipId);
        if (!internship) {
            res.status(404).json({ success: false, message: "Internship not found" });
            return;
        }
        const studentSkills = student.studentSkills || [];
        const requiredSkills = internship.skills || [];
        const missingSkills = findMissingSkills(studentSkills, requiredSkills);
        const recommendedCourses = await suggestCourses(missingSkills);
        const result = {
            missingSkills,
            recommendedCourses
        };
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        console.error("Error in getSuggestions:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
//# sourceMappingURL=match.controller.js.map