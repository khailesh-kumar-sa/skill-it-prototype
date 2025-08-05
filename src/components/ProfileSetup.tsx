import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface ProfileSetupProps {
  onComplete: (profile: ProfileData) => void;
}

export interface ProfileData {
  name: string;
  role: string;
  interests: string;
  bio: string;
}

const ProfileSetup = ({ onComplete }: ProfileSetupProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    role: '',
    interests: '',
    bio: ''
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.name || !profile.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and select a role",
        variant: "destructive"
      });
      return;
    }

    onComplete(profile);
    toast({
      title: "Profile Created!",
      description: "Welcome to your personalized career journey",
    });
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