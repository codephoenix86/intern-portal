export const internships = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    company: "TechCorp",
    location: "Bangalore, India",
    type: "Remote",
    duration: "3 months",
    stipend: "₹15,000/month",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    description: "Join our dynamic frontend team to build modern web applications using React and TypeScript. You'll work on real-world projects and gain hands-on experience.",
    requirements: ["Knowledge of React.js", "Familiarity with TypeScript", "Understanding of responsive design", "Basic Git knowledge"],
    postedDate: "2 days ago",
    applicants: 45,
    matchScore: 92,
  },
  {
    id: "2",
    title: "Data Science Intern",
    company: "DataMinds",
    location: "Mumbai, India",
    type: "Hybrid",
    duration: "6 months",
    stipend: "₹20,000/month",
    skills: ["Python", "Machine Learning", "SQL"],
    description: "Work with our data science team on cutting-edge ML projects. Analyze large datasets and build predictive models.",
    requirements: ["Python proficiency", "Statistics knowledge", "ML fundamentals", "SQL basics"],
    postedDate: "1 day ago",
    applicants: 78,
    matchScore: 85,
  },
  {
    id: "3",
    title: "UI/UX Design Intern",
    company: "DesignHub",
    location: "Delhi, India",
    type: "On-site",
    duration: "4 months",
    stipend: "₹12,000/month",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    description: "Design beautiful user interfaces and create seamless user experiences for our mobile and web products.",
    requirements: ["Figma expertise", "UX research skills", "Portfolio of design work", "Communication skills"],
    postedDate: "3 days ago",
    applicants: 32,
    matchScore: 78,
  },
  {
    id: "4",
    title: "Backend Developer Intern",
    company: "CloudNine",
    location: "Hyderabad, India",
    type: "Remote",
    duration: "3 months",
    stipend: "₹18,000/month",
    skills: ["Node.js", "Express", "MongoDB"],
    description: "Build scalable backend services and APIs. Work with microservices architecture and cloud deployment.",
    requirements: ["Node.js experience", "REST API design", "Database knowledge", "Problem-solving skills"],
    postedDate: "5 days ago",
    applicants: 56,
    matchScore: 88,
  },
  {
    id: "5",
    title: "Mobile App Developer Intern",
    company: "AppFactory",
    location: "Pune, India",
    type: "Hybrid",
    duration: "6 months",
    stipend: "₹22,000/month",
    skills: ["React Native", "JavaScript", "Firebase"],
    description: "Develop cross-platform mobile applications using React Native. Ship features to thousands of users.",
    requirements: ["React Native knowledge", "JavaScript proficiency", "Mobile development interest", "App Store/Play Store understanding"],
    postedDate: "1 week ago",
    applicants: 41,
    matchScore: 81,
  },
  {
    id: "6",
    title: "DevOps Intern",
    company: "InfraStack",
    location: "Chennai, India",
    type: "Remote",
    duration: "4 months",
    stipend: "₹16,000/month",
    skills: ["Docker", "AWS", "CI/CD"],
    description: "Learn and implement DevOps practices. Set up CI/CD pipelines and manage cloud infrastructure.",
    requirements: ["Linux basics", "Docker familiarity", "Scripting skills", "Cloud platform awareness"],
    postedDate: "4 days ago",
    applicants: 29,
    matchScore: 74,
  },
];

export const applications = [
  { id: "1", internship: "Frontend Developer Intern", company: "TechCorp", status: "Applied", date: "2024-01-15", matchScore: 92 },
  { id: "2", internship: "Data Science Intern", company: "DataMinds", status: "Screening", date: "2024-01-12", matchScore: 85 },
  { id: "3", internship: "UI/UX Design Intern", company: "DesignHub", status: "Interview", date: "2024-01-10", matchScore: 78 },
  { id: "4", internship: "Backend Developer Intern", company: "CloudNine", status: "Offer", date: "2024-01-08", matchScore: 88 },
  { id: "5", internship: "Mobile App Developer Intern", company: "AppFactory", status: "Rejected", date: "2024-01-05", matchScore: 81 },
];

