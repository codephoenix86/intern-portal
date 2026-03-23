interface RecruiterNotificationItemProps {
  message: string;
  time: string;
  read: boolean;
}

const RecruiterNotificationItem = ({
  message,
  time,
  read,
}: RecruiterNotificationItemProps) => {
  return (
    <div
      className={`glass-card rounded-lg p-4 ${
        !read ? "border-l-4 border-l-primary" : ""
      }`}
    >
      <p className="text-sm text-foreground">{message}</p>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  );
};

export default RecruiterNotificationItem;
