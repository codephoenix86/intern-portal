import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface QuizResultProps {
  score: number;
  total: number;
  level: string;
  onRetake: () => void;
}

const QuizResult = ({ score, total, level, onRetake }: QuizResultProps) => {
  return (
    <div className="glass-card rounded-lg p-8 text-center max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-foreground mb-2">
        Quiz Complete!
      </h3>
      <p className="text-4xl font-bold gradient-text mb-2">
        {score}/{total}
      </p>
      <p className="text-muted-foreground mb-4">
        Skill Level: <span className="font-semibold text-primary">{level}</span>
      </p>
      <Progress value={(score / total) * 100} className="h-3 mb-4" />
      <Button onClick={onRetake} variant="outline">
        Retake Quiz
      </Button>
    </div>
  );
};

export default QuizResult;
