import { studentInternshipService } from "../services/student-internship.service.js";
import { studentApplicationService } from "../services/student-application.service.js";
import { studentDashboardService } from "../services/student-dashboard.service.js";
import { studentProfileService } from "../services/student-profile.service.js";
import { studentContentService } from "../services/student-content.service.js";
import { notificationService } from "../services/notification.service.js";
import { User } from "../models/user.model.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";
import { AppError } from "../services/auth.service.js";
import { jobListQuerySchema, updateStudentProfileSchema, parseResumeBodySchema, } from "../validators/student.validator.js";
import { formatRelativeTime } from "../utils/time.utils.js";
function routeParam(value) {
    if (value == null)
        return undefined;
    return Array.isArray(value) ? value[0] : value;
}
const successUiTypes = new Set([
    "application_update",
    "interview_scheduled",
    "certificate_issued",
    "course_enrolled",
]);
function mapNotification(n) {
    return {
        id: n._id.toString(),
        message: n.title ? `${n.title}: ${n.message}` : n.message,
        time: formatRelativeTime(n.createdAt),
        read: n.read,
        type: successUiTypes.has(n.type)
            ? "success"
            : "info",
    };
}
export const getDashboard = async (req, res) => {
    try {
        const userId = req.user.userId;
        const data = await studentDashboardService.getDashboard(userId);
        sendSuccess(res, 200, "OK", data);
    }
    catch (error) {
        console.error(error);
        sendError(res, 500, "Failed to load dashboard");
    }
};
export const listJobs = async (req, res) => {
    try {
        const parsed = jobListQuerySchema.safeParse(req.query);
        const f = parsed.success
            ? parsed.data
            : { sort: "newest", keyword: undefined, location: undefined, skills: undefined };
        const listFilters = { sort: f.sort };
        if (f.keyword !== undefined)
            listFilters.keyword = f.keyword;
        if (f.location !== undefined)
            listFilters.location = f.location;
        if (f.skills !== undefined)
            listFilters.skills = f.skills;
        const data = await studentInternshipService.listJobs(req.user.userId, listFilters);
        sendSuccess(res, 200, "OK", data);
    }
    catch (error) {
        console.error(error);
        sendError(res, 500, "Failed to list internships");
    }
};
export const listRecommended = async (req, res) => {
    try {
        const data = await studentInternshipService.getRecommended(req.user.userId);
        sendSuccess(res, 200, "OK", data);
    }
    catch (error) {
        console.error(error);
        sendError(res, 500, "Failed to load recommendations");
    }
};
export const getJob = async (req, res) => {
    try {
        const jobId = routeParam(req.params["jobId"]);
        if (!jobId) {
            sendError(res, 400, "Job ID required");
            return;
        }
        const data = await studentInternshipService.getJobById(req.user.userId, jobId);
        sendSuccess(res, 200, "OK", data);
    }
    catch (error) {
        if (error instanceof AppError) {
            sendError(res, error.statusCode, error.message);
            return;
        }
        console.error(error);
        sendError(res, 500, "Failed to load internship");
    }
};
export const getMatchScore = async (req, res) => {
    try {
        const jobId = routeParam(req.params["jobId"]);
        if (!jobId) {
            sendError(res, 400, "Job ID required");
            return;
        }
        const data = await studentInternshipService.getMatchScore(req.user.userId, jobId);
        sendSuccess(res, 200, "OK", data);
    }
    catch (error) {
        if (error instanceof AppError) {
            sendError(res, error.statusCode, error.message);
            return;
        }
        console.error(error);
        sendError(res, 500, "Failed to compute match score");
    }
};
export const applyToJob = async (req, res) => {
    try {
        const jobId = routeParam(req.params["jobId"]);
        if (!jobId) {
            sendError(res, 400, "Job ID required");
            return;
        }
        const data = await studentApplicationService.apply(req.user.userId, jobId);
        sendSuccess(res, 201, "Application submitted", data);
    }
    catch (error) {
        if (error instanceof AppError) {
            sendError(res, error.statusCode, error.message);
            return;
        }
        console.error(error);
        sendError(res, 500, "Failed to apply");
    }
};
export const listApplications = async (req, res) => {
    try {
        const data = await studentApplicationService.listForStudent(req.user.userId);
        sendSuccess(res, 200, "OK", data);
    }
    catch (error) {
        console.error(error);
        sendError(res, 500, "Failed to list applications");
    }
};
export const getStudentProfile = async (req, res) => {
    try {
        const data = await studentProfileService.getProfile(req.user.userId);
        sendSuccess(res, 200, "OK", data);
    }
    catch (error) {
        if (error instanceof AppError) {
            sendError(res, error.statusCode, error.message);
            return;
        }
        console.error(error);
        sendError(res, 500, "Failed to load profile");
    }
};
export const patchStudentProfile = async (req, res) => {
    try {
        const parsed = updateStudentProfileSchema.safeParse(req.body);
        if (!parsed.success) {
            sendError(res, 400, "Invalid body");
            return;
        }
        const body = parsed.data;
        const update = {};
        if (body.name !== undefined)
            update.name = body.name;
        if (body.phone !== undefined)
            update.phone = body.phone;
        if (body.avatar !== undefined)
            update.avatar = body.avatar;
        if (body.bio !== undefined)
            update.bio = body.bio;
        if (body.college !== undefined)
            update.college = body.college;
        if (body.branch !== undefined)
            update.branch = body.branch;
        if (body.location !== undefined)
            update.location = body.location;
        if (body.cgpa !== undefined)
            update.cgpa = body.cgpa;
        if (body.semester !== undefined)
            update.semester = body.semester;
        if (body.experienceSummary !== undefined) {
            update.experienceSummary = body.experienceSummary;
        }
        if (body.studentSkills !== undefined)
            update.studentSkills = body.studentSkills;
        if (body.studentProjects !== undefined) {
            update.studentProjects = body.studentProjects;
        }
        if (body.achievements !== undefined)
            update.achievements = body.achievements;
        if (body.targetJobRole !== undefined)
            update.targetJobRole = body.targetJobRole;
        if (body.targetSalary !== undefined)
            update.targetSalary = body.targetSalary;
        if (body.targetCompanies !== undefined) {
            update.targetCompanies = body.targetCompanies;
        }
        if (body.codingProfiles !== undefined) {
            const codingProfiles = {};
            if (body.codingProfiles.leetcode !== undefined) {
                codingProfiles.leetcode = body.codingProfiles.leetcode;
            }
            if (body.codingProfiles.codechef !== undefined) {
                codingProfiles.codechef = body.codingProfiles.codechef;
            }
            if (body.codingProfiles.codeforces !== undefined) {
                codingProfiles.codeforces = body.codingProfiles.codeforces;
            }
            if (body.codingProfiles.github !== undefined) {
                codingProfiles.github = body.codingProfiles.github;
            }
            if (body.codingProfiles.linkedin !== undefined) {
                codingProfiles.linkedin = body.codingProfiles.linkedin;
            }
            if (body.codingProfiles.portfolio !== undefined) {
                codingProfiles.portfolio = body.codingProfiles.portfolio;
            }
            update.codingProfiles = codingProfiles;
        }
        const data = await studentProfileService.updateProfile(req.user.userId, update);
        sendSuccess(res, 200, "Profile updated", data);
    }
    catch (error) {
        if (error instanceof AppError) {
            sendError(res, error.statusCode, error.message);
            return;
        }
        console.error(error);
        sendError(res, 500, "Failed to update profile");
    }
};
export const postResumeUpload = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            sendError(res, 400, "File is required");
            return;
        }
        const base = `${req.protocol}://${req.get("host")}`;
        const publicPath = `/uploads/resumes/${file.filename}`;
        const fileUrl = `${base}${publicPath}`;
        const user = await User.findById(req.user.userId).select("name email");
        const parsed = studentProfileService.parseResumeStub(user?.name ?? "Student", user?.email ?? "");
        await studentProfileService.setResume(req.user.userId, fileUrl, parsed);
        sendSuccess(res, 200, "Resume uploaded", {
            url: fileUrl,
            parsedResume: parsed,
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            sendError(res, error.statusCode, error.message);
            return;
        }
        console.error(error);
        sendError(res, 500, "Failed to upload resume");
    }
};
export const postParseResume = async (req, res) => {
    try {
        const parsed = parseResumeBodySchema.safeParse(req.body);
        if (!parsed.success) {
            sendError(res, 400, "fileUrl is required");
            return;
        }
        const user = await User.findById(req.user.userId).select("name email");
        const data = studentProfileService.parseResumeStub(user?.name ?? "Student", user?.email ?? "");
        await studentProfileService.setResume(req.user.userId, parsed.data.fileUrl, data);
        sendSuccess(res, 200, "OK", data);
    }
    catch (error) {
        if (error instanceof AppError) {
            sendError(res, error.statusCode, error.message);
            return;
        }
        console.error(error);
        sendError(res, 500, "Failed to parse resume");
    }
};
export const getQuiz = async (req, res) => {
    try {
        const skill = routeParam(req.query["skill"]);
        const rawCount = routeParam(req.query["count"]);
        const count = rawCount ? Number(rawCount) : undefined;
        const data = studentContentService.getQuiz(skill, count);
        sendSuccess(res, 200, "OK", data);
    }
    catch (error) {
        if (error instanceof AppError) {
            sendError(res, error.statusCode, error.message);
            return;
        }
        console.error(error);
        sendError(res, 500, "Failed to load quiz");
    }
};
export const getRoadmap = async (req, res) => {
    try {
        const rawFields = routeParam(req.query["fields"]);
        const fields = rawFields
            ? rawFields
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean)
            : undefined;
        const data = await studentContentService.getRoadmap(req.user.userId, fields);
        sendSuccess(res, 200, "OK", data);
    }
    catch (error) {
        if (error instanceof AppError) {
            sendError(res, error.statusCode, error.message);
            return;
        }
        console.error(error);
        sendError(res, 500, "Failed to load roadmap");
    }
};
export const patchRoadmapTask = async (req, res) => {
    try {
        const taskId = routeParam(req.params["taskId"]);
        if (!taskId) {
            sendError(res, 400, "taskId required");
            return;
        }
        const data = await studentContentService.toggleRoadmapTask(req.user.userId, taskId);
        sendSuccess(res, 200, "OK", data);
    }
    catch (error) {
        if (error instanceof AppError) {
            sendError(res, error.statusCode, error.message);
            return;
        }
        console.error(error);
        sendError(res, 500, "Failed to update roadmap");
    }
};
export const getCourses = async (req, res) => {
    try {
        const rawFields = routeParam(req.query["fields"]);
        const fields = rawFields
            ? rawFields
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean)
            : undefined;
        const data = studentContentService.getCourses(fields);
        sendSuccess(res, 200, "OK", data);
    }
    catch (error) {
        console.error(error);
        sendError(res, 500, "Failed to load courses");
    }
};
export const listNotifications = async (req, res) => {
    try {
        const page = Number(req.query["page"]) || 1;
        const limit = Number(req.query["limit"]) || 20;
        const result = await notificationService.getByUserId(req.user.userId, page, limit, false);
        const notifications = result.notifications.map((n) => mapNotification(n));
        sendSuccess(res, 200, "OK", {
            notifications,
            total: result.total,
            unreadCount: result.unreadCount,
            page: result.page,
            totalPages: result.totalPages,
        });
    }
    catch (error) {
        console.error(error);
        sendError(res, 500, "Failed to load notifications");
    }
};
export const markNotificationRead = async (req, res) => {
    try {
        const id = routeParam(req.params["id"]);
        if (!id) {
            sendError(res, 400, "id required");
            return;
        }
        await notificationService.markAsRead(id, req.user.userId);
        sendSuccess(res, 200, "Marked as read");
    }
    catch (error) {
        console.error(error);
        sendError(res, 500, "Failed to update notification");
    }
};
export const markAllNotificationsRead = async (req, res) => {
    try {
        await notificationService.markAllAsRead(req.user.userId);
        sendSuccess(res, 200, "All marked as read");
    }
    catch (error) {
        console.error(error);
        sendError(res, 500, "Failed to update notifications");
    }
};
//# sourceMappingURL=student-portal.controller.js.map