import { useEffect, useMemo, useState } from "react";
import { AlarmClock, CheckCircle2, ClipboardList, Loader2, ShieldCheck } from "lucide-react";
import QuizQuestion from "@/components/student/QuizQuestion";
import QuizResult from "@/components/student/QuizResult";
import { Badge } from "@/components/ui/badge";
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

const EVALUATION_RULES = [
  "Each question has one best answer.",
  "Evaluation auto-submits when timer reaches 00:00.",
  "You can move between questions before final submit.",
  "Do not refresh the page during an active evaluation.",
];

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
    const clampedQuestionCount = Math.max(
      MIN_QUESTIONS,
      Math.min(MAX_QUESTIONS, questionCount || MIN_QUESTIONS),
    );
    const estimatedTime = clampedQuestionCount * SECONDS_PER_QUESTION;

    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="rounded-2xl border border-border bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-5 md:p-6 text-white shadow-lg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-200/90">Recruitment Assessment</p>
              <h2 className="text-2xl font-semibold">Skill Evaluation Console</h2>
              <p className="text-sm text-blue-100/90 max-w-2xl">
                Simulate a company OA round with timed questions and instant scoring.
                Configure your topic, verify details, and start the assessment.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm min-w-[260px]">
              <div className="rounded-lg bg-white/10 border border-white/20 p-3">
                <p className="text-blue-100">Questions</p>
                <p className="text-lg font-semibold">{clampedQuestionCount}</p>
              </div>
              <div className="rounded-lg bg-white/10 border border-white/20 p-3">
                <p className="text-blue-100">Duration</p>
                <p className="text-lg font-semibold">{formatTime(estimatedTime)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.35fr,1fr]">
          <div className="glass-card rounded-xl border border-border/70 p-5 md:p-6 space-y-5">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Assessment Setup</h3>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Topic / Skill</label>
              <Input
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="Examples: React, TypeScript, SQL, Node.js"
                className="h-11"
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
                onChange={(e) =>
                  setQuestionCount(Number(e.target.value) || MIN_QUESTIONS)
                }
                className="h-11"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-background/70 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Question Window</p>
                <p className="text-base font-semibold text-foreground">90s per question</p>
              </div>
              <div className="rounded-lg border border-border bg-background/70 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Estimated Duration</p>
                <p className="text-base font-semibold text-foreground">{formatTime(estimatedTime)}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-md px-3 py-1">Adaptive MCQ</Badge>
              <Badge variant="outline" className="rounded-md px-3 py-1">Auto-submit Enabled</Badge>
              <Badge variant="outline" className="rounded-md px-3 py-1">Instant Scorecard</Badge>
            </div>

            <Button onClick={() => void startEvaluation()} disabled={isLoading} className="h-11 px-6">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating OA Session...
                </span>
              ) : (
                "Launch Assessment"
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="glass-card rounded-xl border border-border/70 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-foreground">OA Instructions</h4>
              </div>

              <ul className="space-y-3">
                {EVALUATION_RULES.map((rule) => (
                  <li key={rule} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-xl border border-border/70 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <AlarmClock className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-foreground">Round Summary</h4>
              </div>
              <div className="rounded-lg border border-border bg-background/70 p-3 text-sm text-muted-foreground space-y-2">
                <p>
                  Targeted questions: <span className="font-medium text-foreground">{clampedQuestionCount}</span>
                </p>
                <p>
                  Total allocated time: <span className="font-medium text-foreground">{formatTime(estimatedTime)}</span>
                </p>
                <p>
                  Recommended: attempt all questions before final submit.
                </p>
              </div>
            </div>
          </div>
        </div>
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
      <div className="glass-card rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 border border-border/70">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Topic</p>
          <p className="font-semibold text-foreground capitalize">{skill}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Time Left</p>
          <p className="font-semibold text-foreground tabular-nums">{formatTime(secondsLeft)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Attempted</p>
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

      <div className="glass-card rounded-lg p-4 border border-border/70">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Question Navigator</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((_, index) => {
            const isCurrent = index === currentQ;
            const isAnswered = answers[index] !== null;

            return (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentQ(index)}
                className={`h-9 w-9 rounded-md border text-sm font-medium transition-colors ${
                  isCurrent
                    ? "border-primary bg-primary text-primary-foreground"
                    : isAnswered
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
                      : "border-border bg-background text-foreground hover:border-primary/40"
                }`}
                aria-label={`Go to question ${index + 1}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

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
