import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import QuizQuestion from "@/components/student/QuizQuestion";
import QuizResult from "@/components/student/QuizResult";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  studentPortalService,
  type StudentQuizQuestion,
} from "@/services/studentPortal.service";
import { useToast } from "@/hooks/use-toast";

type Phase = "setup" | "exam" | "result";

const MIN_QUESTIONS = 15;
const MAX_QUESTIONS = 25;
const SECONDS_PER_QUESTION = 90;

const formatTime = (seconds: number): string => {
  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const SkillEvaluation = () => {
  const { toast } = useToast();

  const [phase, setPhase] = useState<Phase>("setup");
  const [skill, setSkill] = useState("");
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [questions, setQuestions] = useState<StudentQuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const attemptedCount = useMemo(
    () => answers.filter((answer) => answer !== null).length,
    [answers],
  );

  const correctCount = useMemo(
    () =>
      answers.reduce(
        (count, answer, index) =>
          answer !== null && answer === questions[index]?.correct ? count + 1 : count,
        0,
      ),
    [answers, questions],
  );

  const wrongCount = useMemo(
    () =>
      answers.reduce(
        (count, answer, index) =>
          answer !== null && answer !== questions[index]?.correct ? count + 1 : count,
        0,
      ),
    [answers, questions],
  );

  const notAttemptedCount = useMemo(
    () => Math.max(questions.length - attemptedCount, 0),
    [questions.length, attemptedCount],
  );

  const scoreOutOf100 = useMemo(() => {
    if (questions.length === 0) return 0;
    return Math.round((correctCount / questions.length) * 100);
  }, [correctCount, questions.length]);

  const submitEvaluation = (): void => {
    setPhase("result");
  };

  useEffect(() => {
    if (phase !== "exam") return;

    if (secondsLeft <= 0) {
      toast({
        title: "Time is up",
        description: "Evaluation submitted automatically.",
      });
      submitEvaluation();
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, secondsLeft, toast]);

  const startEvaluation = async (): Promise<void> => {
    if (!skill.trim()) {
      toast({
        title: "Topic required",
        description: "Enter a skill/topic for evaluation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const clampedCount = Math.max(
        MIN_QUESTIONS,
        Math.min(MAX_QUESTIONS, questionCount),
      );

      const result = await studentPortalService.getQuiz({
        skill: skill.trim(),
        count: clampedCount,
      });

      if (result.length === 0) {
        toast({
          title: "No questions found",
          description: "Try another topic.",
          variant: "destructive",
        });
        return;
      }

      setQuestions(result);
      setAnswers(Array.from({ length: result.length }, () => null));
      setCurrentQ(0);
      setSecondsLeft(result.length * SECONDS_PER_QUESTION);
      setPhase("exam");
    } catch (error) {
      console.error("Failed to start evaluation:", error);
      toast({
        title: "Could not start evaluation",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectAnswer = (index: number): void => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQ] = index;
      return next;
    });
  };

  const clearCurrentAnswer = (): void => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQ] = null;
      return next;
    });
  };

  const handleRetake = (): void => {
    setPhase("setup");
    setQuestions([]);
    setAnswers([]);
    setCurrentQ(0);
    setSecondsLeft(0);
  };

  if (phase === "setup") {
    return (
      <div className="max-w-2xl mx-auto glass-card rounded-lg p-6 space-y-5">
        <h3 className="text-xl font-semibold text-foreground">Skill Evaluation</h3>
        <p className="text-sm text-muted-foreground">
          Enter the topic/skill for evaluation. You can choose between 15 and 25
          questions. Timer is automatically set to 1.5 minutes per question.
        </p>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Topic / Skill</label>
          <Input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="Example: React, TypeScript, SQL, Node.js"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Number of Questions ({MIN_QUESTIONS}-{MAX_QUESTIONS})
          </label>
          <Input
            type="number"
            min={MIN_QUESTIONS}
            max={MAX_QUESTIONS}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value) || MIN_QUESTIONS)}
          />
        </div>

        <div className="text-sm text-muted-foreground">
          Total time: {formatTime(questionCount * SECONDS_PER_QUESTION)}
        </div>

        <Button onClick={() => void startEvaluation()} disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Evaluation...
            </span>
          ) : (
            "Start Evaluation"
          )}
        </Button>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <QuizResult
        correct={correctCount}
        wrong={wrongCount}
        notAttempted={notAttemptedCount}
        scoreOutOf100={scoreOutOf100}
        total={questions.length}
        skill={skill}
        onRetake={handleRetake}
      />
    );
  }

  if (questions.length === 0) {
    return <p className="text-sm text-muted-foreground">No questions available.</p>;
  }

  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="glass-card rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Topic</p>
          <p className="font-semibold text-foreground capitalize">{skill}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Time Left</p>
          <p className="font-semibold text-foreground">{formatTime(secondsLeft)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Attempted</p>
          <p className="font-semibold text-foreground">{attemptedCount}/{questions.length}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Question {currentQ + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <QuizQuestion
        question={questions[currentQ].question}
        options={questions[currentQ].options}
        questionType={questions[currentQ].type}
        current={currentQ}
        total={questions.length}
        selectedAnswer={answers[currentQ]}
        onSelectAnswer={selectAnswer}
      />

      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={currentQ === 0}
            onClick={() => setCurrentQ((prev) => prev - 1)}
          >
            Previous
          </Button>
          <Button type="button" variant="ghost" onClick={clearCurrentAnswer}>
            Clear Response
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={currentQ >= questions.length - 1}
            onClick={() => setCurrentQ((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>

        <Button type="button" onClick={submitEvaluation}>
          Submit Evaluation
        </Button>
      </div>
    </div>
  );
};

export default SkillEvaluation;
