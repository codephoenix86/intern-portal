import type {
  Training,
  MentorClass,
  Student,
  Assignment,
  Message,
} from "@/types/mentor.types";

// ── Mock Data ────────────────────────────────────────────────
export const MOCK_TRAININGS: Training[] = [
  {
    id: 1,
    title: "Full Stack Development",
    level: "Intermediate",
    duration: "6 Weeks",
    skills: ["React", "Node.js"],
  },
  {
    id: 2,
    title: "DSA Bootcamp",
    level: "Beginner",
    duration: "4 Weeks",
    skills: ["Arrays", "Graphs"],
  },
  {
    id: 3,
    title: "Machine Learning Basics",
    level: "Advanced",
    duration: "8 Weeks",
    skills: ["Python", "ML"],
  },
];

export const MOCK_CLASSES: MentorClass[] = [
  { id: 1, topic: "Arrays & Strings", date: "Today", time: "6:00 PM" },
  { id: 2, topic: "Resume Workshop", date: "Tomorrow", time: "4:00 PM" },
  { id: 3, topic: "Mock Interview", date: "Sunday", time: "7:00 PM" },
];

export const MOCK_STUDENTS: Student[] = [
  { id: 1, name: "Aarav Sharma", skill: "React", progress: 92 },
  { id: 2, name: "Anjali Verma", skill: "DSA", progress: 88 },
  { id: 3, name: "Rohan Gupta", skill: "Python", progress: 84 },
  { id: 4, name: "Neha Singh", skill: "ML", progress: 76 },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 1,
    title: "React Mini Project",
    deadline: "3 Days Left",
    submissions: "18/28",
  },
  {
    id: 2,
    title: "DSA Sheet (50 Questions)",
    deadline: "1 Week Left",
    submissions: "32/40",
  },
  {
    id: 3,
    title: "Resume Upload Task",
    deadline: "2 Days Left",
    submissions: "14/16",
  },
];

export const MOCK_MESSAGES: Message[] = [
  { id: 1, student: "Rahul Sharma", msg: "Sir can you explain useEffect?" },
  { id: 2, student: "Anjali Verma", msg: "Please review my resume." },
  { id: 3, student: "Rohan Gupta", msg: "Mock interview schedule please." },
];
