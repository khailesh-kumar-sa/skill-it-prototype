
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
      colors: "from-primary to-primary-foreground",
      shadowColor: "shadow-brand"
    },
    {
      title: "Skill Swap",
      description: "Exchange skills with peers in our community",
      icon: "🔄",
      path: "/skill-swap",
      colors: "from-accent to-accent-foreground",
      shadowColor: "shadow-accent"
    },
    {
      title: "AI Interview Trainer",
      description: "Practice interviews with AI-powered feedback",
      icon: "🎤",
      path: "/interview-trainer",
      colors: "from-success to-success-foreground",
      shadowColor: "shadow-elevation"
    },
    {
      title: "My Profile",
      description: "Manage your skills and preferences",
      icon: "👤",
      path: "/profile",
      colors: "from-premium to-premium-foreground",
      shadowColor: "shadow-premium"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-premium/5 pb-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full animate-float"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 bg-accent rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-premium rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 p-6">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg animate-glow">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Hi there! 👋</h1>
              <p className="text-muted-foreground text-lg">What would you like to explore today?</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <Card className="border-0 shadow-xl overflow-hidden animate-scale-in bg-gradient-to-r from-primary to-accent">
            <CardContent className="p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold mb-2">Your Progress</h3>
                  <p className="text-white/80">3 skills matched • 2 pending requests</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">78%</div>
                  <div className="text-sm text-white/80">Profile Complete</div>
                </div>
              </div>
              <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.path}
              className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden animate-scale-in bg-card/80 backdrop-blur-sm hover:scale-105"
              style={{ 
                animationDelay: `${index * 150}ms`,
                boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.1)'
              }}
              onClick={() => navigate(feature.path)}
            >
              <div className={`h-1 bg-gradient-to-r ${feature.colors} group-hover:h-2 transition-all duration-300`} />
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.colors} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Card className="bg-gradient-to-r from-warning/10 to-warning/20 border-warning/30 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center">
                  <span className="text-xl">💡</span>
                </div>
                <p className="text-warning-foreground font-semibold text-lg">Complete your career test to get personalized skill recommendations!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;
