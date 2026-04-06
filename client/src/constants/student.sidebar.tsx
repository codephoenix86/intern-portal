import {
  LayoutDashboard,
  Search,
  Star,
  FileText,
  Brain,
  TrendingUp,
  Kanban,
  Settings,
  Video,
  User,
  Users,
  Building2,
  GraduationCap,
  BookOpen,
  Library,
} from "lucide-react";
import type { SidebarItem } from "@/types/student.types";

export const STUDENT_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    to: "/student",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    to: "/student/search",
    label: "Search Internships",
    icon: <Search className="h-4 w-4" />,
  },
  {
    to: "/student/recommended",
    label: "Recommended",
    icon: <Star className="h-4 w-4" />,
  },
  {
    to: "/student/resume",
    label: "Resume",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    to: "/student/skills",
    label: "Skill Evaluation",
    icon: <Brain className="h-4 w-4" />,
  },
  {
    to: "/student/roadmap",
    label: "Skill Roadmap",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    to: "/student/applications",
    label: "Applications",
    icon: <Kanban className="h-4 w-4" />,
  },
  {
    to: "/student/courses",
    label: "Courses",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    to: "/student/enrollments",
    label: "My courses",
    icon: <Library className="h-4 w-4" />,
  },
  {
    to: "/student/people/students",
    label: "Students",
    icon: <Users className="h-4 w-4" />,
  },
  {
    to: "/student/people/recruiters",
    label: "Recruiters",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    to: "/student/people/mentors",
    label: "Mentors",
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    to: "/student/sessions",
    label: "Live Sessions",
    icon: <Video className="h-4 w-4" />,
  },
  {
    to: "/student/profile",
    label: "Profile",
    icon: <User className="h-4 w-4" />,
  },
  {
    to: "/student/settings",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
  },
];
