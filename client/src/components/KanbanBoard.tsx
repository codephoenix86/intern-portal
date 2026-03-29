import type { StudentApplication } from "@/services/studentProfile.service";

const stages = ["Applied", "Screening", "Interview", "Offer", "Rejected"];

const stageColors: Record<string, string> = {
  Applied: "bg-primary/10 border-primary/30",
  Screening: "bg-chart-4/10 border-chart-4/30",
  Interview: "bg-accent/10 border-accent/30",
  Offer: "bg-accent/20 border-accent/40",
  Rejected: "bg-destructive/10 border-destructive/30",
};

interface KanbanBoardProps {
  applications: StudentApplication[];
}

const KanbanBoard = ({ applications }: KanbanBoardProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
    {stages.map(stage => {
      const items = applications.filter(a => a.status === stage);
      return (
        <div key={stage} className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-sm text-foreground">{stage}</h3>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{items.length}</span>
          </div>
          <div className="space-y-2 min-h-[100px]">
            {items.map(app => (
              <div key={app.id} className={`p-3 rounded-lg border ${stageColors[stage]} hover-lift cursor-pointer`}>
                <p className="font-medium text-sm text-foreground">{app.internship}</p>
                <p className="text-xs text-muted-foreground mt-1">{app.company}</p>
                <p className="text-xs text-muted-foreground mt-1">{app.date}</p>
              </div>
            ))}
            {items.length === 0 && (
              <div className="p-4 rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground">
                No applications
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

export default KanbanBoard;
