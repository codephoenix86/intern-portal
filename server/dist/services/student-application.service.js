import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { computeMatchScore } from "../utils/match-score.utils.js";
import { AppError } from "./auth.service.js";
import { notificationService } from "./notification.service.js";
class StudentApplicationService {
    async listForStudent(studentId) {
        const apps = await Application.find({ studentId })
            .sort({ createdAt: -1 })
            .populate("jobId", "title company")
            .lean();
        return {
            applications: apps.map((a) => {
                const job = a.jobId;
                return {
                    id: a._id.toString(),
                    internship: job.title,
                    company: job.company,
                    status: a.status,
                    date: a.createdAt.toISOString().slice(0, 10),
                    matchScore: a.matchScore,
                };
            }),
        };
    }
    async apply(studentId, jobId) {
        const job = await Job.findOne({ _id: jobId, isActive: true });
        if (!job) {
            throw new AppError(404, "Internship not found");
        }
        const existing = await Application.findOne({ studentId, jobId });
        if (existing) {
            throw new AppError(400, "You have already applied to this internship");
        }
        const user = await User.findById(studentId)
            .select("studentSkills name")
            .lean();
        const studentSkills = user?.studentSkills ?? [];
        const matchScore = computeMatchScore(studentSkills, job.skills);
        const created = await Application.create({
            studentId,
            jobId,
            status: "Applied",
            matchScore,
        });
        if (job.recruiterId) {
            await notificationService.create({
                userId: job.recruiterId,
                title: "New applicant",
                message: `${user?.name ?? "A student"} applied to "${job.title}".`,
                type: "new_applicant",
                priority: "medium",
                link: `/recruiter/applicants`,
                metadata: {
                    applicationId: created._id.toString(),
                    jobId: jobId.toString(),
                },
                senderId: studentId,
                ...(user?.name ? { senderName: user.name } : {}),
            });
        }
        return { applicationId: created._id.toString() };
    }
}
export const studentApplicationService = new StudentApplicationService();
//# sourceMappingURL=student-application.service.js.map