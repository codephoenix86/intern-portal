import type { ReactNode } from "react";

export interface AppShellNavItem {
  to: string;
  label: string;
  icon: ReactNode;
  /** Exact match only (e.g. role dashboard home vs nested routes) */
  end?: boolean;
}

export interface AppShellNavSection {
  label: string;
  items: AppShellNavItem[];
}

export type AppShellRole = "student" | "recruiter" | "mentor";
