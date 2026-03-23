import { Link } from "react-router-dom";
import { SIDEBAR_ITEMS } from "@/constants/mentor.sidebar";

interface MentorLayoutProps {
  title: string;
  children: React.ReactNode;
}

const MentorLayout = ({ title, children }: MentorLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="font-bold text-lg text-foreground">InternPortal</h2>
          <p className="text-xs text-muted-foreground">Mentor Dashboard</p>
        </div>

        <div className="flex-1 p-4 space-y-1">
          {SIDEBAR_ITEMS.map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                         font-medium text-muted-foreground hover:bg-muted
                         hover:text-foreground transition"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-border text-xs text-muted-foreground">
          Mentor Mode Enabled
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">{title}</h1>
        {children}
      </main>
    </div>
  );
};

export default MentorLayout;
