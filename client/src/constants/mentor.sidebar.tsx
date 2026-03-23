import {
  LayoutDashboard,
  BookOpen,
  Video,
  Users,
  ClipboardList,
  TrendingUp,
  MessageSquare,
  Settings,
} from "lucide-react";
import { SIDEBAR_ROUTES } from "./mentor.constant";
import type { SidebarItem } from "@/types/mentor.types";

// Icons mapped by route order
const SIDEBAR_ICONS = [
  <LayoutDashboard className="h-4 w-4" />,
  <BookOpen className="h-4 w-4" />,
  <Video className="h-4 w-4" />,
  <Users className="h-4 w-4" />,
  <ClipboardList className="h-4 w-4" />,
  <TrendingUp className="h-4 w-4" />,
  <MessageSquare className="h-4 w-4" />,
  <Settings className="h-4 w-4" />,
];

// Combine routes + icons
export const SIDEBAR_ITEMS: SidebarItem[] = SIDEBAR_ROUTES.map(
  (route, idx) => ({
    ...route,
    icon: SIDEBAR_ICONS[idx],
  }),
);
