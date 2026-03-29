import { User } from "../models/user.model.js";
import { AppError } from "./auth.service.js";

const hasValue = (value: string | null | undefined): boolean =>
  typeof value === "string" && value.trim().length > 0;

class StudentProfileService {
  private recomputeProfileCompletion(user: {
    name: string;
    college: string | null;
    branch: string | null;
    location: string | null;
    studentSkills: string[];
    studentProjects: string[];
    resumeUrl: string | null;
    profileCompletion: number;
  }): void {
    const basicInfoComplete =
      hasValue(user.name) &&
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

  async updateProfile(
    studentId: string,
    input: {
      name?: string;
      phone?: string | null;
      avatar?: string | null;
      bio?: string | null;
      college?: string | null;
      branch?: string | null;
      location?: string | null;
      cgpa?: string | null;
      semester?: string | null;
      experienceSummary?: string | null;
      studentSkills?: string[];
      studentProjects?: string[];
      achievements?: string[];
      codingProfiles?: {
        leetcode?: string | null;
        codechef?: string | null;
        codeforces?: string | null;
        github?: string | null;
        linkedin?: string | null;
        portfolio?: string | null;
      };
    },
  ) {
    const user = await User.findById(studentId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (input.name !== undefined) user.name = input.name;
    if (input.phone !== undefined) user.phone = input.phone;
    if (input.avatar !== undefined) user.avatar = input.avatar;
    if (input.bio !== undefined) user.bio = input.bio;
    if (input.college !== undefined) user.college = input.college;
    if (input.branch !== undefined) user.branch = input.branch;
    if (input.location !== undefined) user.location = input.location;
    if (input.cgpa !== undefined) user.cgpa = input.cgpa;
    if (input.semester !== undefined) user.semester = input.semester;
    if (input.experienceSummary !== undefined) {
      user.experienceSummary = input.experienceSummary;
    }
    if (input.studentSkills !== undefined) user.studentSkills = input.studentSkills;
    if (input.studentProjects !== undefined) {
      user.studentProjects = input.studentProjects;
    }
    if (input.achievements !== undefined) {
      user.achievements = input.achievements;
    }
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

    this.recomputeProfileCompletion(user);

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
