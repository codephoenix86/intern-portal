import { useEffect, useState } from "react";
import KanbanBoard from "@/components/KanbanBoard";
import EmptyState from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import {
  studentProfileService,
  type StudentApplication,
} from "@/services/studentProfile.service";
import { useToast } from "@/hooks/use-toast";
import { ListTodo } from "lucide-react";

const Applications = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async (): Promise<void> => {
      try {
        const result = await studentProfileService.getApplications();
        setApplications(result);
      } catch (error) {
        console.error("Failed to load applications:", error);
        toast({
          title: "Failed to load applications",
          description: "Please refresh and try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    void loadApplications();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground">Application tracker</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Track every stage from applied to offer in one place.
        </p>
      </div>
      {loading ? (
        <div className="space-y-4">
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="min-w-[180px] flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No applications yet"
          description="Start exploring internships and submit your first application to see your pipeline here."
          action={{ label: "Search internships", to: "/student/search" }}
        />
      ) : (
        <KanbanBoard applications={applications} />
      )}
    </div>
  );
};

export default Applications;
