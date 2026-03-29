import { Types } from "mongoose";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { stableMatchBreakdown } from "../utils/match-score.utils.js";
import {
  applicationStatusToRecruiter,
  isRecruiterApplicationStatus,
  recruiterStatusToApplication,
} from "../utils/recruiter-status.utils.js";
import { notificationService } from "./notification.service.js";
import { AppError } from "./auth.service.js";

function applicantNumericId(idHex: string): number {
  let h = 0;
  for (let i = 0; i < idHex.length; i++) {
    h = (Math.imul(31, h) + idHex.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % 2147483647;
}

class RecruiterApplicantService {
  async listApplicants(
    recruiterId: string,
    filters: { status?: string },
  ) {
    const rid = new Types.ObjectId(recruiterId);
    const jobIds = await Job.find({ recruiterId: rid }).distinct("_id");
    if (jobIds.length === 0) {
      return { applicants: [] };
    }

    const match: Record<string, unknown> = { jobId: { $in: jobIds } };
    if (
      filters.status &&
      filters.status !== "all" &&
      isRecruiterApplicationStatus(filters.status)
    ) {
      match["status"] = recruiterStatusToApplication(filters.status);
    }

    const apps = await Application.find(match)
      .sort({ createdAt: -1 })
      .populate<{ jobId: { title: string } }>("jobId", "title")
      .lean();

    const studentIds = [...new Set(apps.map((a) => a.studentId.toString()))];
    const students = await User.find({ _id: { $in: studentIds } })
      .select("name email studentSkills resumeUrl")
      .lean();
    const byStudent = new Map(students.map((u) => [u._id.toString(), u]));

    return {
      applicants: apps.map((a) => {
        const job = a.jobId as unknown as { title: string };
        const st = byStudent.get(a.studentId.toString());
        return this.mapApplicant(a, job.title, st);
      }),
    };
  }

  private mapApplicant(
    a: {
      _id: Types.ObjectId;
      studentId: Types.ObjectId;
      status: string;
      matchScore: number;
    },
    jobTitle: string,
    st:
      | {
          name: string;
          email: string;
          studentSkills: string[];
          resumeUrl: string | null;
        }
      | undefined,
  ) {
    const seed = a._id.toString();
    const { skillMatch, experienceMatch, educationMatch } = stableMatchBreakdown(
      a.matchScore,
      seed,
    );
    const status = applicationStatusToRecruiter(
      a.status as import("../models/application.model.js").ApplicationStatus,
    );

    return {
      id: applicantNumericId(seed),
      applicationId: seed,
      name: st?.name ?? "Unknown",
      email: st?.email ?? "",
      appliedFor: jobTitle,
      matchScore: a.matchScore,
      skills: st?.studentSkills ?? [],
      skillMatch,
      experienceMatch,
      educationMatch,
      status,
      resumeUrl: st?.resumeUrl ?? null,
    };
  }

  async updateApplicationStatus(
    recruiterId: string,
    applicationId: string,
    status: string,
  ) {
    if (!isRecruiterApplicationStatus(status)) {
      throw new AppError(400, "Invalid status");
    }

    const app = await Application.findById(applicationId)
      .populate<{ jobId: { recruiterId: Types.ObjectId; title: string } }>(
        "jobId",
        "recruiterId title",
      )
      .lean();

    if (!app) {
      throw new AppError(404, "Application not found");
    }

    const job = app.jobId as unknown as {
      recruiterId: Types.ObjectId;
      title: string;
    };
    if (job.recruiterId?.toString() !== recruiterId) {
      throw new AppError(403, "Not allowed to update this application");
    }

    const next = recruiterStatusToApplication(status);
    await Application.updateOne(
      { _id: applicationId },
      { status: next },
    );

    const student = await User.findById(app.studentId).select("_id").lean();
    if (student) {
      await notificationService.create({
        userId: app.studentId,
        title: "Application update",
        message: `Your application for "${job.title}" is now: ${status}.`,
        type: "application_update",
        priority: "medium",
        link: `/student/applications`,
        senderId: recruiterId,
      });
    }

    return { applicationId, status };
  }
}

export const recruiterApplicantService = new RecruiterApplicantService();
