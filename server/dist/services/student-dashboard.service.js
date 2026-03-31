import { Types } from "mongoose";
import { Application } from "../models/application.model.js";
import { User } from "../models/user.model.js";
class StudentDashboardService {
    async getDashboard(studentId) {
        const user = await User.findById(studentId)
            .select("profileViews studentSkills")
            .lean();
        const sid = new Types.ObjectId(studentId);
        const [apps, interviewCount, matchAgg] = await Promise.all([
            Application.countDocuments({ studentId: sid }),
            Application.countDocuments({ studentId: sid, status: "Interview" }),
            Application.aggregate([
                { $match: { studentId: sid } },
                { $group: { _id: null, avg: { $avg: "$matchScore" } } },
            ]),
        ]);
        const avgMatch = matchAgg[0]?.avg != null ? Math.round(matchAgg[0].avg) : 85;
        return {
            student: {
                applicationsSubmitted: apps,
                interviewsScheduled: interviewCount,
                profileViews: user?.profileViews ?? 0,
                matchScore: avgMatch,
            },
        };
    }
}
export const studentDashboardService = new StudentDashboardService();
//# sourceMappingURL=student-dashboard.service.js.map