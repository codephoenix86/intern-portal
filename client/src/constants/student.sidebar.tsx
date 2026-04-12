import {
  Gauge,
  ScanSearch,
  Compass,
  ListTodo,
  ScrollText,
  Layers2,
  BookmarkCheck,
  Radio,
  MapPinned,
  ClipboardCheck,
  UserRound,
  BriefcaseBusiness,
  Presentation,
  ContactRound,
  Wrench,
} from "lucide-react";
import type { AppShellNavSection } from "@/types/shell.types";
import { appIconNav } from "@/lib/app-icon-class";

const ic = appIconNav;

export const STUDENT_SIDEBAR_SECTIONS: AppShellNavSection[] = [
  {
    label: "Discover",
    items: [
      {
        to: "/student",
        label: "Dashboard",
        icon: <Gauge className={ic()} />,
        end: true,
      },
      {
        to: "/student/search",
        label: "Search internships",
        icon: <ScanSearch className={ic()} />,
      },
      {
        to: "/student/recommended",
        label: "Recommended",
        icon: <Compass className={ic()} />,
      },
    ],
  },
  {
    label: "Apply",
    items: [
      {
        to: "/student/applications",
        label: "Applications",
        icon: <ListTodo className={ic()} />,
      },
      {
        to: "/student/resume",
        label: "Resume",
        icon: <ScrollText className={ic()} />,
      },
    ],
  },
  {
    label: "Learn",
    items: [
      {
        to: "/student/courses",
        label: "Courses",
        icon: <Layers2 className={ic()} />,
      },
      {
        to: "/student/enrollments",
        label: "My courses",
        icon: <BookmarkCheck className={ic()} />,
      },
      {
        to: "/student/sessions",
        label: "Live sessions",
        icon: <Radio className={ic()} />,
      },
      {
        to: "/student/roadmap",
        label: "Skill roadmap",
        icon: <MapPinned className={ic()} />,
      },
    ],
  },
  {
    label: "Grow",
    items: [
      {
        to: "/student/skills",
        label: "Skill evaluation",
        icon: <ClipboardCheck className={ic()} />,
      },
    ],
  },
  {
    label: "Network",
    items: [
      {
        to: "/student/people/students",
        label: "Students",
        icon: <UserRound className={ic()} />,
      },
      {
        to: "/student/people/recruiters",
        label: "Recruiters",
        icon: <BriefcaseBusiness className={ic()} />,
      },
      {
        to: "/student/people/mentors",
        label: "Mentors",
        icon: <Presentation className={ic()} />,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        to: "/student/profile",
        label: "Profile",
        icon: <ContactRound className={ic()} />,
      },
      {
        to: "/student/settings",
        label: "Settings",
        icon: <Wrench className={ic()} />,
      },
    ],
  },
];

/** @deprecated Use STUDENT_SIDEBAR_SECTIONS — flat list for legacy imports */
export const STUDENT_SIDEBAR_ITEMS = STUDENT_SIDEBAR_SECTIONS.flatMap(
  (s) => s.items,
);
