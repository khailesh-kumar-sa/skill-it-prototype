
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Phone, Mail, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  const [otpSent, setOtpSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'email' && email && password) {
      toast({
        title: "🎉 Welcome to Skill It!",
        description: "Login successful! Let's unlock your potential.",
      });
      navigate('/subscription');
    } else if (authMode === 'phone' && phoneNumber && otp) {
      toast({
        title: "🎉 Welcome to Skill It!",
        description: "Phone verification successful!",
      });
      navigate('/subscription');
    } else {
      toast({
        title: "Oops! Something's missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }
  };

  const handleSendOTP = () => {
    if (phoneNumber) {
      setOtpSent(true);
      toast({
        title: "📱 OTP Sent!",
        description: "Check your phone for the verification code",
      });
    }
  };

  const handleGoogleLogin = () => {
    toast({
      title: "🚀 Google Sign-In",
      description: "Connecting with Google...",
    });
    navigate('/subscription');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-8 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-scale-in">
              <span className="text-3xl font-bold text-white">S</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Skill It</h1>
              <p className="text-blue-100 text-lg">AI Career & Skill Development Platform</p>
              <p className="text-blue-200 text-sm mt-2">Transform your career with AI-powered insights</p>
            </div>
          </div>
          
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl relative overflow-hidden">
            {/* Card decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800">Welcome Back!</CardTitle>
              <CardDescription className="text-gray-600">Choose your preferred sign-in method</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Google Sign-In Button */}
              <Button 
                onClick={handleGoogleLogin}
                variant="outline" 
                className="w-full h-14 text-lg font-semibold hover:bg-red-50 border-2 hover:border-red-200 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center space-x-3 relative z-10">
                  <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <span>Continue with Google</span>
                </div>
              </Button>
              
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              {/* Auth Mode Toggle */}
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('email')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                    authMode === 'email' 
                      ? 'bg-white shadow-sm text-blue-600 font-semibold' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('phone')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                    authMode === 'phone' 
                      ? 'bg-white shadow-sm text-blue-600 font-semibold' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </button>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-5">
                {authMode === 'email' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors duration-200 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors duration-200"
                      />
                    </div>
                    
                    {!otpSent ? (
                      <Button
                        type="button"
                        onClick={handleSendOTP}
                        variant="outline"
                        className="w-full h-12 border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        Send OTP
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-sm font-semibold text-gray-700">Enter OTP</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="123456"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors duration-200 text-center text-lg tracking-widest"
                          maxLength={6}
                        />
                      </div>
                    )}
                  </>
                )}
                
                {(authMode === 'email' || otpSent) && (
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    <span className="flex items-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                  </Button>
                )}
              </form>
              
              <div className="space-y-4 text-center">
                <a 
                  href="#" 
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200"
                >
                  Forgot Password?
                </a>
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                  <span>Don't have an account?</span>
                  <a 
                    href="#" 
                    className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors duration-200"
                  >
                    Create Account
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-blue-200 text-sm">
            <p>Secure • Fast • AI-Powered</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
