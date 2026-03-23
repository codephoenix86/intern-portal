import { Progress } from "@/components/ui/progress";
import type { ProgressData } from "@/types/mentor.types";

interface ProgressCardProps {
  data: ProgressData;
}

const ProgressCard = ({ data }: ProgressCardProps) => {
  return (
    <div className="glass-card rounded-lg p-5">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-foreground">{data.name}</h3>
        <span className="text-primary font-bold">{data.score}%</span>
      </div>

      <p className="text-sm text-muted-foreground mb-2">
        Skill: <span className="text-foreground font-medium">{data.skill}</span>
      </p>

      <Progress value={data.score} className="h-2" />
    </div>
  );
};

export default ProgressCard;
