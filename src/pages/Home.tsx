
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Career Test",
      description: "Discover your ideal career path with AI-powered assessment",
      icon: "🎯",
      path: "/career-test",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Skill Swap",
      description: "Exchange skills with peers in our community",
      icon: "🔄",
      path: "/skill-swap",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "AI Interview Trainer",
      description: "Practice interviews with AI-powered feedback",
      icon: "🎤",
      path: "/interview-trainer",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "My Profile",
      description: "Manage your skills and preferences",
      icon: "👤",
      path: "/profile",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-20">
      <div className="p-6">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hi there! 👋</h1>
          <p className="text-gray-600 text-lg">What would you like to explore today?</p>
        </div>

        <div className="space-y-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg animate-scale-in">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold mb-2">Your Progress</h3>
                  <p className="text-blue-100">3 skills matched • 2 pending requests</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">78%</div>
                  <div className="text-sm text-blue-100">Profile Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <Card 
              key={feature.path}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 overflow-hidden animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(feature.path)}
            >
              <div className={`h-2 bg-gradient-to-r ${feature.gradient}`} />
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{feature.icon}</div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-800">{feature.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-gray-600 text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <p className="text-yellow-800 font-medium">💡 Tip: Complete your career test to get personalized skill recommendations!</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;
