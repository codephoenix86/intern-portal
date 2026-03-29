import { User } from "../models/user.model.js";
import { AppError } from "./auth.service.js";
import {
  SEED_QUIZ,
  DEFAULT_ROADMAP_TASKS,
  RECOMMENDED_COURSES,
} from "../data/student-content.seed.js";

class StudentContentService {
  getQuiz() {
    return { questions: SEED_QUIZ };
  }

  getCourses() {
    return { courses: RECOMMENDED_COURSES };
  }

  async getRoadmap(studentId: string) {
    const user = await User.findById(studentId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (!user.roadmapTasks || user.roadmapTasks.length === 0) {
      user.roadmapTasks = DEFAULT_ROADMAP_TASKS.map((t) => ({ ...t }));
      await user.save();
    }

    return {
      tasks: user.roadmapTasks.map((t) => ({
        id: Number.parseInt(t.id, 10) || t.id,
        title: t.title,
        category: t.category,
        completed: t.completed,
      })),
    };
  }

  async toggleRoadmapTask(studentId: string, taskId: string) {
    const user = await User.findById(studentId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (!user.roadmapTasks || user.roadmapTasks.length === 0) {
      user.roadmapTasks = DEFAULT_ROADMAP_TASKS.map((t) => ({ ...t }));
    }

    const task = user.roadmapTasks.find((t) => t.id === taskId);
    if (!task) {
      throw new AppError(404, "Task not found");
    }
    task.completed = !task.completed;
    await user.save();

    return this.getRoadmap(studentId);
  }
}

export const studentContentService = new StudentContentService();
