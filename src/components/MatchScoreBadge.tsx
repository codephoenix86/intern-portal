import { cn } from "@/lib/utils";

interface MatchScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const MatchScoreBadge = ({ score, size = "md", className }: MatchScoreBadgeProps) => {
  const getColor = () => {
    if (score >= 85) return "text-accent bg-accent/10 border-accent/30";
    if (score >= 70) return "text-primary bg-primary/10 border-primary/30";
    return "text-muted-foreground bg-muted border-border";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <span className={cn("inline-flex items-center font-semibold rounded-full border", getColor(), sizeClasses[size], className)}>
      {score}% Match
    </span>
  );
};

export default MatchScoreBadge;