export const applicants = [
  { id: "1", name: "Aarav Sharma", email: "aarav@email.com", skills: ["React", "TypeScript", "Node.js"], matchScore: 95, skillMatch: 92, experienceMatch: 96, educationMatch: 98, status: "Shortlisted", appliedFor: "Frontend Developer Intern", resumeUrl: "#" },
  { id: "2", name: "Priya Patel", email: "priya@email.com", skills: ["Python", "ML", "TensorFlow"], matchScore: 88, skillMatch: 90, experienceMatch: 85, educationMatch: 90, status: "Interview", appliedFor: "Data Science Intern", resumeUrl: "#" },
  { id: "3", name: "Rohan Gupta", email: "rohan@email.com", skills: ["React", "JavaScript", "CSS"], matchScore: 82, skillMatch: 85, experienceMatch: 78, educationMatch: 84, status: "Pending", appliedFor: "Frontend Developer Intern", resumeUrl: "#" },
  { id: "4", name: "Sneha Reddy", email: "sneha@email.com", skills: ["Figma", "Sketch", "UX Research"], matchScore: 91, skillMatch: 94, experienceMatch: 88, educationMatch: 92, status: "Accepted", appliedFor: "UI/UX Design Intern", resumeUrl: "#" },
  { id: "5", name: "Vikram Singh", email: "vikram@email.com", skills: ["Node.js", "Express", "MongoDB"], matchScore: 76, skillMatch: 80, experienceMatch: 72, educationMatch: 76, status: "Rejected", appliedFor: "Backend Developer Intern", resumeUrl: "#" },
];

export const notifications = [
  { id: "1", message: "Your application for Frontend Developer Intern has been shortlisted!", time: "2 hours ago", read: false, type: "success" as const },
  { id: "2", message: "Recruiter from DataMinds scheduled an interview", time: "5 hours ago", read: false, type: "info" as const },
  { id: "3", message: "Your profile match score improved to 92%", time: "1 day ago", read: true, type: "success" as const },
  { id: "4", message: "New internship matching your skills posted by CloudNine", time: "2 days ago", read: true, type: "info" as const },
];

export const parsedResume = {
  name: "Aarav Sharma",
  email: "aarav.sharma@email.com",
  phone: "+91 98765 43210",
  education: [
    { degree: "B.Tech Computer Science", institution: "IIT Delhi", year: "2021-2025", gpa: "8.9/10" },
  ],
  skills: ["React.js", "TypeScript", "Node.js", "Python", "MongoDB", "Git", "Docker", "Tailwind CSS"],
  experience: [
    { title: "Web Development Intern", company: "StartupXYZ", duration: "May 2024 - July 2024" },
  ],
  projects: [
    { name: "E-Commerce Platform", tech: "React, Node.js, MongoDB" },
    { name: "Chat Application", tech: "Socket.io, Express, React" },
  ],
};

export const skillQuiz = [
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

export const roadmapTasks = [
  { id: "1", title: "Complete React Fundamentals", completed: true, category: "Frontend" },
  { id: "2", title: "Learn TypeScript Basics", completed: true, category: "Frontend" },
  { id: "3", title: "Master Tailwind CSS", completed: false, category: "Frontend" },
  { id: "4", title: "Build 3 Portfolio Projects", completed: false, category: "Projects" },
  { id: "5", title: "Learn Node.js & Express", completed: false, category: "Backend" },
  { id: "6", title: "Study Data Structures", completed: true, category: "DSA" },
  { id: "7", title: "Practice System Design", completed: false, category: "Interview Prep" },
  { id: "8", title: "Mock Interview Sessions", completed: false, category: "Interview Prep" },
];

export const recommendedCourses = [
  { id: "1", title: "Advanced React Patterns", provider: "Udemy", duration: "12 hours", level: "Advanced", url: "#" },
  { id: "2", title: "TypeScript Masterclass", provider: "Coursera", duration: "8 hours", level: "Intermediate", url: "#" },
  { id: "3", title: "System Design for Interviews", provider: "YouTube", duration: "6 hours", level: "Advanced", url: "#" },
  { id: "4", title: "Data Structures in JavaScript", provider: "freeCodeCamp", duration: "10 hours", level: "Intermediate", url: "#" },
];

export const dashboardStats = {
  student: {
    applicationsSubmitted: 12,
    interviewsScheduled: 3,
    profileViews: 48,
    matchScore: 85,
  },
  recruiter: {
    activeListings: 5,
    totalApplicants: 234,
    shortlisted: 28,
    interviewsScheduled: 12,
  },
};
