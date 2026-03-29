import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface QuizResultProps {
  correct: number;
  wrong: number;
  notAttempted: number;
  scoreOutOf100: number;
  total: number;
  skill: string;
  onRetake: () => void;
}

const QuizResult = ({
  correct,
  wrong,
  notAttempted,
  scoreOutOf100,
  total,
  skill,
  onRetake,
}: QuizResultProps) => {
  return (
    <div className="glass-card rounded-lg p-8 text-center max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-foreground mb-2">
        Evaluation Complete
      </h3>
      <p className="text-4xl font-bold gradient-text mb-2">
        {scoreOutOf100}/100
      </p>
      <p className="text-muted-foreground mb-4">
        Topic: <span className="font-semibold text-primary capitalize">{skill}</span>
      </p>

      <div className="grid grid-cols-3 gap-2 text-sm mb-4">
        <div className="rounded-md bg-emerald-500/10 p-2">
          <p className="text-muted-foreground">Correct</p>
          <p className="font-semibold text-foreground">{correct}</p>
        </div>
        <div className="rounded-md bg-red-500/10 p-2">
          <p className="text-muted-foreground">Wrong</p>
          <p className="font-semibold text-foreground">{wrong}</p>
        </div>
        <div className="rounded-md bg-amber-500/10 p-2">
          <p className="text-muted-foreground">Not Attempted</p>
          <p className="font-semibold text-foreground">{notAttempted}</p>
        </div>
      </div>

      <Progress value={(correct / total) * 100} className="h-3 mb-4" />
      <Button onClick={onRetake} variant="outline">
        Start New Evaluation
      </Button>
    </div>
  );
};

export default QuizResult;
