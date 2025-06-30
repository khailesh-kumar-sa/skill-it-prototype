
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import BottomNavigation from "@/components/BottomNavigation";
import { toast } from "@/hooks/use-toast";

const CareerTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState('');

  const questions = [
    {
      question: "What type of work environment motivates you most?",
      options: [
        "Collaborative team settings",
        "Independent, quiet spaces",
        "Fast-paced, dynamic environments",
        "Structured, organized workplaces"
      ]
    },
    {
      question: "Which skill would you most like to develop?",
      options: [
        "Leadership and management",
        "Technical and analytical",
        "Creative and artistic",
        "Communication and interpersonal"
      ]
    },
    {
      question: "What drives you most in your career?",
      options: [
        "Making a positive impact",
        "Solving complex problems",
        "Financial security",
        "Recognition and status"
      ]
    },
    {
      question: "How do you prefer to learn new skills?",
      options: [
        "Hands-on practice",
        "Reading and research",
        "Collaborative learning",
        "Structured courses"
      ]
    },
    {
      question: "What's your ideal work-life balance?",
      options: [
        "Flexible hours, remote work",
        "Standard 9-5 schedule",
        "Project-based with breaks",
        "Intensive periods with time off"
      ]
    }
  ];

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      toast({
        title: "Please select an answer",
        description: "Choose an option before proceeding",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    // Mock AI result based on answers
    const mockResults = [
      "Software Developer - Your analytical thinking and problem-solving skills make you perfect for creating innovative solutions.",
      "Project Manager - Your leadership qualities and organizational skills indicate strong project management potential.",
      "UX Designer - Your creative mindset and user-focused approach align with user experience design.",
      "Data Analyst - Your attention to detail and analytical nature suit data analysis and insights.",
      "Marketing Specialist - Your communication skills and creativity are ideal for marketing roles."
    ];
    
    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
    setResult(randomResult);
    setShowResult(true);
    
    toast({
      title: "Assessment Complete!",
      description: "Your career recommendations are ready",
    });
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setResult('');
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-20">
        <div className="p-6">
          <Card className="mb-6 animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">Your Career Match! 🎯</CardTitle>
              <CardDescription>Based on your responses, here's what we recommend:</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Recommended Career Path</h3>
                <p className="text-lg">{result}</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800">Next Steps:</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Explore skill swaps to develop relevant skills</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span>Practice interviews for your target role</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Update your profile with new insights</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button onClick={handleRetake} variant="outline" className="flex-1">
                  Retake Test
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                  Save Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-20">
      <div className="p-6">
        <div className="mb-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Career Assessment</h1>
            <span className="text-sm font-medium text-gray-600">
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="mb-6 animate-scale-in">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">
              {questions[currentQuestion].question}
            </CardTitle>
            <CardDescription>Choose the option that best describes you</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={answers[currentQuestion] || ''} 
              onValueChange={handleAnswerSelect}
              className="space-y-4"
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-700">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            variant="outline"
            disabled={currentQuestion === 0}
            className="flex-1 mr-2"
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            className="flex-1 ml-2 bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default CareerTest;
