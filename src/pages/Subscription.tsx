
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const Subscription = () => {
  const navigate = useNavigate();

  const handleSkip = () => {
    navigate('/home');
  };

  const handleSubscribe = (plan: string) => {
    console.log(`Selected plan: ${plan}`);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-blue-100 text-lg">Unlock your full potential with our AI-powered features</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-gray-200 bg-white/95 backdrop-blur hover:shadow-xl transition-all duration-300 animate-scale-in">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800">Free Plan</CardTitle>
              <CardDescription className="text-lg">Perfect for getting started</CardDescription>
              <div className="text-3xl font-bold text-blue-600 mt-2">$0<span className="text-lg text-gray-500">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Basic Career Assessment</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Limited Skill Swaps (5/month)</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Community Access</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Basic Profile</span>
                </div>
              </div>
              <Button 
                onClick={() => handleSubscribe('free')}
                variant="outline" 
                className="w-full h-12 text-lg font-semibold hover:bg-blue-50 border-2 hover:border-blue-200"
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-blue-50 hover:shadow-xl transition-all duration-300 animate-scale-in relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                MOST POPULAR
              </span>
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800">Premium Plan</CardTitle>
              <CardDescription className="text-lg">AI-powered career advancement</CardDescription>
              <div className="text-3xl font-bold text-purple-600 mt-2">$19<span className="text-lg text-gray-500">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Advanced AI Career Analysis</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Unlimited Skill Swaps</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>AI Interview Trainer</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Voice Feedback Analysis</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Priority Support</span>
                </div>
              </div>
              <Button 
                onClick={() => handleSubscribe('premium')}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={handleSkip}
            variant="ghost" 
            className="text-white hover:text-blue-100 text-lg underline hover:no-underline"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
