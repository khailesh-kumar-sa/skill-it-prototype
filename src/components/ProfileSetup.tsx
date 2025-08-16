import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface ProfileSetupProps {
  onComplete: (profile: ProfileData) => void;
}

export interface ProfileData {
  name: string;
  role: string;
  interests: string;
  bio: string;
  mobile_number?: string;
}

const ProfileSetup = ({ onComplete }: ProfileSetupProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    role: '',
    interests: '',
    bio: '',
    mobile_number: ''
  });

  const careerRoles = [
    'BPO Technical Support',
    'Junior Software Developer', 
    'IT Help Desk Specialist',
    'Full Stack Developer',
    'Data Analyst',
    'DevOps Engineer',
    'Cybersecurity Analyst',
    'Solution Architect',
    'Data Scientist',
    'Cloud Architect',
    'Product Manager (Tech)',
    'Engineering Manager',
    'Chief Technology Officer',
    'Tech Entrepreneur',
    'IT Consultant',
    'Freelance Developer'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.name || !profile.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and select a role",
        variant: "destructive"
      });
      return;
    }

    try {
      // Save profile to database
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user?.id,
          name: profile.name,
          role: profile.role,
          interests: profile.interests,
          bio: profile.bio,
          email: user?.email,
          mobile_number: profile.mobile_number
        });

      if (profileError) throw profileError;

      // Create free trial tracking entry if mobile number is provided
      if (profile.mobile_number) {
        const { error: trialError } = await supabase
          .from('free_trial_usage')
          .insert({
            user_id: user?.id,
            mobile_number: profile.mobile_number
          });

        if (trialError) {
          console.error('Error creating trial tracking:', trialError);
        }
      }

      onComplete(profile);
      toast({
        title: "Profile Created!",
        description: "Welcome to your personalized career journey",
      });
      navigate('/subscription');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">Complete Your Profile</CardTitle>
          <CardDescription>
            Let's personalize your experience. Tell us about yourself to get started!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                value={profile.mobile_number}
                onChange={(e) => setProfile({...profile, mobile_number: e.target.value})}
                placeholder="+91 9876543210"
              />
              <p className="text-xs text-gray-500">
                Used for trial tracking and account verification
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Career Role *</Label>
              <Select onValueChange={(value) => setProfile({...profile, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your career path" />
                </SelectTrigger>
                <SelectContent>
                  {careerRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Skills & Interests</Label>
              <Input
                id="interests"
                value={profile.interests}
                onChange={(e) => setProfile({...profile, interests: e.target.value})}
                placeholder="e.g., React, Python, Problem Solving..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                placeholder="Tell us about yourself and your career goals..."
                rows={3}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Complete Profile & Get Started
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;