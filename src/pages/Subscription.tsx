
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

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-8">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200 bg-white/95 backdrop-blur hover:shadow-xl transition-all duration-300 animate-scale-in">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-gray-800">Free Plan</CardTitle>
              <CardDescription className="text-sm">Best for college students</CardDescription>
              <div className="text-2xl font-bold text-blue-600 mt-2">₹0<span className="text-sm text-gray-500">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">AI Career Assessment</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Limited Skill Swaps (5/month)</span>
                </div>
                <div className="flex items-center text-red-500">
                  <span className="text-sm ml-6">No Interview Training Access</span>
                </div>
              </div>
              <Button 
                onClick={() => handleSubscribe('free')}
                variant="outline" 
                className="w-full h-10 text-sm font-semibold hover:bg-blue-50 border-2 hover:border-blue-200"
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-2 border-orange-400 bg-gradient-to-br from-orange-50 to-blue-50 hover:shadow-xl transition-all duration-300 animate-scale-in relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-orange-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                MOST POPULAR
              </span>
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-gray-800">Premium Plan</CardTitle>
              <CardDescription className="text-sm">Best for final year students & freshers</CardDescription>
              <div className="text-2xl font-bold text-orange-600 mt-2">₹500<span className="text-sm text-gray-500">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">AI Career Assessment</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Unlimited Skill Swaps</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">AI Interview Trainer (5/month)</span>
                </div>
              </div>
              <Button 
                onClick={() => handleSubscribe('premium')}
                className="w-full h-10 text-sm font-semibold bg-gradient-to-r from-orange-600 to-blue-600 hover:from-orange-700 hover:to-blue-700"
              >
                Start 7-Day Free Trial
              </Button>
            </CardContent>
          </Card>

          {/* Special Plan 1 */}
          <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 hover:shadow-xl transition-all duration-300 animate-scale-in">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-gray-800">Special Plan 1</CardTitle>
              <CardDescription className="text-sm">Best for skilled job seekers</CardDescription>
              <div className="text-2xl font-bold text-purple-600 mt-2">₹250<span className="text-sm text-gray-500">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Unlimited AI Interview Training</span>
                </div>
                <div className="flex items-center text-red-500">
                  <span className="text-sm ml-6">No Career Assessment</span>
                </div>
                <div className="flex items-center text-red-500">
                  <span className="text-sm ml-6">No Skill Swaps</span>
                </div>
              </div>
              <Button 
                onClick={() => handleSubscribe('special1')}
                className="w-full h-10 text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Choose Plan
              </Button>
            </CardContent>
          </Card>

          {/* Special Plan 2 */}
          <Card className="border-2 border-teal-300 bg-gradient-to-br from-teal-50 to-cyan-50 hover:shadow-xl transition-all duration-300 animate-scale-in">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-gray-800">Special Plan 2</CardTitle>
              <CardDescription className="text-sm">Best for working professionals</CardDescription>
              <div className="text-2xl font-bold text-teal-600 mt-2">₹250<span className="text-sm text-gray-500">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Unlimited Skill Swapping</span>
                </div>
                <div className="flex items-center text-red-500">
                  <span className="text-sm ml-6">No Career Assessment</span>
                </div>
                <div className="flex items-center text-red-500">
                  <span className="text-sm ml-6">No Interview Training</span>
                </div>
              </div>
              <Button 
                onClick={() => handleSubscribe('special2')}
                className="w-full h-10 text-sm font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
              >
                Choose Plan
              </Button>
            </CardContent>
          </Card>

          {/* Special Plan 3 */}
          <Card className="border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50 hover:shadow-xl transition-all duration-300 animate-scale-in lg:col-start-2">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-gray-800">Special Plan 3</CardTitle>
              <CardDescription className="text-sm">Best for HR's & employers</CardDescription>
              <div className="text-2xl font-bold text-emerald-600 mt-2">₹150<span className="text-sm text-gray-500">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Dashboard Access</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">View User Skillsets & Profiles</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Talent Discovery</span>
                </div>
              </div>
              <Button 
                onClick={() => handleSubscribe('special3')}
                className="w-full h-10 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              >
                Choose Plan
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
