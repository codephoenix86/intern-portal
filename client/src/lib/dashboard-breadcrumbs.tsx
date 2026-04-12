import { Link } from "react-router-dom";
import type { ReactElement } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { AppShellRole } from "@/types/shell.types";

const ROLE_HOME: Record<AppShellRole, { to: string; label: string }> = {
  student: { to: "/student", label: "Student" },
  recruiter: { to: "/recruiter", label: "Company" },
  mentor: { to: "/mentor", label: "Instructor" },
};

const PATH_LABELS: Record<string, string> = {
  "/student": "Dashboard",
  "/student/search": "Search internships",
  "/student/recommended": "Recommended",
  "/student/sessions": "Live sessions",
  "/student/resume": "Resume",
  "/student/skills": "Skill evaluation",
  "/student/roadmap": "Skill roadmap",
  "/student/applications": "Applications",
  "/student/courses": "Courses",
  "/student/enrollments": "My courses",
  "/student/people/students": "Students",
  "/student/people/recruiters": "Recruiters",
  "/student/people/mentors": "Mentors",
  "/student/profile": "Profile",
  "/student/settings": "Settings",
  "/recruiter": "Overview",
  "/recruiter/post": "Post internship",
  "/recruiter/listings": "My listings",
  "/recruiter/applicants": "Applicants",
  "/recruiter/notifications": "Notifications",
  "/recruiter/settings": "Settings",
  "/mentor": "Dashboard",
  "/mentor/courses": "Courses",
  "/mentor/courses/new": "New course",
  "/mentor/trainings": "Skill trainings",
  "/mentor/classes": "Classes",
  "/mentor/students": "Students",
  "/mentor/assignments": "Assignments",
  "/mentor/progress": "Progress",
  "/mentor/messages": "Messages",
  "/mentor/settings": "Settings",
};

function labelForPath(pathname: string): string {
  const normalized = pathname.replace(/\/$/, "") || "/";
  const parts = normalized.split("/").filter(Boolean);

  if (
    parts[parts.length - 1] === "students" &&
    parts[parts.length - 2] === "courses"
  ) {
    return "Enrolled students";
  }

  const exact = PATH_LABELS[normalized];
  if (exact) return exact;

  const candidates = Object.keys(PATH_LABELS).sort((a, b) => b.length - a.length);
  for (const p of candidates) {
    const key = p.replace(/\/$/, "") || "/";
    if (normalized.startsWith(`${key}/`)) {
      return PATH_LABELS[p] ?? "Page";
    }
  }

  if (parts.includes("courses") && parts.length >= 3) {
    return "Course";
  }

  return "Page";
}

export function DashboardBreadcrumbNav({
  pathname,
  role,
}: {
  pathname: string;
  role: AppShellRole;
}): ReactElement | null {
  const normalized = pathname.replace(/\/$/, "") || "/";
  const home = ROLE_HOME[role];
  if (normalized === home.to) {
    return null;
  }

  const currentLabel = labelForPath(normalized);

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-xs sm:text-sm">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={home.to}>{home.label}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="max-w-[220px] truncate">
            {currentLabel}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
