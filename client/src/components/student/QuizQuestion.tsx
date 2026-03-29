// client/src/components/student/skills/QuizQuestion.tsx

interface QuizQuestionProps {
  question: string;
  options: string[];
  questionType: "concept" | "code" | "debug" | "scenario";
  current: number;
  total: number;
  selectedAnswer: number | null;
  onSelectAnswer: (idx: number) => void;
}

const QuizQuestion = ({
  question,
  options,
  questionType,
  current,
  total,
  selectedAnswer,
  onSelectAnswer,
}: QuizQuestionProps) => {
  return (
    <div className="glass-card rounded-lg p-6">
      <p className="text-xs text-muted-foreground mb-4">
        Question {current + 1} of {total}
      </p>

      <p className="text-xs uppercase tracking-wide text-primary mb-3">
        {questionType}
      </p>

      <h3 className="font-semibold text-foreground mb-4">{question}</h3>

      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelectAnswer(i)}
            className="w-full text-left p-3 rounded-lg border border-border
                       hover:border-primary hover:bg-primary/5
                       transition-colors text-sm text-foreground
                       aria-pressed:bg-primary/10 aria-pressed:border-primary
                       disabled:opacity-70
                       disabled:cursor-not-allowed"
            aria-pressed={selectedAnswer === i}
          >
            <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;
