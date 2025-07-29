
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import BottomNavigation from "@/components/BottomNavigation";
import { toast } from "@/hooks/use-toast";
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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [category, setCategory] = useState('general');

  const questionCategories = {
    general: [
      "Tell me about yourself and your career journey.",
      "Why should we hire you for this position?",
      "What is your greatest strength?",
      "Describe a challenging situation you faced and how you handled it.",
      "Where do you see yourself in 5 years?",
      "Why do you want to work for our company?",
      "What is your biggest weakness?",
      "Tell me about a time you failed and what you learned."
    ],
    technical: [
      "Explain a complex technical concept to a non-technical person.",
      "How do you approach debugging a difficult problem?",
      "Describe your experience with version control systems.",
      "How do you stay updated with new technologies?",
      "Walk me through your development process.",
      "How do you handle code reviews?",
      "Describe a time you optimized performance.",
      "How do you ensure code quality?"
    ],
    behavioral: [
      "Tell me about a time you disagreed with your manager.",
      "Describe a situation where you had to work with a difficult team member.",
      "How do you handle tight deadlines?",
      "Tell me about a time you took initiative.",
      "Describe a project you're particularly proud of.",
      "How do you handle feedback and criticism?",
      "Tell me about a time you had to learn something quickly.",
      "Describe a situation where you failed and how you recovered."
    ]
  };

  const questions = questionCategories[category as keyof typeof questionCategories];

  const difficultySettings = {
    beginner: { time: 60, minScore: 60 },
    intermediate: { time: 90, minScore: 70 },
    advanced: { time: 120, minScore: 80 }
  };

  const enhancedFeedback = {
    overallScore: 78,
    fluency: 4,
    relevance: 3,
    confidence: 4,
    clarity: 3,
    pacing: 4,
    wordChoice: 3,
    structure: 4,
    eyeContact: 3,
    duration: recordingTime,
    suggestions: [
      {
        category: "Content",
        tip: "Try to be more specific with examples from your experience using the STAR method"
      },
      {
        category: "Delivery", 
        tip: "Maintain eye contact and confident posture throughout your response"
      },
      {
        category: "Structure",
        tip: "Structure your answer with clear beginning, middle, and end"
      },
      {
        category: "Timing",
        tip: "Practice speaking more slowly and clearly for better comprehension"
      }
    ],
    strengths: [
      "Strong confidence in delivery",
      "Good use of professional vocabulary",
      "Appropriate response length"
    ],
    improvements: [
      "Add more specific examples",
      "Improve response structure",
      "Work on pacing"
    ]
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

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    toast({
      title: "🎤 Recording Started",
      description: "Speak clearly and confidently. Good luck!",
    });
    
    // Simulate realistic recording duration
    const maxTime = difficultySettings[difficulty].time;
    setTimeout(() => {
      if (isRecording) {
        setIsRecording(false);
        setHasRecorded(true);
        toast({
          title: "⏹️ Recording Complete",
          description: "Great job! Click Submit for AI analysis",
        });
      }
    }, maxTime * 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecorded(true);
    toast({
      title: "⏹️ Recording Stopped",
      description: "Click Submit for AI analysis or try again",
    });
  };

  const handleSubmit = () => {
    setIsAnalyzing(true);
    toast({
      title: "🤖 AI Analysis Starting",
      description: "Analyzing your response...",
    });
    
    // Simulate AI processing time
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowFeedback(true);
      toast({
        title: "✅ Analysis Complete!",
        description: `Overall Score: ${enhancedFeedback.overallScore}/100`,
      });
    }, 3000);
  };

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
    setHasRecorded(false);
    setShowFeedback(false);
    setRecordingTime(0);
  };

  const handleRetry = () => {
    setHasRecorded(false);
    setShowFeedback(false);
    setRecordingTime(0);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-warning' : 'text-muted'}`}>
        ⭐
      </span>
    ));
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
          <p className="text-muted-foreground">Practice and improve your interview skills with AI-powered feedback</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">Category</label>
                <div className="flex space-x-2">
                  {Object.keys(questionCategories).map((cat) => (
                    <Button
                      key={cat}
                      variant={category === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategory(cat)}
                      className="capitalize"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">Difficulty</label>
                <div className="flex space-x-2">
                  {Object.keys(difficultySettings).map((diff) => (
                    <Button
                      key={diff}
                      variant={difficulty === diff ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDifficulty(diff as typeof difficulty)}
                      className="capitalize"
                    >
                      {diff}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">Audio</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="flex items-center space-x-2"
                >
                  {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{audioEnabled ? 'Enabled' : 'Disabled'}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 animate-scale-in border border-border/50">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-card-foreground flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-destructive animate-pulse' : 'bg-muted'}`}></div>
                <span>Interview Question</span>
              </CardTitle>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-xs">
                  {currentQuestion + 1} of {questions.length}
                </Badge>
                <Badge variant="secondary" className="text-xs capitalize">
                  {difficulty}
                </Badge>
              </div>
            </div>
            <CardDescription>
              Take your time and answer naturally. Target time: {difficultySettings[difficulty].time}s
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-premium/10 border border-primary/20 p-6 rounded-lg">
              <p className="text-lg font-medium text-card-foreground leading-relaxed">{questions[currentQuestion]}</p>
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
                    / {formatTime(difficultySettings[difficulty].time)}
                  </span>
                </div>
                <Progress 
                  value={(recordingTime / difficultySettings[difficulty].time) * 100} 
                  className="w-full max-w-xs mx-auto"
                />
              </div>
            )}

            <div className="text-center space-y-4">
              {!isRecording && !hasRecorded && !isAnalyzing && (
                <Button 
                  onClick={handleStartRecording}
                  size="lg"
                  className="w-40 h-40 rounded-full bg-gradient-to-br from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
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
                      Get AI Feedback
                    </Button>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="space-y-4">
                  <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse-glow">
                    <div className="flex flex-col items-center space-y-2">
                      <BarChart3 className="w-8 h-8 text-primary-foreground animate-pulse" />
                      <span className="text-primary-foreground font-semibold">Analyzing</span>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-primary">AI is analyzing your response...</p>
                  <div className="text-sm text-muted-foreground">
                    <p>• Checking fluency and clarity</p>
                    <p>• Analyzing content relevance</p>
                    <p>• Evaluating confidence level</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {showFeedback && (
          <Card className="mb-6 animate-fade-in border border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-card-foreground flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-primary-foreground" />
                </div>
                <span>AI Feedback Report</span>
              </CardTitle>
              <CardDescription>Detailed analysis of your interview performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Overall Score */}
              <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Trophy className="w-6 h-6 text-primary" />
                  <span className="text-lg font-semibold text-card-foreground">Overall Score</span>
                </div>
                <div className={`text-4xl font-bold ${getScoreColor(enhancedFeedback.overallScore)} mb-2`}>
                  {enhancedFeedback.overallScore}/100
                </div>
                <Badge variant={getScoreBadgeVariant(enhancedFeedback.overallScore)} className="text-sm">
                  {enhancedFeedback.overallScore >= 80 ? 'Excellent' : 
                   enhancedFeedback.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Fluency</div>
                  <div className="flex justify-center mb-1">{renderStars(enhancedFeedback.fluency)}</div>
                  <div className="text-xs text-muted-foreground">{enhancedFeedback.fluency}/5</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Relevance</div>
                  <div className="flex justify-center mb-1">{renderStars(enhancedFeedback.relevance)}</div>
                  <div className="text-xs text-muted-foreground">{enhancedFeedback.relevance}/5</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Confidence</div>
                  <div className="flex justify-center mb-1">{renderStars(enhancedFeedback.confidence)}</div>
                  <div className="text-xs text-muted-foreground">{enhancedFeedback.confidence}/5</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Clarity</div>
                  <div className="flex justify-center mb-1">{renderStars(enhancedFeedback.clarity)}</div>
                  <div className="text-xs text-muted-foreground">{enhancedFeedback.clarity}/5</div>
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-3">
                <h4 className="font-bold text-card-foreground flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-success" />
                  <span>Strengths</span>
                </h4>
                <div className="space-y-2">
                  {enhancedFeedback.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-success/5 border border-success/20 rounded-lg">
                      <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                      <span className="text-card-foreground text-sm font-medium">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div className="space-y-3">
                <h4 className="font-bold text-card-foreground flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-warning" />
                  <span>AI Recommendations</span>
                </h4>
                <div className="space-y-3">
                  {enhancedFeedback.suggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {suggestion.category}
                        </Badge>
                      </div>
                      <p className="text-card-foreground text-sm">{suggestion.tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Stats */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground">Response Time</div>
                  <div className="text-lg font-bold text-card-foreground">{formatTime(enhancedFeedback.duration)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground">Target Time</div>
                  <div className="text-lg font-bold text-card-foreground">{formatTime(difficultySettings[difficulty].time)}</div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleRetry} variant="outline" className="flex-1" size="lg">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={handleNextQuestion} className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" size="lg">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Next Question
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-card-foreground font-semibold mb-2">💡 Pro Tips for Better Interviews</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Practice the STAR method (Situation, Task, Action, Result)</li>
                  <li>• Record yourself regularly to track improvement</li>
                  <li>• Focus on one skill at a time for better results</li>
                  <li>• Research common questions for your industry</li>
                </ul>
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
