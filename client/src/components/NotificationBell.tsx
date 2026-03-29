import { Bell } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listStudentNotifications } from "@/services/studentPortal.service";
import { listRecruiterNotifications } from "@/services/recruiterPortal.service";

interface NotificationBellProps {
  role: "student" | "recruiter";
}

const NotificationBell = ({ role }: NotificationBellProps) => {
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["header-notifications", role],
    queryFn: () =>
      role === "student"
        ? listStudentNotifications(1, 8)
        : listRecruiterNotifications(1, 8),
  });

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-xl z-50 animate-fade-in">
            <div className="p-3 border-b border-border">
              <h3 className="font-semibold text-sm">Notifications</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground text-center">
                  No notifications
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 border-b border-border/50 text-sm hover:bg-muted/50 transition-colors ${
                      !n.read ? "bg-primary/5" : ""
                    }`}
                  >
                    <p className="text-foreground">{n.message}</p>
                    <span className="text-xs text-muted-foreground mt-1">
                      {n.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
