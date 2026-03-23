// client/src/components/student/skills/QuizQuestion.tsx

interface QuizQuestionProps {
  question: string;
  options: string[];
  current: number;
  total: number;
  onAnswer: (idx: number) => void;
}

const QuizQuestion = ({
  question,
  options,
  current,
  total,
  onAnswer,
}: QuizQuestionProps) => {
  return (
    <div className="glass-card rounded-lg p-6">
      <p className="text-xs text-muted-foreground mb-4">
        Question {current + 1} of {total}
      </p>

      <h3 className="font-semibold text-foreground mb-4">{question}</h3>

      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(i)}
            className="w-full text-left p-3 rounded-lg border border-border
                       hover:border-primary hover:bg-primary/5
                       transition-colors text-sm text-foreground"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;
