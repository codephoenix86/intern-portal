import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NotificationItem from "@/components/student/NotificationItem";
import { Button } from "@/components/ui/button";
import {
  listStudentNotifications,
  markStudentNotificationRead,
  markAllStudentNotificationsRead,
} from "@/services/studentPortal.service";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["student", "notifications", "page"],
    queryFn: () => listStudentNotifications(1, 50),
  });

  const markOne = useMutation({
    mutationFn: (id: string) => markStudentNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "notifications"] });
      queryClient.invalidateQueries({ queryKey: ["header-notifications"] });
    },
  });

  const markAll = useMutation({
    mutationFn: markAllStudentNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "notifications"] });
      queryClient.invalidateQueries({ queryKey: ["header-notifications"] });
    },
  });

  const notifications = data?.notifications ?? [];

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Loading notifications…</p>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">Could not load notifications.</p>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={markAll.isPending || notifications.every((n) => n.read)}
          onClick={() => markAll.mutate()}
        >
          Mark all read
        </Button>
      </div>
      <div className="space-y-2">
        {notifications.map((n) => (
          <button
            key={n.id}
            type="button"
            className="w-full text-left"
            onClick={() => {
              if (!n.read) markOne.mutate(String(n.id));
            }}
          >
            <NotificationItem
              notification={{
                id: n.id,
                message: n.message,
                time: n.time,
                read: n.read,
              }}
            />
          </button>
        ))}
      </div>
      {notifications.length === 0 && (
        <p className="text-sm text-muted-foreground">No notifications yet.</p>
      )}
    </div>
  );
};

export default NotificationsPage;
