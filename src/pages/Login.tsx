
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    if (email && password) {
      toast({
        title: "Welcome to Skill It!",
        description: "Login successful",
      });
      navigate('/subscription');
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Google Sign-In",
      description: "Mock Google authentication successful",
    });
    navigate('/subscription');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Skill It</h1>
          <p className="text-blue-100">AI Career & Skill Development Platform</p>
        </div>
        
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Welcome to Skill It</CardTitle>
            <CardDescription>Sign in to unlock your career potential</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGoogleLogin}
              variant="outline" 
              className="w-full h-12 text-lg font-semibold hover:bg-red-50 border-2 hover:border-red-200 transition-all duration-200"
            >
              Continue with Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <Button type="submit" className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                Sign In
              </Button>
            </form>
            
            <div className="text-center space-y-2">
              <a href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
              <div className="text-sm text-gray-600">
                Don't have an account? 
                <a href="#" className="text-blue-600 hover:underline ml-1">Create Account</a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
