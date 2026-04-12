import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";
import type { AppShellNavSection } from "@/types/shell.types";
import type { AppShellRole } from "@/types/shell.types";

interface DashboardLayoutProps {
  children: ReactNode;
  sections: AppShellNavSection[];
  role: AppShellRole;
  title: string;
  breadcrumbs?: ReactNode;
  headerRight?: ReactNode;
}

const DashboardLayout = ({
  children,
  sections,
  role,
  title,
  breadcrumbs,
  headerRight,
}: DashboardLayoutProps) => (
  <AppShell
    sections={sections}
    role={role}
    title={title}
    breadcrumbs={breadcrumbs}
    headerRight={headerRight}
  >
    {children}
  </AppShell>
);

export default DashboardLayout;
