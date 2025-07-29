import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Phone, Mail, ArrowRight, Shield, User } from "lucide-react";

const UserLogin = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-premium relative overflow-hidden"
         style={{ background: 'var(--gradient-hero)' }}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-premium/20 rounded-full animate-float"></div>
      <div className="absolute bottom-32 right-16 w-16 h-16 bg-accent/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-8 w-12 h-12 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-card rounded-2xl flex items-center justify-center shadow-2xl animate-scale-in border border-border/20 animate-glow">
              <img src="/lovable-uploads/28853c5c-d089-4b72-8e98-d1916c208b25.png" alt="Skill-IT Logo" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary-foreground mb-2 tracking-tight">Skill It</h1>
              <p className="text-primary-foreground/80 text-lg">User Portal</p>
              <p className="text-primary-foreground/60 text-sm mt-2">Transform your career with AI-powered insights</p>
            </div>
          </div>
          
          <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-xl relative overflow-hidden">
            {/* Card decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-premium"></div>
            
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-card-foreground">Welcome Back!</CardTitle>
              <CardDescription className="text-muted-foreground">Choose your preferred sign-in method</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Google Sign-In Button */}
              <Button 
                onClick={handleGoogleLogin}
                variant="outline" 
                className="w-full h-14 text-lg font-semibold hover:bg-accent/10 border-2 hover:border-accent transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-premium/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center space-x-3 relative z-10">
                  <div className="w-6 h-6 bg-gradient-to-r from-accent to-premium rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-xs font-bold">G</span>
                  </div>
                  <span>Continue with Google</span>
                </div>
              </Button>
              
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground font-medium">Or continue with</span>
                </div>
              </div>

              {/* Auth Mode Toggle */}
              <div className="flex rounded-lg bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('email')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                    authMode === 'email' 
                      ? 'bg-card shadow-sm text-primary font-semibold' 
                      : 'text-muted-foreground hover:text-card-foreground'
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
                      ? 'bg-card shadow-sm text-primary font-semibold' 
                      : 'text-muted-foreground hover:text-card-foreground'
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
                      <Label htmlFor="email" className="text-sm font-semibold text-card-foreground">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 border-2 border-input focus:border-primary transition-colors duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-card-foreground">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 border-2 border-input focus:border-primary transition-colors duration-200 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-card-foreground">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="h-12 border-2 border-input focus:border-primary transition-colors duration-200"
                      />
                    </div>
                    
                    {!otpSent ? (
                      <Button
                        type="button"
                        onClick={handleSendOTP}
                        variant="outline"
                        className="w-full h-12 border-2 border-primary text-primary hover:bg-primary/10"
                      >
                        Send OTP
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-sm font-semibold text-card-foreground">Enter OTP</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="123456"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="h-12 border-2 border-input focus:border-primary transition-colors duration-200 text-center text-lg tracking-widest"
                          maxLength={6}
                        />
                      </div>
                    )}
                  </>
                )}
                
                {(authMode === 'email' || otpSent) && (
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl group"
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
                  className="text-sm text-primary hover:text-primary/80 hover:underline font-medium transition-colors duration-200"
                >
                  Forgot Password?
                </a>
                <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
                  <span>Don't have an account?</span>
                  <a 
                    href="#" 
                    className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors duration-200"
                  >
                    Create Account
                  </a>
                </div>
                <div className="flex items-center justify-center space-x-1 text-sm">
                  <span className="text-muted-foreground">Admin?</span>
                  <button
                    onClick={() => navigate('/admin-login')}
                    className="text-accent hover:text-accent/80 hover:underline font-semibold transition-colors duration-200 flex items-center space-x-1"
                  >
                    <Shield className="w-3 h-3" />
                    <span>Admin Login</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-primary-foreground/60 text-sm">
            <p>Secure • Fast • AI-Powered</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;