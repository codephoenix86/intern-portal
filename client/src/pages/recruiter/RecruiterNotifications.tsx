import RecruiterNotificationItem from "@/components/recruiter/RecruiterNotificationItem";
import { notifications } from "@/data/mockData";

const RecruiterNotifications = () => {
  return (
    <div className="space-y-2 max-w-2xl">
      {notifications.map((n) => (
        <RecruiterNotificationItem
          key={n.id}
          message={n.message}
          time={n.time}
          read={n.read}
        />
      ))}
    </div>
  );
};

export default RecruiterNotifications;
