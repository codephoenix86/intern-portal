import type { JobWorkType } from "../models/job.model.js";

export interface InternshipSeed {
  title: string;
  company: string;
  location: string;
  workType: JobWorkType;
  duration: string;
  stipend: string;
  skills: string[];
  description: string;
  requirements: string[];
}

export const INTERNSHIP_SEEDS: InternshipSeed[] = [
  {
    title: "Frontend Developer Intern",
    company: "TechCorp",
    location: "Bangalore, India",
    workType: "Remote",
    duration: "3 months",
    stipend: "₹15,000/month",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    description:
      "Join our dynamic frontend team to build modern web applications using React and TypeScript. You'll work on real-world projects and gain hands-on experience.",
    requirements: [
      "Knowledge of React.js",
      "Familiarity with TypeScript",
      "Understanding of responsive design",
      "Basic Git knowledge",
    ],
  },
  {
    title: "Data Science Intern",
    company: "DataMinds",
    location: "Mumbai, India",
    workType: "Hybrid",
    duration: "6 months",
    stipend: "₹20,000/month",
    skills: ["Python", "Machine Learning", "SQL"],
    description:
      "Work with our data science team on cutting-edge ML projects. Analyze large datasets and build predictive models.",
    requirements: [
      "Python proficiency",
      "Statistics knowledge",
      "ML fundamentals",
      "SQL basics",
    ],
  },
  {
    title: "UI/UX Design Intern",
    company: "DesignHub",
    location: "Delhi, India",
    workType: "On-site",
    duration: "4 months",
    stipend: "₹12,000/month",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    description:
      "Design beautiful user interfaces and create seamless user experiences for our mobile and web products.",
    requirements: [
      "Figma expertise",
      "UX research skills",
      "Portfolio of design work",
      "Communication skills",
    ],
  },
  {
    title: "Backend Developer Intern",
    company: "CloudNine",
    location: "Hyderabad, India",
    workType: "Remote",
    duration: "3 months",
    stipend: "₹18,000/month",
    skills: ["Node.js", "Express", "MongoDB"],
    description:
      "Build scalable backend services and APIs. Work with microservices architecture and cloud deployment.",
    requirements: [
      "Node.js experience",
      "REST API design",
      "Database knowledge",
      "Problem-solving skills",
    ],
  },
  {
    title: "Mobile App Developer Intern",
    company: "AppFactory",
    location: "Pune, India",
    workType: "Hybrid",
    duration: "6 months",
    stipend: "₹22,000/month",
    skills: ["React Native", "JavaScript", "Firebase"],
    description:
      "Develop cross-platform mobile applications using React Native. Ship features to thousands of users.",
    requirements: [
      "React Native knowledge",
      "JavaScript proficiency",
      "Mobile development interest",
      "App Store/Play Store understanding",
    ],
  },
  {
    title: "DevOps Intern",
    company: "InfraStack",
    location: "Chennai, India",
    workType: "Remote",
    duration: "4 months",
    stipend: "₹16,000/month",
    skills: ["Docker", "AWS", "CI/CD"],
    description:
      "Learn and implement DevOps practices. Set up CI/CD pipelines and manage cloud infrastructure.",
    requirements: [
      "Linux basics",
      "Docker familiarity",
      "Scripting skills",
      "Cloud platform awareness",
    ],
  },
];
