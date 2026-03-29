import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import QuizQuestion from "@/components/student/QuizQuestion";
import QuizResult from "@/components/student/QuizResult";
import { getStudentQuiz } from "@/services/studentPortal.service";

const SkillEvaluation = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["student", "content", "quiz"],
    queryFn: getStudentQuiz,
  });

  const skillQuiz = data?.questions ?? [];

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);

    if (currentQ < skillQuiz.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRetake = () => {
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
  };

  const score = answers.filter((a, i) => a === skillQuiz[i]?.correct).length;

  const level =
    score >= 4 ? "Advanced" : score >= 2 ? "Intermediate" : "Beginner";

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Loading quiz…
      </p>
    );
  }

  if (isError || skillQuiz.length === 0) {
    return (
      <p className="text-sm text-destructive text-center py-8">
        Could not load the skill quiz.
      </p>
    );
  }

  if (showResult) {
    return (
      <QuizResult
        score={score}
        total={skillQuiz.length}
        level={level}
        onRetake={handleRetake}
      />
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {currentQ + 1} of {skillQuiz.length}
        </span>
        <Progress
          value={(currentQ / skillQuiz.length) * 100}
          className="w-32 h-2"
        />
      </div>

      <QuizQuestion
        question={skillQuiz[currentQ].question}
        options={skillQuiz[currentQ].options}
        current={currentQ}
        total={skillQuiz.length}
        onAnswer={handleAnswer}
      />
    </div>
  );
};

export default SkillEvaluation;
