import {
  LayoutDashboard,
  PlusCircle,
  List,
  Users,
  Bell,
  Settings,
} from "lucide-react";
import type { RecruiterSidebarItem } from "@/types/recruiter.types";

export const RECRUITER_SIDEBAR_ITEMS: RecruiterSidebarItem[] = [
  {
    to: "/recruiter",
    label: "Overview",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    to: "/recruiter/post",
    label: "Post Internship",
    icon: <PlusCircle className="h-4 w-4" />,
  },
  {
    to: "/recruiter/listings",
    label: "My Listings",
    icon: <List className="h-4 w-4" />,
  },
  {
    to: "/recruiter/applicants",
    label: "Applicants",
    icon: <Users className="h-4 w-4" />,
  },
  {
    to: "/recruiter/notifications",
    label: "Notifications",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    to: "/recruiter/settings",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
  },
];
