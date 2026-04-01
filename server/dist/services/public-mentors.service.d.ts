export type PublicMentorCard = {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
    expertise: string[];
    profileCompletion: number;
    updatedAt: Date;
};
export type PublicMentorCourse = {
    id: string;
    title: string;
    shortDescription: string;
    level: string;
    duration: string;
    skills: string[];
    category: string;
    enrollmentCount: number;
    averageRating: number;
    isFree: boolean;
    slug: string;
};
export type PublicMentorSession = {
    id: string;
    topic: string;
    description: string;
    date: string;
    time: string;
    duration: number;
    type: string;
    status: string;
    maxAttendees: number;
    attendeeCount: number;
};
export type PublicMentorProfile = PublicMentorCard & {
    courses: PublicMentorCourse[];
    upcomingSessions: PublicMentorSession[];
};
declare class PublicMentorsService {
    /**
     * List all public mentor cards with pagination, search & sorting.
     */
    list(input: {
        page: number;
        limit: number;
        q?: string;
        expertise?: string[];
        sort: "updatedAt" | "name" | "profileCompletion";
        order: "asc" | "desc";
    }): Promise<{
        items: PublicMentorCard[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    /**
     * Fetch a single public mentor profile with courses & upcoming sessions.
     */
    getById(mentorId: string): Promise<{
        mentor: PublicMentorProfile;
    } | null>;
}
export declare const publicMentorsService: PublicMentorsService;
export {};
//# sourceMappingURL=public-mentors.service.d.ts.map