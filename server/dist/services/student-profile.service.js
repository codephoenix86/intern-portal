import { User } from "../models/user.model.js";
import { AppError } from "./auth.service.js";
const hasValue = (value) => typeof value === "string" && value.trim().length > 0;
class StudentProfileService {
    recomputeProfileCompletion(user) {
        const basicInfoComplete = hasValue(user.name) &&
            hasValue(user.college) &&
            hasValue(user.branch) &&
            hasValue(user.location);
        const skillsComplete = user.studentSkills.length > 0;
        const resumeComplete = hasValue(user.resumeUrl);
        const projectsComplete = user.studentProjects.length > 0;
        const completedCount = [
            basicInfoComplete,
            skillsComplete,
            resumeComplete,
            projectsComplete,
        ].filter(Boolean).length;
        user.profileCompletion = Math.round((completedCount / 4) * 100);
    }
    async getProfile(studentId) {
        const user = await User.findById(studentId).lean();
        if (!user) {
            throw new AppError(404, "User not found");
        }
        return {
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            bio: user.bio,
            role: "Student",
            college: user.college,
            branch: user.branch,
            location: user.location,
            cgpa: user.cgpa,
            semester: user.semester,
            experienceSummary: user.experienceSummary,
            profileCompletion: user.profileCompletion,
            studentSkills: user.studentSkills ?? [],
            studentProjects: user.studentProjects ?? [],
            achievements: user.achievements ?? [],
            targetJobRole: user.targetJobRole ?? null,
            targetSalary: user.targetSalary ?? null,
            targetCompanies: user.targetCompanies ?? [],
            codingProfiles: {
                leetcode: user.codingProfiles?.leetcode ?? null,
                codechef: user.codingProfiles?.codechef ?? null,
                codeforces: user.codingProfiles?.codeforces ?? null,
                github: user.codingProfiles?.github ?? null,
                linkedin: user.codingProfiles?.linkedin ?? null,
                portfolio: user.codingProfiles?.portfolio ?? null,
            },
            resumeUrl: user.resumeUrl,
            parsedResume: user.parsedResume,
            updatedAt: user.updatedAt,
        };
    }
    async updateProfile(studentId, input) {
        const user = await User.findById(studentId);
        if (!user) {
            throw new AppError(404, "User not found");
        }
        if (input.name !== undefined)
            user.name = input.name;
        if (input.phone !== undefined)
            user.phone = input.phone;
        if (input.avatar !== undefined)
            user.avatar = input.avatar;
        if (input.bio !== undefined)
            user.bio = input.bio;
        if (input.college !== undefined)
            user.college = input.college;
        if (input.branch !== undefined)
            user.branch = input.branch;
        if (input.location !== undefined)
            user.location = input.location;
        if (input.cgpa !== undefined)
            user.cgpa = input.cgpa;
        if (input.semester !== undefined)
            user.semester = input.semester;
        if (input.experienceSummary !== undefined) {
            user.experienceSummary = input.experienceSummary;
        }
        if (input.studentSkills !== undefined)
            user.studentSkills = input.studentSkills;
        if (input.studentProjects !== undefined) {
            user.studentProjects = input.studentProjects;
        }
        if (input.achievements !== undefined) {
            user.achievements = input.achievements;
        }
        if (input.targetJobRole !== undefined)
            user.targetJobRole = input.targetJobRole;
        if (input.targetSalary !== undefined)
            user.targetSalary = input.targetSalary;
        if (input.targetCompanies !== undefined)
            user.targetCompanies = input.targetCompanies;
        if (input.codingProfiles !== undefined) {
            user.codingProfiles = {
                ...(user.codingProfiles ?? {}),
                ...input.codingProfiles,
            };
        }
        this.recomputeProfileCompletion(user);
        await user.save();
        return this.getProfile(studentId);
    }
    async setResume(studentId, resumeUrl, parsedResume) {
        const user = await User.findById(studentId);
        if (!user) {
            throw new AppError(404, "User not found");
        }
        user.resumeUrl = resumeUrl;
        if (parsedResume !== null) {
            user.parsedResume = parsedResume;
        }
        this.recomputeProfileCompletion(user);
        await user.save();
        return { resumeUrl: user.resumeUrl, parsedResume: user.parsedResume };
    }
    /**
     * Placeholder parser — swap for real PDF/text extraction later.
     */
    parseResumeStub(studentName, studentEmail) {
        return {
            name: studentName,
            email: studentEmail,
            phone: null,
            education: [],
            skills: [],
            experience: [],
            projects: [],
            _note: "Structured parsing not implemented — populate skills from your profile.",
        };
    }
}
export const studentProfileService = new StudentProfileService();
//# sourceMappingURL=student-profile.service.js.map