
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import BottomNavigation from "@/components/BottomNavigation";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Software Developer",
    interests: "React, Python, Machine Learning, UI/UX Design",
    bio: "Passionate software developer with 3+ years of experience building web applications. Always eager to learn new technologies and share knowledge with the community."
  });

  const [editProfile, setEditProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editProfile);
    setIsEditing(false);
    toast({
      title: "Profile Updated!",
      description: "Your changes have been saved successfully",
    });
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    try {
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;
      
      await signOut();
      navigate('/');
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stats = [
    { label: "Skills Learned", value: "12", color: "text-blue-600" },
    { label: "Skills Shared", value: "8", color: "text-purple-600" },
    { label: "Interview Sessions", value: "25", color: "text-green-600" },
    { label: "Career Score", value: "78%", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-20">
      <div className="p-6">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your skills and preferences</p>
        </div>

        <Card className="mb-6 animate-scale-in">
          <CardHeader className="text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
              {profile.name.charAt(0)}
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">{profile.name}</CardTitle>
            <CardDescription className="text-purple-600 font-medium">{profile.role}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-gray-800">Profile Information</CardTitle>
              <CardDescription>Keep your information up to date</CardDescription>
            </div>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              size="sm"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={isEditing ? editProfile.email : profile.email}
                onChange={(e) => setEditProfile({...editProfile, email: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={isEditing ? editProfile.role : profile.role}
                onChange={(e) => setEditProfile({...editProfile, role: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={isEditing ? editProfile.name : profile.name}
                onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests & Skills</Label>
              <Input
                id="interests"
                value={isEditing ? editProfile.interests : profile.interests}
                onChange={(e) => setEditProfile({...editProfile, interests: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
                placeholder="e.g., React, Python, Design..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={isEditing ? editProfile.bio : profile.bio}
                onChange={(e) => setEditProfile({...editProfile, bio: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <Button onClick={handleCancel} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6 animate-scale-in">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">Premium Features</CardTitle>
            <CardDescription>Unlock advanced AI capabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Advanced AI Career Analysis</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">PREMIUM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Unlimited Skill Swaps</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">PREMIUM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Voice Analysis & Feedback</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">PREMIUM</span>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
              Upgrade to Premium - $19/month
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <p className="text-green-800 text-sm">
              🎉 <strong>Great Progress!</strong> You've completed 78% of your profile. Complete your career test to reach 100%!
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-red-800">Danger Zone</CardTitle>
            <CardDescription className="text-red-600">
              This action cannot be undone. This will permanently delete your account and all associated data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive"
              className="w-full"
            >
              Delete Account Permanently
            </Button>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
