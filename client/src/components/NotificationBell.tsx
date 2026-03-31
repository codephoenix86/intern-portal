import { Bell } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Notification } from "@/types/student.types";
import { notificationsService } from "@/services/notifications.service";
import { useAuth } from "@/contexts/AuthContext";

const NotificationBell = () => {
  const { isAuthenticated, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items],
  );

  useEffect(() => {
    if (!open) return;
    if (!isAuthenticated || !user) return;

    const load = async (): Promise<void> => {
      setIsLoading(true);
      try {
        if (user.role === "student") {
          const result = await notificationsService.listStudent({ limit: 10 });
          setItems(result.items);
        } else if (user.role === "recruiter") {
          const result = await notificationsService.listRecruiter({ limit: 10 });
          setItems(result.items);
        } else {
          // No mentor notifications endpoint in backend API docs.
          setItems([]);
        }
      } catch (e) {
        console.error("Failed to load notifications:", e);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [open, isAuthenticated, user]);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-muted transition-colors">
        <Bell className="h-5 w-5 text-muted-foreground" />
        {isAuthenticated && unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-xl z-50 animate-fade-in">
            <div className="p-3 border-b border-border">
              <h3 className="font-semibold text-sm">Notifications</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {!isAuthenticated && (
                <div className="p-3 text-sm text-muted-foreground">
                  Login to see notifications.
                </div>
              )}

              {isAuthenticated && isLoading && (
                <div className="p-3 text-sm text-muted-foreground">
                  Loading...
                </div>
              )}

              {isAuthenticated &&
                !isLoading &&
                items.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 border-b border-border/50 text-sm hover:bg-muted/50 transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                  >
                    <p className="text-foreground">{n.message}</p>
                    <span className="text-xs text-muted-foreground mt-1">
                      {n.time}
                    </span>
                  </div>
                ))}

              {isAuthenticated && !isLoading && items.length === 0 && (
                <div className="p-3 text-sm text-muted-foreground">
                  No notifications yet.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
