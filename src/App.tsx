
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Subscription from "./pages/Subscription";
import Home from "./pages/Home";
import CareerTest from "./pages/CareerTest";
import SkillSwap from "./pages/SkillSwap";
import InterviewTrainer from "./pages/InterviewTrainer";
import MySessions from "./pages/MySession";
import Profile from "./pages/Profile";
import ProfileSetup from "./components/ProfileSetup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { needsProfileSetup, updateProfile } = useAuth();

  const handleProfileComplete = async (profileData: any) => {
    const { error } = await updateProfile(profileData);
    if (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <BrowserRouter>
      {needsProfileSetup ? (
        <ProfileSetup onComplete={handleProfileComplete} />
      ) : (
        <Routes>
          <Route path="/" element={<UserLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/career-test" element={<ProtectedRoute><CareerTest /></ProtectedRoute>} />
          <Route path="/skill-swap" element={<ProtectedRoute><SkillSwap /></ProtectedRoute>} />
          <Route path="/my-sessions" element={<ProtectedRoute><MySessions /></ProtectedRoute>} />
          <Route path="/interview-trainer" element={<ProtectedRoute><InterviewTrainer /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
