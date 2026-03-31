import { type SkillQuestionType } from "../data/student-content.seed.js";
declare class StudentContentService {
    getQuiz(skill: string | undefined, requestedCount: number | undefined): {
        questions: {
            id: number;
            question: string;
            options: string[];
            correct: number;
            type: SkillQuestionType;
        }[];
    };
    getCourses(fieldsInput?: string[]): {
        courses: {
            id: number;
            title: string;
            provider: string;
            duration: string;
            level: string;
            url: string;
            tags: string[];
        }[];
    };
    private normalizeField;
    private resolveFieldName;
    private genericTemplate;
    private buildTasksForFields;
    private fieldsChanged;
    getRoadmap(studentId: string, fieldsInput?: string[]): Promise<{
        availableFields: string[];
        selectedFields: string[];
        tasks: {
            id: string;
            title: string;
            category: string;
            completed: boolean;
        }[];
        summary: {
            total: number;
            completed: number;
            remaining: number;
            nextTask: string | null;
        };
    }>;
    toggleRoadmapTask(studentId: string, taskId: string): Promise<{
        availableFields: string[];
        selectedFields: string[];
        tasks: {
            id: string;
            title: string;
            category: string;
            completed: boolean;
        }[];
        summary: {
            total: number;
            completed: number;
            remaining: number;
            nextTask: string | null;
        };
    }>;
}
export declare const studentContentService: StudentContentService;
export {};
//# sourceMappingURL=student-content.service.d.ts.map