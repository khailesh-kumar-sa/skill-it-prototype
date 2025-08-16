import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock, Brain } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface Quiz {
  id: string;
  skill_category: string;
  skill_level: string;
  questions: Question[];
  passing_score: number;
}

interface SkillQuizProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skillCategory: string;
  skillLevel: string;
  onQuizCompleted: (passed: boolean, score: number) => void;
}

const SkillQuiz = ({ open, onOpenChange, skillCategory, skillLevel, onQuizCompleted }: SkillQuizProps) => {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ score: number; passed: boolean; correctAnswers: number } | null>(null);

  useEffect(() => {
    if (open && skillCategory && skillLevel) {
      loadQuiz();
    }
  }, [open, skillCategory, skillLevel]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizStarted, quizCompleted, timeLeft]);

  const loadQuiz = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('skill_quizzes')
        .select('*')
        .eq('skill_category', skillCategory)
        .eq('skill_level', skillLevel)
        .single();

      if (error) throw error;
      const quizData = {
        ...data,
        questions: (data.questions as unknown) as Question[]
      };
      setQuiz(quizData);
      setSelectedAnswers(new Array(quizData.questions.length).fill(-1));
    } catch (error) {
      console.error('Error loading quiz:', error);
      toast({
        title: "Error loading quiz",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setTimeLeft(600);
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    if (!quiz || !user) return;

    setQuizCompleted(true);
    const startTime = Date.now() - (600 - timeLeft) * 1000;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    let correctAnswers = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correct) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passing_score;

    setResults({ score, passed, correctAnswers });

    try {
      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          quiz_id: quiz.id,
          answers: selectedAnswers,
          score,
          passed,
          time_taken_seconds: timeTaken
        });

      if (error) throw error;

      toast({
        title: passed ? "Quiz Passed!" : "Quiz Failed",
        description: passed 
          ? `Congratulations! You scored ${score}%`
          : `You scored ${score}%. You need ${quiz.passing_score}% to pass.`,
        variant: passed ? "default" : "destructive"
      });

      onQuizCompleted(passed, score);
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
      toast({
        title: "Error saving results",
        description: "Please contact support",
        variant: "destructive"
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quiz?.questions.length || 0).fill(-1));
    setTimeLeft(600);
    setResults(null);
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!quiz) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quiz Not Available</DialogTitle>
            <DialogDescription>
              No quiz found for {skillCategory} at {skillLevel} level.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <span>{skillCategory} Quiz - {skillLevel}</span>
          </DialogTitle>
          <DialogDescription>
            Test your knowledge to validate your teaching ability
          </DialogDescription>
        </DialogHeader>

        {!quizStarted && !quizCompleted && (
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Quiz Information</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• {quiz.questions.length} questions</li>
                <li>• 10 minutes time limit</li>
                <li>• Passing score: {quiz.passing_score}%</li>
                <li>• You can retake if you don't pass</li>
              </ul>
            </div>
            <Button onClick={startQuiz} className="w-full" size="lg">
              Start Quiz
            </Button>
          </div>
        )}

        {quizStarted && !quizCompleted && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </Badge>
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
            </div>

            <Progress value={((currentQuestion + 1) / quiz.questions.length) * 100} />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {quiz.questions[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quiz.questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                    className="w-full text-left justify-start h-auto p-4"
                    onClick={() => selectAnswer(index)}
                  >
                    <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={nextQuestion}
                disabled={selectedAnswers[currentQuestion] === -1}
              >
                {currentQuestion === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next'}
              </Button>
            </div>
          </div>
        )}

        {quizCompleted && results && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              {results.passed ? (
                <CheckCircle className="w-16 h-16 text-success" />
              ) : (
                <XCircle className="w-16 h-16 text-destructive" />
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">
                {results.passed ? 'Congratulations!' : 'Try Again'}
              </h3>
              <p className="text-muted-foreground">
                You scored {results.correctAnswers} out of {quiz.questions.length} questions correctly
              </p>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <div className="text-3xl font-bold mb-1">{results.score}%</div>
              <div className="text-sm text-muted-foreground">
                {results.passed ? 'Passed' : `Need ${quiz.passing_score}% to pass`}
              </div>
            </div>

            <div className="flex space-x-3">
              {results.passed ? (
                <Button onClick={() => onOpenChange(false)} className="flex-1">
                  Continue
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={resetQuiz} className="flex-1">
                    Retake Quiz
                  </Button>
                  <Button onClick={() => onOpenChange(false)} className="flex-1">
                    Close
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SkillQuiz;