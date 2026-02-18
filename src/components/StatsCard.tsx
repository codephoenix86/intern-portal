import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  className?: string;
}

const StatsCard = ({ title, value, icon, trend, className }: StatsCardProps) => (
  <div className={cn("glass-card rounded-lg p-5 hover-lift", className)}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-muted-foreground">{title}</span>
      <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
    </div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    {trend && <p className="text-xs text-accent mt-1">{trend}</p>}
  </div>
);

export default StatsCard;
