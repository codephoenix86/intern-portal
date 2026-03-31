import { useEffect, useState } from "react";
import RecruiterNotificationItem from "@/components/recruiter/RecruiterNotificationItem";
import type { Notification } from "@/types/student.types";
import { notificationsService } from "@/services/notifications.service";

const RecruiterNotifications = () => {
  const [items, setItems] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const result = await notificationsService.listRecruiter({ limit: 50 });
        setItems(result.items);
      } catch (e) {
        console.error("Failed to load recruiter notifications:", e);
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
        items.map((n) => (
          <RecruiterNotificationItem
            key={n.id}
            message={n.message}
            time={n.time}
            read={n.read}
          />
        ))
      )}
    </div>
  );
};

export default RecruiterNotifications;
