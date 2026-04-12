import {
  Gauge,
  PenLine,
  LayoutList,
  UserSearch,
  Inbox,
  Wrench,
} from "lucide-react";
import type { AppShellNavSection } from "@/types/shell.types";
import { appIconNav } from "@/lib/app-icon-class";

const ic = appIconNav;

export const RECRUITER_SIDEBAR_SECTIONS: AppShellNavSection[] = [
  {
    label: "Workspace",
    items: [
      {
        to: "/recruiter",
        label: "Overview",
        icon: <Gauge className={ic()} />,
        end: true,
      },
    ],
  },
  {
    label: "Hiring",
    items: [
      {
        to: "/recruiter/post",
        label: "Post internship",
        icon: <PenLine className={ic()} />,
      },
      {
        to: "/recruiter/listings",
        label: "My listings",
        icon: <LayoutList className={ic()} />,
      },
      {
        to: "/recruiter/applicants",
        label: "Applicants",
        icon: <UserSearch className={ic()} />,
      },
    ],
  },
  {
    label: "Engage",
    items: [
      {
        to: "/recruiter/notifications",
        label: "Notifications",
        icon: <Inbox className={ic()} />,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        to: "/recruiter/settings",
        label: "Settings",
        icon: <Wrench className={ic()} />,
      },
    ],
  },
];

/** @deprecated Use RECRUITER_SIDEBAR_SECTIONS */
export const RECRUITER_SIDEBAR_ITEMS = RECRUITER_SIDEBAR_SECTIONS.flatMap(
  (s) => s.items,
);
