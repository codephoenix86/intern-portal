import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Compass, ChevronLeft, ChevronRight } from "lucide-react";
import { appIconNav } from "@/lib/app-icon-class";
import { useMemo, useState } from "react";
import { findBestNavMatch } from "@/lib/nav-active";
import type { AppShellNavSection } from "@/types/shell.types";
import { APP_DISPLAY_NAME } from "@/constants/brand";

interface AppShellSidebarProps {
  sections: AppShellNavSection[];
  role: "student" | "recruiter" | "mentor";
}

const AppShellSidebar = ({ sections, role }: AppShellSidebarProps) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const flatItems = useMemo(
    () => sections.flatMap((s) => s.items),
    [sections],
  );

  const activeTo = findBestNavMatch(location.pathname, flatItems);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 min-h-screen",
        collapsed ? "w-[4.5rem]" : "w-60",
      )}
    >
      <div className="flex items-center justify-between gap-2 p-4 border-b border-sidebar-border min-h-[4.25rem]">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <div className="rounded-lg gradient-primary p-1.5 shrink-0">
              <Compass className={`${appIconNav()} text-primary-foreground`} />
            </div>
            <span className="font-display font-bold text-sm text-sidebar-foreground truncate">
              {APP_DISPLAY_NAME}
            </span>
          </Link>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors shrink-0",
            collapsed && "mx-auto",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {sections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = activeTo === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <span className="shrink-0 [&_svg]:h-4 [&_svg]:w-4">
                      {item.icon}
                    </span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50 capitalize">
            {role} workspace
          </p>
        </div>
      )}
    </aside>
  );
};

export default AppShellSidebar;
