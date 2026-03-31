import { User } from "../models/user.model.js";
import { AppError } from "./auth.service.js";
class RecruiterProfileService {
    async getProfile(recruiterId) {
        const user = await User.findById(recruiterId)
            .select("name email companyName companyEmail avatar")
            .lean();
        if (!user) {
            throw new AppError(404, "User not found");
        }
        return {
            name: user.name,
            email: user.email,
            companyName: user.companyName ?? "",
            companyEmail: user.companyEmail ?? user.email,
            avatar: user.avatar,
        };
    }
    async patchProfile(recruiterId, body) {
        const user = await User.findById(recruiterId);
        if (!user) {
            throw new AppError(404, "User not found");
        }
        if (body.companyName !== undefined) {
            user.companyName = body.companyName.trim() || null;
        }
        if (body.companyEmail !== undefined) {
            user.companyEmail = body.companyEmail?.trim().toLowerCase() || null;
        }
        await user.save();
        return this.getProfile(recruiterId);
    }
}
export const recruiterProfileService = new RecruiterProfileService();
//# sourceMappingURL=recruiter-profile.service.js.map