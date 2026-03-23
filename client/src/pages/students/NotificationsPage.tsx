import NotificationItem from "@/components/student/NotificationItem";
import { notifications } from "@/data/mockData";

const NotificationsPage = () => {
  return (
    <div className="space-y-2 max-w-2xl">
      {notifications.map((n) => (
        <NotificationItem
          key={n.id}
          notification={{ ...n, id: Number(n.id) }}
        />
      ))}
    </div>
  );
};

export default NotificationsPage;
