import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import QuizQuestion from "@/components/student/QuizQuestion";
import QuizResult from "@/components/student/QuizResult";
import { Loader2 } from "lucide-react";
import {
  studentPortalService,
  type StudentQuizQuestion,
} from "@/services/studentPortal.service";
import { useToast } from "@/hooks/use-toast";

const SkillEvaluation = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<StudentQuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const loadQuiz = async (): Promise<void> => {
      try {
        const result = await studentPortalService.getQuiz();
        setQuestions(result);
      } catch (error) {
        console.error("Failed to load quiz:", error);
        toast({
          title: "Failed to load quiz",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    void loadQuiz();
  }, [toast]);

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
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

  const score = answers.filter((a, i) => a === questions[i]?.correct).length;

  const level =
    score >= 4 ? "Advanced" : score >= 2 ? "Intermediate" : "Beginner";

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading quiz questions...</span>
      </div>
    );
  }

  if (questions.length === 0) {
    return <p className="text-sm text-muted-foreground">No quiz questions available right now.</p>;
  }

  if (showResult) {
    return (
      <QuizResult
        score={score}
        total={questions.length}
        level={level}
        onRetake={handleRetake}
      />
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {currentQ + 1} of {questions.length}
        </span>
        <Progress
          value={(currentQ / questions.length) * 100}
          className="w-32 h-2"
        />
      </div>

      <QuizQuestion
        question={questions[currentQ].question}
        options={questions[currentQ].options}
        current={currentQ}
        total={questions.length}
        onAnswer={handleAnswer}
      />
    </div>
  );
};

export default SkillEvaluation;
