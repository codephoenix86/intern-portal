import { Button } from "@/components/ui/button";
import SkillTag from "@/components/SkillTag";
import type { Training } from "@/types/mentor.types";

interface TrainingCardProps {
  training: Training;
}

const TrainingCard = ({ training }: TrainingCardProps) => {
  return (
    <div className="glass-card rounded-lg p-5 hover-lift">
      <h3 className="font-semibold text-foreground">{training.title}</h3>

      <p className="text-sm text-muted-foreground mt-1">
        Level:{" "}
        <span className="font-medium text-foreground">{training.level}</span>
      </p>

      <p className="text-sm text-muted-foreground">
        Duration:{" "}
        <span className="font-medium text-foreground">{training.duration}</span>
      </p>

      <div className="flex flex-wrap gap-2 mt-3">
        {training.skills.map((s) => (
          <SkillTag key={s} skill={s} />
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1">
          View
        </Button>
        <Button className="flex-1 gradient-primary text-primary-foreground border-0">
          Edit
        </Button>
      </div>
    </div>
  );
};

export default TrainingCard;
