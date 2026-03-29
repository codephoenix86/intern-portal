import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RecruiterNotificationItem from "@/components/recruiter/RecruiterNotificationItem";
import { Button } from "@/components/ui/button";
import {
  listRecruiterNotifications,
  markRecruiterNotificationRead,
  markAllRecruiterNotificationsRead,
} from "@/services/recruiterPortal.service";

const RecruiterNotifications = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["recruiter", "notifications", "page"],
    queryFn: () => listRecruiterNotifications(1, 50),
  });

  const markOne = useMutation({
    mutationFn: (id: string) => markRecruiterNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruiter", "notifications"] });
      queryClient.invalidateQueries({ queryKey: ["header-notifications"] });
    },
  });

  const markAll = useMutation({
    mutationFn: markAllRecruiterNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruiter", "notifications"] });
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
            <RecruiterNotificationItem
              message={n.message}
              time={n.time}
              read={n.read}
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

export default RecruiterNotifications;
