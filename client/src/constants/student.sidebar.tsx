import {
  LayoutDashboard,
  Search,
  Star,
  FileText,
  Brain,
  TrendingUp,
  Kanban,
  Bell,
  Settings,
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
    to: "/student/notifications",
    label: "Notifications",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    to: "/student/settings",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
  },
];
