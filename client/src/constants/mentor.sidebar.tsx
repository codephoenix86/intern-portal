import {
  Gauge,
  NotebookPen,
  Dumbbell,
  MonitorPlay,
  NotebookTabs,
  LineChart,
  UsersRound,
  MessagesSquare,
  Wrench,
} from "lucide-react";
import type { AppShellNavSection } from "@/types/shell.types";
import type { SidebarItem } from "@/types/mentor.types";
import { appIconNav } from "@/lib/app-icon-class";

const ic = appIconNav;

export const MENTOR_SIDEBAR_SECTIONS: AppShellNavSection[] = [
  {
    label: "Overview",
    items: [
      {
        to: "/mentor",
        label: "Dashboard",
        icon: <Gauge className={ic()} />,
        end: true,
      },
    ],
  },
  {
    label: "Courses",
    items: [
      {
        to: "/mentor/courses",
        label: "My courses",
        icon: <NotebookPen className={ic()} />,
      },
    ],
  },
  {
    label: "Delivery",
    items: [
      {
        to: "/mentor/trainings",
        label: "Skill trainings",
        icon: <Dumbbell className={ic()} />,
      },
      {
        to: "/mentor/classes",
        label: "Classes",
        icon: <MonitorPlay className={ic()} />,
      },
      {
        to: "/mentor/assignments",
        label: "Assignments",
        icon: <NotebookTabs className={ic()} />,
      },
      {
        to: "/mentor/progress",
        label: "Progress",
        icon: <LineChart className={ic()} />,
      },
    ],
  },
  {
    label: "People",
    items: [
      {
        to: "/mentor/students",
        label: "Students",
        icon: <UsersRound className={ic()} />,
      },
    ],
  },
  {
    label: "Engage",
    items: [
      {
        to: "/mentor/messages",
        label: "Messages",
        icon: <MessagesSquare className={ic()} />,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        to: "/mentor/settings",
        label: "Settings",
        icon: <Wrench className={ic()} />,
      },
    ],
  },
];

/** @deprecated Use MENTOR_SIDEBAR_SECTIONS */
export const SIDEBAR_ITEMS: SidebarItem[] = MENTOR_SIDEBAR_SECTIONS.flatMap(
  (s) => s.items,
);
