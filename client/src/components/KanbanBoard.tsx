import type { StudentApplication } from "@/services/studentProfile.service";
import { cn } from "@/lib/utils";

const stages = ["Applied", "Screening", "Interview", "Offer", "Rejected"] as const;

const stageStyles: Record<string, string> = {
  Applied: "border-primary/25 bg-primary/[0.06]",
  Screening: "border-chart-4/30 bg-chart-4/[0.08]",
  Interview: "border-accent/30 bg-accent/[0.08]",
  Offer: "border-accent/40 bg-accent/[0.12]",
  Rejected: "border-destructive/25 bg-destructive/[0.06]",
};

const stageHeader: Record<string, string> = {
  Applied: "text-primary",
  Screening: "text-chart-4",
  Interview: "text-accent",
  Offer: "text-accent",
  Rejected: "text-destructive",
};

interface KanbanBoardProps {
  applications: StudentApplication[];
}

const KanbanBoard = ({ applications }: KanbanBoardProps) => (
  <div className="-mx-1 overflow-x-auto pb-2">
    <div className="flex min-w-[min(100%,920px)] gap-4 px-1 md:min-w-0 md:grid md:grid-cols-3 lg:grid-cols-5 lg:gap-3">
      {stages.map((stage) => {
        const items = applications.filter((a) => a.status === stage);
        return (
          <div key={stage} className="flex w-[min(100%,240px)] shrink-0 flex-col md:w-auto">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3
                className={cn(
                  "font-display text-xs font-semibold uppercase tracking-wide",
                  stageHeader[stage],
                )}
              >
                {stage}
              </h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {items.length}
              </span>
            </div>
            <div
              className={cn(
                "flex min-h-[140px] flex-1 flex-col gap-2 rounded-xl border border-dashed p-2",
                stageStyles[stage],
              )}
            >
              {items.map((app) => (
                <div
                  key={app.id}
                  className="cursor-default rounded-lg border border-border/60 bg-card p-3 shadow-sm transition-all duration-200 hover:border-primary/25 hover:shadow-md"
                >
                  <p className="font-medium text-sm text-foreground leading-snug">{app.internship}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{app.company}</p>
                  <p className="mt-2 text-[11px] text-muted-foreground">{app.date}</p>
                </div>
              ))}
              {items.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-border/40 border-dashed bg-background/50 px-2 py-8 text-center text-xs text-muted-foreground">
                  No applications
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default KanbanBoard;
