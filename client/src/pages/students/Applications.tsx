import { useEffect, useState } from "react";
import KanbanBoard from "@/components/KanbanBoard";
import {
  studentProfileService,
  type StudentApplication,
} from "@/services/studentProfile.service";
import { useToast } from "@/hooks/use-toast";

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
    <div>
      <h3 className="font-semibold text-foreground mb-4">
        Application Tracker
      </h3>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading applications...</p>
      ) : (
        <KanbanBoard applications={applications} />
      )}
    </div>
  );
};

export default Applications;
