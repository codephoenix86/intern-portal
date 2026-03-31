import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { formatRelativeTime } from "../utils/time.utils.js";
import { AppError } from "./auth.service.js";
function workTypeFromBody(type) {
    if (type === "remote" || type === "Remote")
        return "Remote";
    if (type === "onsite" || type === "On-site")
        return "On-site";
    if (type === "hybrid" || type === "Hybrid")
        return "Hybrid";
    return type;
}
class RecruiterJobService {
    async listJobs(recruiterId) {
        const jobs = await Job.find({ recruiterId })
            .sort({ createdAt: -1 })
            .lean();
        const rows = await Promise.all(jobs.map(async (job) => {
            const applicants = await Application.countDocuments({
                jobId: job._id,
            });
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
                applicants,
                isActive: job.isActive,
            };
        }));
        return { jobs: rows };
    }
    async getJob(recruiterId, jobId) {
        const job = await Job.findOne({ _id: jobId, recruiterId }).lean();
        if (!job) {
            throw new AppError(404, "Listing not found");
        }
        const applicants = await Application.countDocuments({ jobId });
        return {
            job: {
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
                applicants,
                isActive: job.isActive,
            },
        };
    }
    async createJob(recruiterId, body) {
        const workType = workTypeFromBody(body.type);
        const created = await Job.create({
            recruiterId,
            title: body.title,
            company: body.company,
            location: body.location,
            workType,
            duration: body.duration,
            stipend: body.stipend,
            skills: body.skills,
            description: body.description,
            requirements: body.requirements ?? [],
            isActive: true,
        });
        return {
            jobId: created._id.toString(),
        };
    }
    async updateJob(recruiterId, jobId, body) {
        const job = await Job.findOne({ _id: jobId, recruiterId });
        if (!job) {
            throw new AppError(404, "Listing not found");
        }
        if (body.title !== undefined)
            job.title = body.title;
        if (body.company !== undefined)
            job.company = body.company;
        if (body.location !== undefined)
            job.location = body.location;
        if (body.type !== undefined)
            job.workType = workTypeFromBody(body.type);
        if (body.duration !== undefined)
            job.duration = body.duration;
        if (body.stipend !== undefined)
            job.stipend = body.stipend;
        if (body.skills !== undefined)
            job.skills = body.skills;
        if (body.description !== undefined)
            job.description = body.description;
        if (body.requirements !== undefined)
            job.requirements = body.requirements;
        if (body.isActive !== undefined)
            job.isActive = body.isActive;
        await job.save();
        return { jobId: job._id.toString() };
    }
    async closeJob(recruiterId, jobId) {
        return this.updateJob(recruiterId, jobId, { isActive: false });
    }
}
export const recruiterJobService = new RecruiterJobService();
//# sourceMappingURL=recruiter-job.service.js.map