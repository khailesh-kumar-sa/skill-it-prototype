import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import BottomNavigation from "@/components/BottomNavigation";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Trophy, 
  Target, 
  Lightbulb,
  Clock,
  Volume2,
  VolumeX,
  BarChart3,
  ArrowRight
} from "lucide-react";

const InterviewTrainer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedRole, setSelectedRole] = useState('');
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [enhancedFeedback, setEnhancedFeedback] = useState<any>(null);

  const careerRoles = [
    'BPO Technical Support',
    'Junior Software Developer', 
    'IT Help Desk Specialist',
    'Full Stack Developer',
    'Data Analyst',
    'DevOps Engineer',
    'Cybersecurity Analyst',
    'Solution Architect',
    'Data Scientist',
    'Cloud Architect',
    'Product Manager (Tech)',
    'Engineering Manager',
    'Chief Technology Officer',
    'Tech Entrepreneur',
    'IT Consultant',
    'Freelance Developer'
  ];

  const difficultySettings = {
    beginner: { time: 60, minScore: 60 },
    intermediate: { time: 60, minScore: 70 },
    advanced: { time: 60, minScore: 80 }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setRecordedAudio(base64Audio);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      toast({
        title: "🎤 Recording Started",
        description: "Speak clearly and confidently. Good luck!",
      });

      // Auto-stop after 60 seconds
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
          setIsRecording(false);
          setHasRecorded(true);
          toast({
            title: "⏹️ Recording Complete",
            description: "Great job! Click Submit for AI analysis",
          });
        }
      }, 60000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    setHasRecorded(true);
    toast({
      title: "⏹️ Recording Stopped",
      description: "Click Submit for AI analysis or try again",
    });
  };

  const handleSubmit = async () => {
    if (!recordedAudio || !selectedRole) {
      toast({
        title: "Error",
        description: "Please select a role and record your answer first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    toast({
      title: "🤖 AI Analysis Starting",
      description: "Analyzing your response...",
    });

    try {
      // Get AI analysis
      const response = await supabase.functions.invoke('interview-analysis', {
        body: {
          audio: recordedAudio,
          question: aiQuestion,
          role: selectedRole,
          idealAnswer: aiAnswer
        }
      });

      if (response.error) {
        throw new Error('Analysis failed');
      }

      const feedback = response.data;
      setEnhancedFeedback(feedback);
      setIsAnalyzing(false);
      setShowFeedback(true);
      
      toast({
        title: "✅ Analysis Complete!",
        description: `Overall Score: ${feedback.overallScore}/100`,
      });
    } catch (error) {
      setIsAnalyzing(false);
      toast({
        title: "Error",
        description: "Failed to analyze response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = async () => {
    if (!selectedRole) {
      toast({
        title: "Please select a role first",
        description: "Choose your career role to get targeted questions",
        variant: "destructive",
      });
      return;
    }

    try {
      // Import the interview questions data
      const { interviewQuestions } = await import('@/data/interviewQuestions');
      
      const roleQuestions = interviewQuestions[selectedRole];
      if (!roleQuestions) {
        throw new Error('No questions found for this role');
      }

      // Get questions for the selected difficulty
      const questions = roleQuestions[difficulty];
      if (!questions || questions.length === 0) {
        throw new Error('No questions found for this difficulty level');
      }

      // Select a random question
      const randomIndex = Math.floor(Math.random() * questions.length);
      const selectedQuestion = questions[randomIndex];

      setAiQuestion(selectedQuestion.question);
      setAiAnswer(selectedQuestion.idealAnswer);
      setHasRecorded(false);
      setShowFeedback(false);
      setRecordingTime(0);
      setRecordedAudio(null);
      setEnhancedFeedback(null);

      toast({
        title: "Question Generated!",
        description: "Read the question carefully and prepare your answer",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRetry = () => {
    setHasRecorded(false);
    setShowFeedback(false);
    setRecordingTime(0);
    setRecordedAudio(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5 pb-20">
      <div className="p-6">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-card-foreground mb-2 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <span>AI Interview Trainer</span>
          </h1>
          <p className="text-muted-foreground">Practice with role-specific questions and get AI-powered feedback on tone, clarity, and content</p>
        </div>

        {/* Settings Panel */}
        <Card className="mb-6 animate-scale-in border border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Interview Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Step 1: Role Selection */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <label className="text-lg font-semibold text-card-foreground">Select Your Role</label>
                </div>
                <div className="ml-10">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-3 border border-border rounded-md bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Choose a career role...</option>
                    {careerRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-muted-foreground mt-2">
                    Select your target role to get specialized interview questions from an HR expert in that field
                  </p>
                </div>
              </div>

              {/* Step 2: Difficulty Level */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <label className="text-lg font-semibold text-card-foreground">Select Difficulty Level</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-10">
                  {Object.keys(difficultySettings).map((diff) => (
                    <Button
                      key={diff}
                      variant={difficulty === diff ? "default" : "outline"}
                      size="lg"
                      onClick={() => setDifficulty(diff as typeof difficulty)}
                      className="capitalize text-left justify-start h-auto p-4 flex flex-col items-start space-y-1"
                    >
                      <span className="font-semibold">{diff}</span>
                      <span className="text-xs opacity-70">
                        60s time limit
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Step 3: Generate Question */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <label className="text-lg font-semibold text-card-foreground">Generate Question</label>
                </div>
                <div className="ml-10">
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!selectedRole}
                    size="lg"
                    className="w-full h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <Lightbulb className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-semibold">Generate AI Question</div>
                      <div className="text-xs opacity-70">
                        Get a role-specific question from an HR expert
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Settings Summary */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50">
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-card-foreground">Current Settings</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Role:</span>
                    <div className="font-medium">{selectedRole || 'Not selected'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Difficulty:</span>
                    <div className="font-medium capitalize">{difficulty}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {aiQuestion && (
          <Card className="mb-6 animate-scale-in border border-border/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold text-card-foreground flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-destructive animate-pulse' : 'bg-muted'}`}></div>
                  <span>Interview Question</span>
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="text-xs">
                    {selectedRole}
                  </Badge>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {difficulty}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                Take your time and answer naturally. You have 60 seconds to record your response.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-premium/10 border border-primary/20 p-6 rounded-lg">
                <p className="text-lg font-medium text-card-foreground leading-relaxed">{aiQuestion}</p>
              </div>

              {/* Recording Timer */}
              {(isRecording || hasRecorded) && (
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-lg font-mono font-bold text-card-foreground">
                      {formatTime(recordingTime)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / {formatTime(60)}
                    </span>
                  </div>
                  <Progress 
                    value={(recordingTime / 60) * 100} 
                    className="w-full max-w-xs mx-auto"
                  />
                </div>
              )}

              <div className="text-center space-y-4">
                {!isRecording && !hasRecorded && !isAnalyzing && (
                  <Button 
                    onClick={handleStartRecording}
                    disabled={!selectedRole || !aiQuestion}
                    size="lg"
                    className="w-40 h-40 rounded-full bg-gradient-to-br from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
                      <span className="text-lg font-semibold">Start</span>
                    </div>
                  </Button>
                )}

                {isRecording && (
                  <div className="space-y-4">
                    <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-destructive to-destructive/80 flex items-center justify-center animate-pulse-glow border-4 border-destructive/20">
                      <div className="flex flex-col items-center space-y-2">
                        <Mic className="w-8 h-8 text-primary-foreground animate-pulse" />
                        <span className="text-primary-foreground font-semibold">Recording</span>
                      </div>
                    </div>
                    <Button 
                      onClick={handleStopRecording}
                      variant="outline"
                      size="lg"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <MicOff className="w-5 h-5 mr-2" />
                      Stop Recording
                    </Button>
                  </div>
                )}

                {hasRecorded && !showFeedback && !isAnalyzing && (
                  <div className="space-y-4">
                    <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-success to-success/80 flex items-center justify-center shadow-lg">
                      <div className="flex flex-col items-center space-y-2">
                        <Trophy className="w-8 h-8 text-success-foreground" />
                        <span className="text-success-foreground font-semibold">Complete</span>
                      </div>
                    </div>
                    <p className="text-lg font-medium text-success">Recording Complete!</p>
                    <div className="flex space-x-3 justify-center">
                      <Button onClick={handleRetry} variant="outline" size="lg">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Try Again
                      </Button>
                      <Button onClick={handleSubmit} size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Submit for Analysis
                      </Button>
                    </div>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="space-y-4">
                    <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg animate-pulse">
                      <div className="flex flex-col items-center space-y-2">
                        <BarChart3 className="w-8 h-8 text-primary-foreground animate-pulse" />
                        <span className="text-primary-foreground font-semibold">Analyzing</span>
                      </div>
                    </div>
                    <p className="text-lg font-medium text-primary">AI is analyzing your response...</p>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feedback Section */}
        {showFeedback && enhancedFeedback && (
          <Card className="mb-6 animate-fade-in border border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-card-foreground flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-warning" />
                <span>AI Performance Analysis</span>
              </CardTitle>
              <CardDescription>
                Detailed feedback on your interview response compared to the ideal answer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Score */}
              <div className="text-center bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-lg border border-primary/20">
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(enhancedFeedback.overallScore)}`}>
                      {enhancedFeedback.overallScore}
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>
                  <div className="text-6xl">
                    <Badge variant={getScoreBadgeVariant(enhancedFeedback.overallScore)} className="text-lg px-4 py-2">
                      {enhancedFeedback.overallScore >= 80 ? 'Excellent' : 
                       enhancedFeedback.overallScore >= 60 ? 'Good' : 'Needs Work'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Voice Analysis Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-lg border border-border/50 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Tone</div>
                  <div className="text-2xl font-bold text-primary">{enhancedFeedback.tone || 'N/A'}</div>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border/50 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Clarity</div>
                  <div className="text-2xl font-bold text-primary">{enhancedFeedback.clarity || 'N/A'}</div>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border/50 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Pronunciation</div>
                  <div className="text-2xl font-bold text-primary">{enhancedFeedback.pronunciation || 'N/A'}</div>
                </div>
              </div>

              {/* Your Answer vs Ideal Answer */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-card-foreground flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-primary" />
                    <span>Your Answer</span>
                  </h4>
                  <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                    <p className="text-sm text-card-foreground">{enhancedFeedback.userAnswer || 'Audio transcribed and analyzed'}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-card-foreground flex items-center space-x-2">
                    <Target className="w-4 h-4 text-success" />
                    <span>Ideal Answer</span>
                  </h4>
                  <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                    <p className="text-sm text-card-foreground">{aiAnswer}</p>
                  </div>
                </div>
              </div>

              {/* Feedback Sections */}
              <div className="space-y-4">
                {enhancedFeedback.feedback && (
                  <div className="p-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg border border-accent/20">
                    <h4 className="font-semibold text-card-foreground mb-3 flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-accent" />
                      <span>AI Feedback</span>
                    </h4>
                    <p className="text-sm text-card-foreground leading-relaxed">{enhancedFeedback.feedback}</p>
                  </div>
                )}

                {enhancedFeedback.corrections && (
                  <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                    <h4 className="font-semibold text-card-foreground mb-3 flex items-center space-x-2">
                      <Target className="w-4 h-4 text-warning" />
                      <span>Suggested Improvements</span>
                    </h4>
                    <p className="text-sm text-card-foreground leading-relaxed">{enhancedFeedback.corrections}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button onClick={handleRetry} variant="outline" className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={handleNextQuestion} className="flex-1">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Next Question
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pro Tips */}
        <Card className="mb-6 animate-fade-in border border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              <span>Pro Tips for Better Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Use the STAR method (Situation, Task, Action, Result) for behavioral questions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Speak clearly and at a moderate pace</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Make eye contact with the camera</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <span>Use specific examples from your experience</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <span>Practice good posture and confident body language</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <span>Take a moment to think before answering</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default InterviewTrainer;