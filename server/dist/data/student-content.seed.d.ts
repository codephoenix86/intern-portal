export declare const SEED_QUIZ: {
    id: number;
    question: string;
    options: string[];
    correct: number;
}[];
export type SkillQuestionType = "concept" | "code" | "debug" | "scenario";
export interface SkillQuestionSeed {
    id: number;
    question: string;
    options: string[];
    correct: number;
    tags: string[];
    type: SkillQuestionType;
}
export declare const SKILL_QUESTION_BANK: SkillQuestionSeed[];
export declare const DEFAULT_ROADMAP_TASKS: {
    id: string;
    title: string;
    completed: boolean;
    category: string;
}[];
export declare const RECOMMENDED_COURSES: {
    id: number;
    title: string;
    provider: string;
    duration: string;
    level: string;
    url: string;
    tags: string[];
}[];
export declare const TRENDING_ROADMAP_FIELDS: string[];
export declare const ROADMAP_FIELD_TEMPLATES: Record<string, Array<{
    title: string;
    category: string;
}>>;
//# sourceMappingURL=student-content.seed.d.ts.map