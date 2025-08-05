
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
  const [result, setResult] = useState<any[]>([]);

  const questions = [
    {
      question: "What type of technology interaction appeals to you most?",
      options: [
        "Building software applications and systems",
        "Analyzing data and creating insights",
        "Designing user interfaces and experiences",
        "Managing technology teams and projects"
      ]
    },
    {
      question: "Which work environment energizes you?",
      options: [
        "Fast-paced startup culture with innovation",
        "Stable corporate environment with clear processes",
        "Remote/hybrid with flexible schedules",
        "Client-facing roles with constant interaction"
      ]
    },
    {
      question: "What type of problem-solving do you enjoy most?",
      options: [
        "Writing code to solve technical challenges",
        "Finding patterns in large datasets",
        "Troubleshooting system issues and bugs",
        "Optimizing business processes with technology"
      ]
    },
    {
      question: "How do you prefer to communicate your work?",
      options: [
        "Through code documentation and technical writing",
        "Visual presentations and dashboards",
        "Direct client communication and support",
        "Team meetings and project updates"
      ]
    },
    {
      question: "What motivates you most in your career?",
      options: [
        "Creating innovative solutions that impact users",
        "Advancing to leadership and strategic roles",
        "Achieving financial stability and growth",
        "Continuous learning and skill development"
      ]
    },
    {
      question: "Which IT domain interests you most?",
      options: [
        "Software development and programming",
        "Data science and artificial intelligence",
        "Cybersecurity and system protection",
        "Cloud computing and infrastructure"
      ]
    },
    {
      question: "How do you handle high-pressure situations?",
      options: [
        "I thrive under pressure and deliver quickly",
        "I prefer steady, planned approaches",
        "I work best with team support",
        "I like structured escalation processes"
      ]
    },
    {
      question: "What's your preferred learning style for technology?",
      options: [
        "Hands-on coding and practical projects",
        "Online courses and certifications",
        "Mentorship and team collaboration",
        "Reading documentation and research"
      ]
    },
    {
      question: "Which career progression appeals to you?",
      options: [
        "Technical expert and architect roles",
        "Management and leadership positions",
        "Entrepreneurship and business ownership",
        "Consulting and advisory roles"
      ]
    },
    {
      question: "What's your ideal work-life balance in IT?",
      options: [
        "Flexible remote work with project deadlines",
        "Standard office hours with stability",
        "Intensive project phases with breaks",
        "24/7 support roles with rotating schedules"
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

  const analyzeAnswers = () => {
    // Advanced career matching based on answer patterns
    const careerProfiles = {
      // Entry Level IT Careers
      "BPO Technical Support": {
        description: "Perfect entry point into IT with customer service skills. Handle technical queries and provide software/hardware support.",
        salary: "₹2-4 LPA",
        growth: "Can progress to Senior Support → Team Lead → Operations Manager",
        skills: ["Communication", "Basic Troubleshooting", "Customer Service"]
      },
      "Junior Software Developer": {
        description: "Start your coding journey building web applications and software solutions.",
        salary: "₹3-6 LPA", 
        growth: "Senior Developer → Tech Lead → Engineering Manager → CTO",
        skills: ["Programming", "Problem Solving", "Version Control"]
      },
      "IT Help Desk Specialist": {
        description: "Provide technical support and resolve IT issues for organizations.",
        salary: "₹2.5-4 LPA",
        growth: "Senior Specialist → IT Manager → IT Director",
        skills: ["Hardware/Software Troubleshooting", "Customer Service", "ITIL"]
      },
      
      // Mid-Level IT Careers
      "Full Stack Developer": {
        description: "Build complete web applications from frontend to backend with modern technologies.",
        salary: "₹6-12 LPA",
        growth: "Senior Developer → Solution Architect → Technical Director",
        skills: ["React/Angular", "Node.js", "Databases", "Cloud Services"]
      },
      "Data Analyst": {
        description: "Transform raw data into actionable business insights using analytics tools.",
        salary: "₹4-8 LPA",
        growth: "Senior Analyst → Data Scientist → Chief Data Officer",
        skills: ["SQL", "Python/R", "Tableau/PowerBI", "Statistics"]
      },
      "DevOps Engineer": {
        description: "Bridge development and operations, managing CI/CD pipelines and infrastructure.",
        salary: "₹6-15 LPA",
        growth: "Senior DevOps → Platform Engineer → Infrastructure Architect",
        skills: ["Docker", "Kubernetes", "AWS/Azure", "Automation"]
      },
      "Cybersecurity Analyst": {
        description: "Protect organizations from cyber threats and ensure data security.",
        salary: "₹5-10 LPA",
        growth: "Security Engineer → Security Architect → CISO",
        skills: ["Network Security", "Ethical Hacking", "Risk Assessment"]
      },
      
      // Senior/Specialized IT Careers
      "Solution Architect": {
        description: "Design complex software solutions and guide technical decision-making.",
        salary: "₹15-25 LPA",
        growth: "Principal Architect → VP Engineering → CTO",
        skills: ["System Design", "Architecture Patterns", "Technology Strategy"]
      },
      "Data Scientist": {
        description: "Use machine learning and AI to solve complex business problems.",
        salary: "₹8-20 LPA",
        growth: "Senior Data Scientist → ML Engineer → Chief AI Officer",
        skills: ["Machine Learning", "Python", "Deep Learning", "Statistics"]
      },
      "Cloud Architect": {
        description: "Design and implement scalable cloud infrastructure solutions.",
        salary: "₹12-25 LPA",
        growth: "Principal Cloud Architect → Cloud Solutions Director",
        skills: ["AWS/Azure/GCP", "Microservices", "Scalability", "Cost Optimization"]
      },
      "Product Manager (Tech)": {
        description: "Drive product strategy and work with engineering teams to build user-centric solutions.",
        salary: "₹10-25 LPA",
        growth: "Senior PM → VP Product → Chief Product Officer",
        skills: ["Product Strategy", "User Research", "Agile", "Technical Knowledge"]
      },
      
      // Leadership & Executive IT Careers
      "Engineering Manager": {
        description: "Lead technical teams while maintaining hands-on technical involvement.",
        salary: "₹15-30 LPA",
        growth: "Director Engineering → VP Engineering → CTO",
        skills: ["Team Leadership", "Technical Strategy", "Project Management"]
      },
      "Chief Technology Officer": {
        description: "Set technology vision and strategy for the entire organization.",
        salary: "₹25-60 LPA",
        growth: "Founder/Co-founder → Board positions",
        skills: ["Technology Vision", "Strategic Planning", "Team Building"]
      },
      "Tech Entrepreneur": {
        description: "Build and scale your own technology company or startup.",
        salary: "Variable (₹0-∞)",
        growth: "Serial Entrepreneur → Investor → Industry Leader",
        skills: ["Innovation", "Business Strategy", "Leadership", "Risk Taking"]
      },
      
      // Consulting & Freelance IT Careers
      "IT Consultant": {
        description: "Provide expert technology advice to multiple organizations.",
        salary: "₹8-20 LPA",
        growth: "Senior Consultant → Partner → Boutique Firm Owner",
        skills: ["Domain Expertise", "Communication", "Business Acumen"]
      },
      "Freelance Developer": {
        description: "Work independently on projects with flexibility and diverse challenges.",
        salary: "₹5-25 LPA",
        growth: "Premium Freelancer → Digital Agency Owner",
        skills: ["Self-Management", "Client Relations", "Multiple Technologies"]
      }
    };

    // Smart matching logic based on answer patterns
    let scores: Record<string, number> = {};
    
    // Initialize scores
    Object.keys(careerProfiles).forEach(career => {
      scores[career] = 0;
    });

    // Question 1: Technology interaction
    if (answers[0] === "Building software applications and systems") {
      scores["Junior Software Developer"] += 3;
      scores["Full Stack Developer"] += 3;
      scores["Solution Architect"] += 2;
    } else if (answers[0] === "Analyzing data and creating insights") {
      scores["Data Analyst"] += 3;
      scores["Data Scientist"] += 3;
    } else if (answers[0] === "Designing user interfaces and experiences") {
      scores["Full Stack Developer"] += 2;
      scores["Product Manager (Tech)"] += 2;
    } else if (answers[0] === "Managing technology teams and projects") {
      scores["Engineering Manager"] += 3;
      scores["Product Manager (Tech)"] += 3;
    }

    // Question 2: Work environment
    if (answers[1] === "Fast-paced startup culture with innovation") {
      scores["Tech Entrepreneur"] += 3;
      scores["Full Stack Developer"] += 2;
    } else if (answers[1] === "Stable corporate environment with clear processes") {
      scores["BPO Technical Support"] += 2;
      scores["IT Help Desk Specialist"] += 2;
    } else if (answers[1] === "Client-facing roles with constant interaction") {
      scores["IT Consultant"] += 3;
      scores["BPO Technical Support"] += 2;
    }

    // Question 6: IT domain interest
    if (answers[5] === "Software development and programming") {
      scores["Junior Software Developer"] += 3;
      scores["Full Stack Developer"] += 3;
    } else if (answers[5] === "Data science and artificial intelligence") {
      scores["Data Scientist"] += 3;
      scores["Data Analyst"] += 2;
    } else if (answers[5] === "Cybersecurity and system protection") {
      scores["Cybersecurity Analyst"] += 3;
    } else if (answers[5] === "Cloud computing and infrastructure") {
      scores["Cloud Architect"] += 3;
      scores["DevOps Engineer"] += 3;
    }

    // Question 9: Career progression
    if (answers[8] === "Technical expert and architect roles") {
      scores["Solution Architect"] += 3;
      scores["Cloud Architect"] += 3;
    } else if (answers[8] === "Management and leadership positions") {
      scores["Engineering Manager"] += 3;
      scores["Chief Technology Officer"] += 2;
    } else if (answers[8] === "Entrepreneurship and business ownership") {
      scores["Tech Entrepreneur"] += 3;
    } else if (answers[8] === "Consulting and advisory roles") {
      scores["IT Consultant"] += 3;
    }

    // Find top 3 careers
    const sortedCareers = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    return sortedCareers.map(([career, score]) => ({
      title: career,
      ...careerProfiles[career]
    }));
  };

  const handleSubmit = () => {
    const careerMatches = analyzeAnswers();
    setResult(careerMatches);
    setShowResult(true);
    
    toast({
      title: "Assessment Complete!",
      description: "Your personalized IT career recommendations are ready",
    });
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setResult([]);
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
              {result.map((career, index) => (
                <div key={index} className={`p-6 rounded-lg border-2 ${index === 0 ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-xl font-bold ${index === 0 ? 'text-white' : 'text-gray-800'}`}>
                      {index === 0 ? '🏆 Top Match: ' : `${index === 1 ? '🥈 ' : '🥉 '}Alternative: `}
                      {career.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${index === 0 ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>
                      {career.salary}
                    </span>
                  </div>
                  
                  <p className={`mb-4 ${index === 0 ? 'text-white/90' : 'text-gray-600'}`}>
                    {career.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className={`font-semibold mb-2 ${index === 0 ? 'text-white' : 'text-gray-700'}`}>Career Growth Path:</h4>
                      <p className={`text-sm ${index === 0 ? 'text-white/80' : 'text-gray-600'}`}>{career.growth}</p>
                    </div>
                    
                    <div>
                      <h4 className={`font-semibold mb-2 ${index === 0 ? 'text-white' : 'text-gray-700'}`}>Key Skills Required:</h4>
                      <div className="flex flex-wrap gap-2">
                        {career.skills.map((skill, skillIndex) => (
                          <span 
                            key={skillIndex} 
                            className={`px-3 py-1 rounded-full text-sm ${index === 0 ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-3">🚀 Next Steps to Accelerate Your Career:</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                    <div>
                      <p className="font-medium text-gray-800">Start Skill Development</p>
                      <p className="text-sm text-gray-600">Use our Skill Swap feature to learn the key skills for your target role</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                    <div>
                      <p className="font-medium text-gray-800">Practice Interviews</p>
                      <p className="text-sm text-gray-600">Use our AI Interview Trainer to prepare for your target role interviews</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                    <div>
                      <p className="font-medium text-gray-800">Build Your Network</p>
                      <p className="text-sm text-gray-600">Connect with professionals in your target field through our platform</p>
                    </div>
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
