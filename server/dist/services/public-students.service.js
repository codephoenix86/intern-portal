import { User } from "../models/user.model.js";
function escapeRegex(input) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function addIfPresent(target, key, value) {
    if (value === null || value === undefined)
        return;
    target[key] = value;
}
class PublicStudentsService {
    async list(input) {
        const page = input.page;
        const limit = input.limit;
        const skip = (page - 1) * limit;
        const filter = {
            role: "student",
            isActive: true,
        };
        if (input.q) {
            const rx = new RegExp(escapeRegex(input.q), "i");
            filter["name"] = rx;
        }
        if (input.college) {
            filter["college"] = new RegExp(escapeRegex(input.college), "i");
        }
        if (input.branch) {
            filter["branch"] = new RegExp(escapeRegex(input.branch), "i");
        }
        if (input.location) {
            filter["location"] = new RegExp(escapeRegex(input.location), "i");
        }
        if (input.skills && input.skills.length > 0) {
            filter["studentSkills"] = { $all: input.skills };
        }
        const sortDir = input.order === "asc" ? 1 : -1;
        const sort = { [input.sort]: sortDir };
        const [total, docs] = await Promise.all([
            User.countDocuments(filter),
            User.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select([
                "name",
                "avatar",
                "college",
                "branch",
                "location",
                "bio",
                "experienceSummary",
                "studentSkills",
                "studentProjects",
                "achievements",
                "codingProfiles",
                "profileCompletion",
                "updatedAt",
            ].join(" "))
                .lean(),
        ]);
        const items = docs.map((u) => {
            const out = {
                id: u._id.toString(),
                name: u.name,
                studentSkills: u.studentSkills ?? [],
                studentProjects: u.studentProjects ?? [],
                achievements: u.achievements ?? [],
                profileCompletion: u.profileCompletion ?? 0,
                updatedAt: u.updatedAt,
            };
            addIfPresent(out, "avatar", u.avatar);
            addIfPresent(out, "college", u.college);
            addIfPresent(out, "branch", u.branch);
            addIfPresent(out, "location", u.location);
            addIfPresent(out, "bio", u.bio);
            addIfPresent(out, "experienceSummary", u.experienceSummary);
            const coding = {};
            const cp = u.codingProfiles;
            if (cp) {
                addIfPresent(coding, "leetcode", cp.leetcode);
                addIfPresent(coding, "codechef", cp.codechef);
                addIfPresent(coding, "codeforces", cp.codeforces);
                addIfPresent(coding, "github", cp.github);
                addIfPresent(coding, "linkedin", cp.linkedin);
                addIfPresent(coding, "portfolio", cp.portfolio);
            }
            if (Object.keys(coding).length > 0) {
                out.codingProfiles = coding;
            }
            return out;
        });
        const totalPages = Math.max(1, Math.ceil(total / limit));
        return { items, page, limit, total, totalPages };
    }
    async getById(studentId) {
        const doc = await User.findOne({
            _id: studentId,
            role: "student",
            isActive: true,
        })
            .select([
            "name",
            "avatar",
            "college",
            "branch",
            "location",
            "bio",
            "experienceSummary",
            "studentSkills",
            "studentProjects",
            "achievements",
            "codingProfiles",
            "profileCompletion",
            "updatedAt",
        ].join(" "))
            .lean();
        if (!doc)
            return null;
        const out = {
            id: doc._id.toString(),
            name: doc.name,
            studentSkills: doc.studentSkills ?? [],
            studentProjects: doc.studentProjects ?? [],
            achievements: doc.achievements ?? [],
            profileCompletion: doc.profileCompletion ?? 0,
            updatedAt: doc.updatedAt,
        };
        addIfPresent(out, "avatar", doc.avatar);
        addIfPresent(out, "college", doc.college);
        addIfPresent(out, "branch", doc.branch);
        addIfPresent(out, "location", doc.location);
        addIfPresent(out, "bio", doc.bio);
        addIfPresent(out, "experienceSummary", doc.experienceSummary);
        const coding = {};
        const cp = doc.codingProfiles;
        if (cp) {
            addIfPresent(coding, "leetcode", cp.leetcode);
            addIfPresent(coding, "codechef", cp.codechef);
            addIfPresent(coding, "codeforces", cp.codeforces);
            addIfPresent(coding, "github", cp.github);
            addIfPresent(coding, "linkedin", cp.linkedin);
            addIfPresent(coding, "portfolio", cp.portfolio);
        }
        if (Object.keys(coding).length > 0) {
            out.codingProfiles = coding;
        }
        return { student: out };
    }
}
export const publicStudentsService = new PublicStudentsService();
//# sourceMappingURL=public-students.service.js.map