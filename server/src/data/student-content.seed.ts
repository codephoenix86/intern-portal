export const SEED_QUIZ = [
  {
    id: 1,
    question: "What hook is used for side effects in React?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correct: 1,
  },
  {
    id: 2,
    question: "Which CSS property is used for Flexbox layout?",
    options: ["display: block", "display: flex", "display: grid", "display: inline"],
    correct: 1,
  },
  {
    id: 3,
    question: "What does TypeScript add to JavaScript?",
    options: ["Runtime performance", "Static typing", "Database support", "Server rendering"],
    correct: 1,
  },
  {
    id: 4,
    question: "Which is NOT a valid React component lifecycle?",
    options: ["Mounting", "Updating", "Unmounting", "Compiling"],
    correct: 3,
  },
  {
    id: 5,
    question: "What is the purpose of useMemo in React?",
    options: ["State management", "Side effects", "Memoization", "Routing"],
    correct: 2,
  },
];

export const DEFAULT_ROADMAP_TASKS = [
  { id: "1", title: "Complete React Fundamentals", completed: false, category: "Frontend" },
  { id: "2", title: "Learn TypeScript Basics", completed: false, category: "Frontend" },
  { id: "3", title: "Master Tailwind CSS", completed: false, category: "Frontend" },
  { id: "4", title: "Build 3 Portfolio Projects", completed: false, category: "Projects" },
  { id: "5", title: "Learn Node.js & Express", completed: false, category: "Backend" },
  { id: "6", title: "Study Data Structures", completed: false, category: "DSA" },
  { id: "7", title: "Practice System Design", completed: false, category: "Interview Prep" },
  { id: "8", title: "Mock Interview Sessions", completed: false, category: "Interview Prep" },
];

export const RECOMMENDED_COURSES = [
  {
    id: 1,
    title: "Advanced React Patterns",
    provider: "Udemy",
    duration: "12 hours",
    level: "Advanced",
    url: "https://www.udemy.com",
  },
  {
    id: 2,
    title: "TypeScript Masterclass",
    provider: "Coursera",
    duration: "8 hours",
    level: "Intermediate",
    url: "https://www.coursera.org",
  },
  {
    id: 3,
    title: "System Design for Interviews",
    provider: "YouTube",
    duration: "6 hours",
    level: "Advanced",
    url: "https://www.youtube.com",
  },
  {
    id: 4,
    title: "Data Structures in JavaScript",
    provider: "freeCodeCamp",
    duration: "10 hours",
    level: "Intermediate",
    url: "https://www.freecodecamp.org",
  },
];
