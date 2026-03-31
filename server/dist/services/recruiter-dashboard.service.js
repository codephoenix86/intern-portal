import { Types } from "mongoose";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
class RecruiterDashboardService {
    async getDashboard(recruiterId) {
        const rid = new Types.ObjectId(recruiterId);
        const jobIds = await Job.find({ recruiterId: rid }).distinct("_id");
        if (jobIds.length === 0) {
            return {
                recruiter: {
                    activeListings: 0,
                    totalApplicants: 0,
                    shortlisted: 0,
                    interviewsScheduled: 0,
                },
                statusBreakdown: this.emptyBreakdown(),
            };
        }
        const [activeListings, appsAgg, statusBreakdown] = await Promise.all([
            Job.countDocuments({ recruiterId: rid, isActive: true }),
            Application.aggregate([
                { $match: { jobId: { $in: jobIds } } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        shortlisted: {
                            $sum: { $cond: [{ $eq: ["$status", "Screening"] }, 1, 0] },
                        },
                        interviews: {
                            $sum: { $cond: [{ $eq: ["$status", "Interview"] }, 1, 0] },
                        },
                    },
                },
            ]),
            this.buildStatusBreakdown(jobIds),
        ]);
        const agg = appsAgg[0];
        return {
            recruiter: {
                activeListings,
                totalApplicants: agg?.total ?? 0,
                shortlisted: agg?.shortlisted ?? 0,
                interviewsScheduled: agg?.interviews ?? 0,
            },
            statusBreakdown,
        };
    }
    emptyBreakdown() {
        return [
            { name: "Pending", value: 0 },
            { name: "Shortlisted", value: 0 },
            { name: "Interview", value: 0 },
            { name: "Accepted", value: 0 },
            { name: "Rejected", value: 0 },
        ];
    }
    async buildStatusBreakdown(jobIds) {
        const rows = await Application.aggregate([
            { $match: { jobId: { $in: jobIds } } },
            { $group: { _id: "$status", c: { $sum: 1 } } },
        ]);
        const counts = new Map();
        for (const r of rows) {
            counts.set(r._id, r.c);
        }
        const order = [
            "Pending",
            "Shortlisted",
            "Interview",
            "Accepted",
            "Rejected",
        ];
        const dbKeys = {
            Pending: "Applied",
            Shortlisted: "Screening",
            Interview: "Interview",
            Accepted: "Offer",
            Rejected: "Rejected",
        };
        return order.map((name) => ({
            name,
            value: counts.get(dbKeys[name]) ?? 0,
        }));
    }
}
export const recruiterDashboardService = new RecruiterDashboardService();
//# sourceMappingURL=recruiter-dashboard.service.js.map