import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { User } from "../models/user.model.js";
import { INTERNSHIP_SEEDS } from "../data/internship-seeds.js";
import { formatRelativeTime } from "../utils/time.utils.js";
import { computeMatchScore } from "../utils/match-score.utils.js";
import { AppError } from "./auth.service.js";
function toCard(job, applicantCount, matchScore) {
    return {
        id: job._id.toString(),
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.workType,
        duration: job.duration,
        stipend: job.stipend,
        skills: job.skills,
        description: job.description,
        requirements: job.requirements,
        postedDate: formatRelativeTime(job.createdAt),
        applicants: applicantCount,
        matchScore,
    };
}
class StudentInternshipService {
    async ensureSeededJobs() {
        const count = await Job.countDocuments();
        if (count > 0)
            return;
        await Job.insertMany(INTERNSHIP_SEEDS.map((j) => ({
            ...j,
            recruiterId: null,
            isActive: true,
        })));
    }
    async applicantCount(jobId) {
        return Application.countDocuments({ jobId });
    }
    async listJobs(studentId, filters = {}) {
        await this.ensureSeededJobs();
        const user = await User.findById(studentId).select("studentSkills").lean();
        const studentSkills = user?.studentSkills ?? [];
        const q = { isActive: true };
        if (filters.location && filters.location !== "all") {
            q.location = new RegExp(filters.location.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        }
        if (filters.keyword?.trim()) {
            const kw = filters.keyword.trim();
            const re = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            q.$or = [{ title: re }, { company: re }, { skills: re }];
        }
        if (filters.skills && filters.skills.length > 0) {
            q.skills = { $in: filters.skills };
        }
        let jobs = await Job.find(q).sort({ createdAt: -1 }).lean();
        const withScores = await Promise.all(jobs.map(async (job) => {
            const score = computeMatchScore(studentSkills, job.skills);
            const applicants = await this.applicantCount(job._id.toString());
            return {
                job: job,
                matchScore: score,
                applicants,
            };
        }));
        let rows = withScores;
        if (filters.sort === "match") {
            rows = [...rows].sort((a, b) => b.matchScore - a.matchScore);
        }
        return {
            jobs: rows.map(({ job, matchScore, applicants }) => toCard(job, applicants, matchScore)),
        };
    }
    async getRecommended(studentId) {
        const { jobs } = await this.listJobs(studentId, { sort: "match" });
        return {
            jobs: jobs.filter((j) => j.matchScore >= 80),
        };
    }
    async getJobById(studentId, jobId) {
        await this.ensureSeededJobs();
        const user = await User.findById(studentId).select("studentSkills").lean();
        const studentSkills = user?.studentSkills ?? [];
        const job = await Job.findOne({ _id: jobId, isActive: true }).lean();
        if (!job) {
            throw new AppError(404, "Internship not found");
        }
        const applicants = await this.applicantCount(jobId);
        const matchScore = computeMatchScore(studentSkills, job.skills);
        return {
            job: toCard(job, applicants, matchScore),
        };
    }
    async getMatchScore(studentId, jobId) {
        await this.ensureSeededJobs();
        const user = await User.findById(studentId).select("studentSkills").lean();
        const studentSkills = user?.studentSkills ?? [];
        const job = await Job.findOne({ _id: jobId, isActive: true })
            .select("skills")
            .lean();
        if (!job) {
            throw new AppError(404, "Internship not found");
        }
        return { score: computeMatchScore(studentSkills, job.skills) };
    }
}
export const studentInternshipService = new StudentInternshipService();
//# sourceMappingURL=student-internship.service.js.map