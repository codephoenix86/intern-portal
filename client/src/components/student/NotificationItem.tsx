import type { Notification } from "@/types/student.types";

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  return (
    <div
      className={`glass-card rounded-lg p-4 ${
        !notification.read ? "border-l-4 border-l-primary" : ""
      }`}
    >
      <p className="text-sm text-foreground">{notification.message}</p>
      <span className="text-xs text-muted-foreground">{notification.time}</span>
    </div>
  );
};

export default NotificationItem;
