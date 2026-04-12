import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { DashboardBreadcrumbNav } from "@/lib/dashboard-breadcrumbs";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import AppShellSidebar from "@/components/AppShellSidebar";
import { findBestNavMatch } from "@/lib/nav-active";
import type { AppShellNavSection, AppShellRole } from "@/types/shell.types";
import { APP_DISPLAY_NAME } from "@/constants/brand";

interface AppShellProps {
  children: ReactNode;
  sections: AppShellNavSection[];
  role: AppShellRole;
  title: string;
  breadcrumbs?: ReactNode;
  headerRight?: ReactNode;
}

const roleLabels: Record<AppShellRole, string> = {
  student: "Student",
  recruiter: "Company",
  mentor: "Instructor",
};

const AppShell = ({
  children,
  sections,
  role,
  title,
  breadcrumbs,
  headerRight,
}: AppShellProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const flatItems = sections.flatMap((s) => s.items);
  const activeTo = findBestNavMatch(location.pathname, flatItems);

  return (
    <div className="flex min-h-screen bg-background">
      <AppShellSidebar sections={sections} role={role} />

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 bg-foreground/20 z-40 lg:hidden cursor-default border-0 p-0"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-sidebar z-50 lg:hidden animate-fade-in flex flex-col border-r border-sidebar-border shadow-card-hover">
            <div className="p-4 border-b border-sidebar-border">
              <p className="font-display font-bold text-sidebar-foreground">
                {APP_DISPLAY_NAME}
              </p>
              <p className="text-xs text-sidebar-foreground/60 capitalize mt-0.5">
                {role} workspace
              </p>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-6">
              {sections.map((section) => (
                <div key={`m-${section.label}`}>
                  <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
                    {section.label}
                  </p>
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const active = activeTo === item.to;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                            active
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent",
                          )}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b border-border shadow-nav">
          <div className="h-14 flex items-center px-4 sm:px-6 gap-3 justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                type="button"
                className="lg:hidden p-2 hover:bg-muted rounded-lg shrink-0"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-semibold text-foreground truncate text-base sm:text-lg">
                    {title}
                  </h1>
                  <Badge
                    variant="secondary"
                    className="shrink-0 text-[10px] uppercase tracking-wide font-semibold"
                  >
                    {roleLabels[role]}
                  </Badge>
                </div>
                {(() => {
                  const crumb =
                    breadcrumbs ?? (
                      <DashboardBreadcrumbNav
                        pathname={location.pathname}
                        role={role}
                      />
                    );
                  return crumb ? (
                    <div className="mt-1 text-muted-foreground">{crumb}</div>
                  ) : null;
                })()}
              </div>
            </div>
            {headerRight ? (
              <div className="flex items-center gap-2 shrink-0">{headerRight}</div>
            ) : null}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 motion-page">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
