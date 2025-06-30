
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";
import { toast } from "@/hooks/use-toast";

const InterviewTrainer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    "Tell me about yourself and your career journey.",
    "Why should we hire you for this position?",
    "What is your greatest strength?",
    "Describe a challenging situation you faced and how you handled it.",
    "Where do you see yourself in 5 years?",
    "Why do you want to work for our company?",
    "What is your biggest weakness?",
    "Tell me about a time you failed and what you learned."
  ];

  const mockFeedback = {
    fluency: 4,
    relevance: 3,
    confidence: 4,
    clarity: 3,
    suggestions: [
      "Try to be more specific with examples from your experience",
      "Maintain eye contact and confident posture",
      "Structure your answer with the STAR method (Situation, Task, Action, Result)",
      "Practice speaking more slowly and clearly"
    ]
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording Started",
      description: "Speak clearly and take your time",
    });
    
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);
      toast({
        title: "Recording Complete",
        description: "Click Submit to get your feedback",
      });
    }, 3000);
  };

  const handleSubmit = () => {
    setShowFeedback(true);
    toast({
      title: "Analysis Complete!",
      description: "Here's your AI-powered feedback",
    });
  };

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
    setHasRecorded(false);
    setShowFeedback(false);
  };

  const handleRetry = () => {
    setHasRecorded(false);
    setShowFeedback(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-20">
      <div className="p-6">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">AI Interview Trainer</h1>
          <p className="text-gray-600">Practice and improve your interview skills</p>
        </div>

        <Card className="mb-6 animate-scale-in">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold text-gray-800">Interview Question</CardTitle>
              <span className="text-sm text-gray-600">
                {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <CardDescription>Take your time and answer naturally</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
              <p className="text-lg font-medium">{questions[currentQuestion]}</p>
            </div>

            <div className="text-center space-y-4">
              {!isRecording && !hasRecorded && (
                <Button 
                  onClick={handleStartRecording}
                  size="lg"
                  className="w-32 h-32 rounded-full bg-red-500 hover:bg-red-600 text-white text-xl"
                >
                  🎤 Record
                </Button>
              )}

              {isRecording && (
                <div className="space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                    <span className="text-white text-4xl">🎤</span>
                  </div>
                  <p className="text-lg font-medium text-red-600">Recording...</p>
                </div>
              )}

              {hasRecorded && !showFeedback && (
                <div className="space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-4xl">✓</span>
                  </div>
                  <p className="text-lg font-medium text-green-600">Recording Complete!</p>
                  <div className="flex space-x-3 justify-center">
                    <Button onClick={handleRetry} variant="outline">
                      Record Again
                    </Button>
                    <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-600 to-purple-600">
                      Submit for Analysis
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {showFeedback && (
          <Card className="mb-6 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">AI Feedback 🤖</CardTitle>
              <CardDescription>Here's how you performed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Fluency</span>
                    <div className="flex">{renderStars(mockFeedback.fluency)}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Relevance</span>
                    <div className="flex">{renderStars(mockFeedback.relevance)}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Confidence</span>
                    <div className="flex">{renderStars(mockFeedback.confidence)}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Clarity</span>
                    <div className="flex">{renderStars(mockFeedback.clarity)}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-gray-800">💡 Improvement Suggestions:</h4>
                <div className="space-y-2">
                  {mockFeedback.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <span className="text-gray-700 text-sm">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleRetry} variant="outline" className="flex-1">
                  Try Again
                </Button>
                <Button onClick={handleNextQuestion} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                  Next Question
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-blue-800 text-sm">
              💡 <strong>Pro Tip:</strong> Practice regularly to build confidence. Focus on one improvement area at a time for better results.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default InterviewTrainer;
