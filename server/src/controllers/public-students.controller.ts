import type { Request, Response } from "express";
import type { z } from "zod";
import { sendError, sendSuccess } from "../utils/response.utils.js";
import {
  publicStudentParamsSchema,
  publicStudentsListQuerySchema,
} from "../validators/public-students.validator.js";
import { publicStudentsService } from "../services/public-students.service.js";

export const listPublicStudents = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = publicStudentsListQuerySchema.safeParse(req.query);
    type PublicStudentsListQuery = z.infer<typeof publicStudentsListQuerySchema>;
    const raw: PublicStudentsListQuery = parsed.success
      ? parsed.data
      : {
          page: 1,
          limit: 20,
          skills: undefined,
          sort: "updatedAt",
          order: "desc",
        };

    const query = {
      page: raw.page,
      limit: raw.limit,
      sort: raw.sort,
      order: raw.order,
      ...(raw.q ? { q: raw.q } : {}),
      ...(raw.college ? { college: raw.college } : {}),
      ...(raw.branch ? { branch: raw.branch } : {}),
      ...(raw.location ? { location: raw.location } : {}),
      ...(raw.skills && raw.skills.length > 0 ? { skills: raw.skills } : {}),
    };

    const data = await publicStudentsService.list(query);
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    console.error("List public students error:", error);
    sendError(res, 500, "Failed to list students");
  }
};

export const getPublicStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = publicStudentParamsSchema.safeParse(req.params);
    if (!parsed.success) {
      sendError(res, 400, "Invalid student id", parsed.error.flatten().fieldErrors);
      return;
    }

    const data = await publicStudentsService.getById(parsed.data.studentId);
    if (!data) {
      sendError(res, 404, "Student not found");
      return;
    }

    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    console.error("Get public student error:", error);
    sendError(res, 500, "Failed to load student");
  }
};

