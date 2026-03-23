import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  const links = [
    { to: "/", label: "Home" },
    { to: "/internships", label: "Internships" },
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
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <div className="px-4 py-3 space-y-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block py-2 text-sm text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="flex-1">
                <Button variant="ghost" className="w-full" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register" className="flex-1">
                <Button className="w-full" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
