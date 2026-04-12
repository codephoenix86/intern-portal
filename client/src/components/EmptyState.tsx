import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  action?: {
    label: string;
    to: string;
  };
  actionNode?: ReactNode;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  className,
  action,
  actionNode,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/30 px-6 py-14 text-center",
      className,
    )}
  >
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      <Icon className="h-7 w-7" strokeWidth={1.5} />
    </div>
    <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
    <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
    {action ? (
      <Button asChild className="mt-6">
        <Link to={action.to}>{action.label}</Link>
      </Button>
    ) : null}
    {actionNode ? <div className="mt-6">{actionNode}</div> : null}
  </div>
);

export default EmptyState;
