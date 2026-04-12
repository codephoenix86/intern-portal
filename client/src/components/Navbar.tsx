import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Compass, Menu } from "lucide-react";
import { appIconMd } from "@/lib/app-icon-class";
import { Button } from "./ui/button";
import NotificationBell from "./NotificationBell";
import { useAuth } from "@/contexts/AuthContext";
import LogoutButton from "./auth/LogoutButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { APP_DISPLAY_NAME } from "@/constants/brand";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  const links = [
    { to: "/", label: "Home" },
    { to: "/internships", label: "Internships" },
    { to: "/students", label: "Students" },
    { to: "/recruiters", label: "Recruiters" },
    { to: "/mentors", label: "Mentors" },
    { to: "/about", label: "About" },
  ];

  const dashboardPath =
    user?.role === "student"
      ? "/student"
      : user?.role === "mentor"
        ? "/mentor"
        : "/recruiter";

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 border-b shadow-nav",
        isLanding ? "bg-card/85 backdrop-blur-md border-border/60" : "bg-card/95 backdrop-blur-sm border-border",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-lg gradient-primary p-1.5">
            <Compass className={`${appIconMd()} text-primary-foreground`} />
          </div>
          <span className="font-display text-lg font-bold text-foreground">
            {APP_DISPLAY_NAME}
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "text-sm font-medium transition-colors",
                location.pathname === l.to
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex md:gap-3">
          <NotificationBell />

          {isAuthenticated && user ? (
            <>
              <Link to={dashboardPath}>
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <LogoutButton variant="ghost" showText={false} />
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <NotificationBell />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[min(100%,320px)] flex-col">
              <SheetHeader>
                <SheetTitle className="font-display text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                      location.pathname === l.to
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t border-border pt-6">
                {isAuthenticated && user ? (
                  <>
                    <Button asChild variant="default" className="w-full">
                      <Link to={dashboardPath} onClick={() => setMobileOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                    <LogoutButton variant="outline" className="w-full" showText />
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/login" onClick={() => setMobileOpen(false)}>
                        Log in
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link to="/register" onClick={() => setMobileOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
