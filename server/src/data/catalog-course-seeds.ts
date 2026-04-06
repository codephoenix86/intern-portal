/**
 * Minimal published courses used when the DB has no published catalog entries
 * but at least one mentor exists. `mentorId` is set at seed time.
 */
export const CATALOG_COURSE_SEED_TEMPLATES = [
  {
    title: "Full-Stack Web Development Fundamentals",
    description:
      "Learn HTML, CSS, JavaScript, React, and Node.js with small projects. Designed for students preparing for internships.",
    shortDescription: "End-to-end web basics with hands-on practice.",
    level: "Beginner" as const,
    duration: "6 Weeks",
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    category: "Web Development",
    modules: [
      {
        title: "Module 1: Web foundations",
        description: "How the web works; HTML/CSS essentials.",
        contentUrl: null,
        contentType: "video" as const,
        duration: "45 min",
        order: 0,
        isFree: true,
      },
      {
        title: "Module 2: JavaScript & APIs",
        description: "Async JS, fetch, REST basics.",
        contentUrl: null,
        contentType: "video" as const,
        duration: "60 min",
        order: 1,
        isFree: false,
      },
    ],
    thumbnailUrl: null,
    previewVideoUrl: null,
    pricing: {
      amount: 0,
      currency: "INR" as const,
      discountPercent: 0,
      discountedAmount: 0,
    },
    enrollmentCount: 0,
    completionCount: 0,
    averageRating: 0,
    totalRatings: 0,
  },
  {
    title: "Data Structures & Algorithms for Interviews",
    description:
      "Core DSA patterns, complexity, and problem-solving practice for coding rounds and OA platforms.",
    shortDescription: "Interview-focused DSA patterns and practice.",
    level: "Intermediate" as const,
    duration: "8 Weeks",
    skills: ["Python", "C++", "Algorithms", "Problem Solving"],
    category: "Computer Science",
    modules: [
      {
        title: "Module 1: Arrays & Hashing",
        description: "Two pointers, prefix sums, frequency maps.",
        contentUrl: null,
        contentType: "notes" as const,
        duration: "50 min",
        order: 0,
        isFree: true,
      },
      {
        title: "Module 2: Trees & Graphs",
        description: "BFS/DFS, shortest paths basics.",
        contentUrl: null,
        contentType: "video" as const,
        duration: "55 min",
        order: 1,
        isFree: false,
      },
    ],
    thumbnailUrl: null,
    previewVideoUrl: null,
    pricing: {
      amount: 499,
      currency: "INR" as const,
      discountPercent: 0,
      discountedAmount: 499,
    },
    enrollmentCount: 0,
    completionCount: 0,
    averageRating: 0,
    totalRatings: 0,
  },
];
