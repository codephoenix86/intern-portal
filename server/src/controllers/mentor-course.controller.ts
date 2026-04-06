import type { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response.utils.js";
import { AppError } from "../services/auth.service.js";
import { mentorCourseService } from "../services/mentor-course.service.js";

function routeParam(
  value: string | string[] | undefined,
): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export const listMentorCourses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = await mentorCourseService.listMyCourses(req.user!.userId);
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Failed to list courses");
  }
};

export const createMentorCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = await mentorCourseService.createCourse(
      req.user!.userId,
      req.body,
    );
    sendSuccess(res, 201, "Created", data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error(error);
    sendError(res, 500, "Failed to create course");
  }
};

export const getMentorCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const courseId = routeParam(req.params["courseId"]);
    if (!courseId) {
      sendError(res, 400, "Course ID required");
      return;
    }
    const data = await mentorCourseService.getCourse(
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

export const updateMentorCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const courseId = routeParam(req.params["courseId"]);
    if (!courseId) {
      sendError(res, 400, "Course ID required");
      return;
    }
    const data = await mentorCourseService.updateCourse(
      req.user!.userId,
      courseId,
      req.body,
    );
    sendSuccess(res, 200, "Updated", data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error(error);
    sendError(res, 500, "Failed to update course");
  }
};

export const addMentorCourseModule = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const courseId = routeParam(req.params["courseId"]);
    if (!courseId) {
      sendError(res, 400, "Course ID required");
      return;
    }
    const data = await mentorCourseService.addModule(
      req.user!.userId,
      courseId,
      req.body,
    );
    sendSuccess(res, 201, "Module added", data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error(error);
    sendError(res, 500, "Failed to add module");
  }
};

export const updateMentorCourseModule = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const courseId = routeParam(req.params["courseId"]);
    const moduleId = routeParam(req.params["moduleId"]);
    if (!courseId || !moduleId) {
      sendError(res, 400, "Course ID and module ID required");
      return;
    }
    const data = await mentorCourseService.updateModule(
      req.user!.userId,
      courseId,
      moduleId,
      req.body,
    );
    sendSuccess(res, 200, "Updated", data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error(error);
    sendError(res, 500, "Failed to update module");
  }
};

export const uploadMentorModuleContent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const courseId = routeParam(req.params["courseId"]);
    const moduleId = routeParam(req.params["moduleId"]);
    if (!courseId || !moduleId) {
      sendError(res, 400, "Course ID and module ID required");
      return;
    }
    const file = req.file;
    if (!file) {
      sendError(res, 400, "File required (field name: file)");
      return;
    }
    const publicUrl = `/uploads/course-content/${file.filename}`;
    await mentorCourseService.setModuleContentUrlFromUpload(
      req.user!.userId,
      courseId,
      moduleId,
      publicUrl,
    );
    sendSuccess(res, 200, "Uploaded", { url: publicUrl, moduleId });
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error(error);
    sendError(res, 500, "Failed to upload");
  }
};

export const listMentorCourseStudents = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const courseId = routeParam(req.params["courseId"]);
    if (!courseId) {
      sendError(res, 400, "Course ID required");
      return;
    }
    const data = await mentorCourseService.listEnrolledStudents(
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
    sendError(res, 500, "Failed to list students");
  }
};
