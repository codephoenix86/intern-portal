import { User } from "../models/user.model.js";
import { AppError } from "./auth.service.js";
class StudentProfileService {
  async getProfile(studentId: string) {
    const user = await User.findById(studentId).lean();
    if (!user) {
      throw new AppError(404, "User not found");
    }

    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      profileCompletion: user.profileCompletion,
      studentSkills: user.studentSkills ?? [],
      resumeUrl: user.resumeUrl,
      parsedResume: user.parsedResume,
    };
  }

  async updateProfile(
    studentId: string,
    input: {
      name?: string;
      phone?: string | null;
      studentSkills?: string[];
    },
  ) {
    const user = await User.findById(studentId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (input.name !== undefined) user.name = input.name;
    if (input.phone !== undefined) user.phone = input.phone;
    if (input.studentSkills !== undefined) user.studentSkills = input.studentSkills;

    await user.save();

    return this.getProfile(studentId);
  }

  async setResume(
    studentId: string,
    resumeUrl: string,
    parsedResume: Record<string, unknown> | null,
  ) {
    const user = await User.findById(studentId);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    user.resumeUrl = resumeUrl;
    if (parsedResume !== null) {
      user.parsedResume = parsedResume;
    }
    await user.save();
    return { resumeUrl: user.resumeUrl, parsedResume: user.parsedResume };
  }

  /**
   * Placeholder parser — swap for real PDF/text extraction later.
   */
  parseResumeStub(studentName: string, studentEmail: string) {
    return {
      name: studentName,
      email: studentEmail,
      phone: null as string | null,
      education: [] as Array<{
        degree: string;
        institution: string;
        year: string;
        gpa: string;
      }>,
      skills: [] as string[],
      experience: [] as Array<{ title: string; company: string; duration: string }>,
      projects: [] as Array<{ name: string; tech: string }>,
      _note: "Structured parsing not implemented — populate skills from your profile.",
    };
  }
}

export const studentProfileService = new StudentProfileService();
