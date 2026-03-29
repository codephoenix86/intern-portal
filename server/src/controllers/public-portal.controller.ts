import type { Request, Response } from "express";
import { studentInternshipService } from "../services/student-internship.service.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";
import { AppError } from "../services/auth.service.js";
import { jobListQuerySchema } from "../validators/student.validator.js";

function routeParam(
  value: string | string[] | undefined,
): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export const listPublicJobs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = jobListQuerySchema.safeParse(req.query);
    const f = parsed.success
      ? parsed.data
      : {
          sort: "newest" as const,
          keyword: undefined,
          location: undefined,
          skills: undefined,
        };
    const listFilters: {
      keyword?: string;
      location?: string;
      skills?: string[];
      sort: "newest" | "match";
    } = { sort: f.sort };
    if (f.keyword !== undefined) listFilters.keyword = f.keyword;
    if (f.location !== undefined) listFilters.location = f.location;
    if (f.skills !== undefined) listFilters.skills = f.skills;
    const data = await studentInternshipService.listPublicJobs(listFilters);
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Failed to list internships");
  }
};

export const getPublicJob = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const jobId = routeParam(req.params["jobId"]);
    if (!jobId) {
      sendError(res, 400, "Job ID required");
      return;
    }
    const data = await studentInternshipService.getPublicJobById(jobId);
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error(error);
    sendError(res, 500, "Failed to load internship");
  }
};
