import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, ArrowRight, Shield, User, Lock } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Demo admin credentials
      if (email === 'admin@skillit.com' && password === 'admin123') {
        toast({
          title: "🛡️ Admin Access Granted",
          description: "Welcome to the admin dashboard",
        });
        navigate('/admin-dashboard');
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid admin credentials",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden"
         style={{ background: 'linear-gradient(135deg, hsl(222 84% 5%), hsl(270 91% 15%), hsl(222 84% 5%))' }}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30l15-15v30l-15-15zm-15-15v30l15-15-15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Floating security elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-purple-500/20 rounded-lg rotate-45 animate-float"></div>
      <div className="absolute bottom-32 right-16 w-12 h-12 bg-blue-500/20 rounded-lg rotate-12 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-8 w-8 h-8 bg-green-500/20 rounded-lg -rotate-12 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center shadow-2xl animate-scale-in border border-purple-500/20">
              <img src="/lovable-uploads/28853c5c-d089-4b72-8e98-d1916c208b25.png" alt="Skill-IT Logo" className="w-12 h-12 object-contain opacity-80" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Admin Portal</h1>
              <p className="text-purple-200 text-lg">Skill It Management</p>
              <p className="text-purple-300/60 text-sm mt-2">Secure administrative access</p>
            </div>
          </div>
          
          <Card className="border-0 shadow-2xl bg-slate-800/90 backdrop-blur-xl relative overflow-hidden border border-purple-500/20">
            {/* Card decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"></div>
            
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-white flex items-center justify-center space-x-2">
                <Lock className="w-6 h-6 text-purple-400" />
                <span>Secure Access</span>
              </CardTitle>
              <CardDescription className="text-slate-300">Administrator credentials required</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-white">Admin Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@skillit.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 border-2 border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-400 focus:border-purple-500 transition-colors duration-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-white">Admin Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 border-2 border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-400 focus:border-purple-500 transition-colors duration-200 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl group border-0"
                >
                  <span className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Admin Access</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </Button>
              </form>
              
              <div className="space-y-4 text-center">
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-200 text-sm font-medium">Demo Credentials</p>
                  <p className="text-purple-300 text-xs mt-1">Email: admin@skillit.com</p>
                  <p className="text-purple-300 text-xs">Password: admin123</p>
                </div>
                
                <div className="flex items-center justify-center space-x-1 text-sm">
                  <span className="text-slate-400">User?</span>
                  <button
                    onClick={() => navigate('/')}
                    className="text-blue-400 hover:text-blue-300 hover:underline font-semibold transition-colors duration-200 flex items-center space-x-1"
                  >
                    <User className="w-3 h-3" />
                    <span>User Login</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-purple-300/60 text-sm">
            <p>Encrypted • Monitored • Secure</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;