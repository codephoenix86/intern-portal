import { useEffect, useState } from "react";
import NotificationItem from "@/components/student/NotificationItem";
import type { Notification } from "@/types/student.types";
import { notificationsService } from "@/services/notifications.service";

const NotificationsPage = () => {
  const [items, setItems] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const result = await notificationsService.listStudent({ limit: 50 });
        setItems(result.items);
      } catch (e) {
        console.error("Failed to load student notifications:", e);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="space-y-2 max-w-2xl">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading notifications...</p>
      ) : (
        items.map((n) => <NotificationItem key={n.id} notification={n} />)
      )}
    </div>
  );
};

export default NotificationsPage;
