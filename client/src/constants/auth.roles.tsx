import { GraduationCap, Briefcase, BookOpen } from "lucide-react";
import type { RoleOption } from "@/types/auth.types";

export const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "student",
    label: "Student",
    description: "Find internships",
    icon: <GraduationCap className="h-6 w-6" />,
  },
  {
    value: "recruiter",
    label: "Recruiter",
    description: "Hire talent",
    icon: <Briefcase className="h-6 w-6" />,
  },
  {
    value: "mentor",
    label: "Mentor",
    description: "Train students",
    icon: <BookOpen className="h-6 w-6" />,
  },
];
