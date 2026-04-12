import { Backpack, BriefcaseBusiness, LampDesk } from "lucide-react";
import type { RoleOption } from "@/types/auth.types";
import { appIconLg } from "@/lib/app-icon-class";

const ic = appIconLg;

export const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "student",
    label: "Student",
    description: "Find internships",
    icon: <Backpack className={ic()} />,
  },
  {
    value: "recruiter",
    label: "Recruiter",
    description: "Hire talent",
    icon: <BriefcaseBusiness className={ic()} />,
  },
  {
    value: "mentor",
    label: "Mentor",
    description: "Train students",
    icon: <LampDesk className={ic()} />,
  },
];
