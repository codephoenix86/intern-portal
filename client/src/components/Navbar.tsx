import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import NotificationBell from "./NotificationBell";
import { useAuth } from "@/contexts/AuthContext";
import LogoutButton from "./auth/LogoutButton";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  const links = [
    { to: "/", label: "Home" },
    { to: "/internships", label: "Internships" },
    { to: "/students", label: "Students" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 border-b ${isLanding ? "bg-card/80 backdrop-blur-md border-border/50" : "bg-card border-border"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg gradient-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">
              InternPortal
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <NotificationBell />

            {isAuthenticated && user ? (
              <>
                <Link
                  to={
                    user.role === "student"
                      ? "/student"
                      : user.role === "mentor"
                        ? "/mentor"
                        : "/recruiter"
                  }
                >
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
