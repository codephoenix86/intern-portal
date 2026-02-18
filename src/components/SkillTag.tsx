import { cn } from "@/lib/utils";

interface SkillTagProps {
  skill: string;
  className?: string;
  variant?: "default" | "outline";
}

const SkillTag = ({ skill, className, variant = "default" }: SkillTagProps) => (
  <span
    className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      variant === "default"
        ? "bg-primary/10 text-primary"
        : "border border-primary/30 text-primary",
      className
    )}
  >
    {skill}
  </span>
);

export default SkillTag;
