import type { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response.utils.js";
import { AppError } from "../services/auth.service.js";
import { studentCourseService } from "../services/student-course.service.js";
import { catalogCourseListQuerySchema } from "../validators/student.validator.js";

function routeParam(
  value: string | string[] | undefined,
): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export const listCatalogCourses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = catalogCourseListQuerySchema.safeParse(req.query);
    const q = parsed.success
      ? parsed.data
      : { keyword: undefined, category: undefined, page: 1, limit: 20 };

    const data = await studentCourseService.listCatalog(req.user!.userId, q);
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Failed to load courses");
  }
};

export const getCatalogCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const courseId = routeParam(req.params["courseId"]);
    if (!courseId) {
      sendError(res, 400, "Course ID required");
      return;
    }
    const data = await studentCourseService.getCatalogCourse(
      req.user!.userId,
      courseId,
    );
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error(error);
    sendError(res, 500, "Failed to load course");
  }
};

export const enrollCatalogCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const courseId = routeParam(req.params["courseId"]);
    if (!courseId) {
      sendError(res, 400, "Course ID required");
      return;
    }
    const data = await studentCourseService.enroll(
      req.user!.userId,
      courseId,
    );
    sendSuccess(res, 201, "Enrolled", data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error(error);
    sendError(res, 500, "Failed to enroll");
  }
};

export const unenrollCatalogCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const courseId = routeParam(req.params["courseId"]);
    if (!courseId) {
      sendError(res, 400, "Course ID required");
      return;
    }
    await studentCourseService.dropEnrollment(req.user!.userId, courseId);
    sendSuccess(res, 200, "Left course");
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error(error);
    sendError(res, 500, "Failed to leave course");
  }
};

export const listMyEnrollments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = await studentCourseService.listMyEnrollments(
      req.user!.userId,
    );
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Failed to load enrollments");
  }
};
