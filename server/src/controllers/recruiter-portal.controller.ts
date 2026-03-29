import type { Request, Response } from "express";
import { recruiterDashboardService } from "../services/recruiter-dashboard.service.js";
import {
  recruiterJobService,
  type RecruiterJobUpdateInput,
} from "../services/recruiter-job.service.js";
import { recruiterApplicantService } from "../services/recruiter-applicant.service.js";
import { recruiterProfileService } from "../services/recruiter-profile.service.js";
import { notificationService } from "../services/notification.service.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";
import { AppError } from "../services/auth.service.js";
import { formatRelativeTime } from "../utils/time.utils.js";
import {
  createRecruiterJobSchema,
  updateRecruiterJobSchema,
  patchRecruiterApplicationSchema,
  recruiterProfilePatchSchema,
  applicantsQuerySchema,
} from "../validators/recruiter.validator.js";

function routeParam(
  value: string | string[] | undefined,
): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

const successUiTypes = new Set([
  "application_update",
  "interview_scheduled",
  "certificate_issued",
  "course_enrolled",
  "new_applicant",
]);

function mapNotification(n: {
  _id: { toString: () => string };
  title: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: Date;
}) {
  return {
    id: n._id.toString(),
    message: n.title ? `${n.title}: ${n.message}` : n.message,
    time: formatRelativeTime(n.createdAt),
    read: n.read,
    type: successUiTypes.has(n.type)
      ? ("success" as const)
      : ("info" as const),
  };
}

export const getDashboard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = await recruiterDashboardService.getDashboard(req.user!.userId);
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Failed to load dashboard");
  }
};

export const listJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await recruiterJobService.listJobs(req.user!.userId);
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Failed to list listings");
  }
};

export const getJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobId = routeParam(req.params["jobId"]);
    if (!jobId) {
      sendError(res, 400, "Job ID required");
      return;
    }
    const data = await recruiterJobService.getJob(req.user!.userId, jobId);
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error(error);
    sendError(res, 500, "Failed to load listing");
  }
};

export const postJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createRecruiterJobSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, "Invalid body", parsed.error.flatten().fieldErrors);
      return;
    }
    const { requirements, ...rest } = parsed.data;
    const payload = {
      ...rest,
      ...(requirements !== undefined ? { requirements } : {}),
    };
    const data = await recruiterJobService.createJob(req.user!.userId, payload);
    sendSuccess(res, 201, "Internship published", data);
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Failed to create listing");
  }
};

export const patchJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobId = routeParam(req.params["jobId"]);
    if (!jobId) {
      sendError(res, 400, "Job ID required");
      return;
    }
    const parsed = updateRecruiterJobSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, "Invalid body", parsed.error.flatten().fieldErrors);
      return;
    }
    if (Object.keys(parsed.data).length === 0) {
      sendError(res, 400, "No fields to update");
      return;
    }
    const patch = Object.fromEntries(
      Object.entries(parsed.data).filter(([, v]) => v !== undefined),
    ) as RecruiterJobUpdateInput;
    const data = await recruiterJobService.updateJob(
      req.user!.userId,
      jobId,
      patch,
    );
    sendSuccess(res, 200, "Listing updated", data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error(error);
    sendError(res, 500, "Failed to update listing");
  }
};

export const closeJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobId = routeParam(req.params["jobId"]);
    if (!jobId) {
      sendError(res, 400, "Job ID required");
      return;
    }
    const data = await recruiterJobService.closeJob(req.user!.userId, jobId);
    sendSuccess(res, 200, "Listing closed", data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error(error);
    sendError(res, 500, "Failed to close listing");
  }
};

export const listApplicants = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = applicantsQuerySchema.safeParse(req.query);
    const filters =
      parsed.success && parsed.data.status !== undefined
        ? { status: parsed.data.status }
        : {};
    const data = await recruiterApplicantService.listApplicants(
      req.user!.userId,
      filters,
    );
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Failed to list applicants");
  }
};

export const patchApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const applicationId = routeParam(req.params["applicationId"]);
    if (!applicationId) {
      sendError(res, 400, "Application ID required");
      return;
    }
    const parsed = patchRecruiterApplicationSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, "Invalid body", parsed.error.flatten().fieldErrors);
      return;
    }
    const data = await recruiterApplicantService.updateApplicationStatus(
      req.user!.userId,
      applicationId,
      parsed.data.status,
    );
    sendSuccess(res, 200, "Application updated", data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error(error);
    sendError(res, 500, "Failed to update application");
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await recruiterProfileService.getProfile(req.user!.userId);
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error(error);
    sendError(res, 500, "Failed to load profile");
  }
};

export const patchProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = recruiterProfilePatchSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, "Invalid body", parsed.error.flatten().fieldErrors);
      return;
    }
    if (Object.keys(parsed.data).length === 0) {
      sendError(res, 400, "No fields to update");
      return;
    }
    const profilePatch = Object.fromEntries(
      Object.entries(parsed.data).filter(([, v]) => v !== undefined),
    ) as {
      companyName?: string;
      companyEmail?: string | null;
    };
    const data = await recruiterProfileService.patchProfile(
      req.user!.userId,
      profilePatch,
    );
    sendSuccess(res, 200, "Profile updated", data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error(error);
    sendError(res, 500, "Failed to update profile");
  }
};

export const listNotifications = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = Number(req.query["page"]) || 1;
    const limit = Number(req.query["limit"]) || 20;
    const result = await notificationService.getByUserId(
      req.user!.userId,
      page,
      limit,
      false,
    );
    const notifications = result.notifications.map((n) =>
      mapNotification(
        n as unknown as {
          _id: { toString: () => string };
          title: string;
          message: string;
          read: boolean;
          type: string;
          createdAt: Date;
        },
      ),
    );
    sendSuccess(res, 200, "OK", {
      notifications,
      total: result.total,
      unreadCount: result.unreadCount,
      page: result.page,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Failed to load notifications");
  }
};

export const markNotificationRead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = routeParam(req.params["id"]);
    if (!id) {
      sendError(res, 400, "id required");
      return;
    }
    await notificationService.markAsRead(id, req.user!.userId);
    sendSuccess(res, 200, "Marked as read");
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Failed to update notification");
  }
};

export const markAllNotificationsRead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await notificationService.markAllAsRead(req.user!.userId);
    sendSuccess(res, 200, "All marked as read");
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Failed to update notifications");
  }
};
