import { useQuery } from "@tanstack/react-query";
import KanbanBoard from "@/components/KanbanBoard";
import { listStudentApplications } from "@/services/studentPortal.service";

const Applications = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["student", "applications"],
    queryFn: listStudentApplications,
  });

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Loading applications…</p>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        Could not load applications. Please try again.
      </p>
    );
  }

  return (
    <div>
      <h3 className="font-semibold text-foreground mb-4">
        Application Tracker
      </h3>
      <KanbanBoard applications={data.applications} />
    </div>
  );
};

export default Applications;
