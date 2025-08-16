
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import AddSkillModal from "@/components/AddSkillModal";
import TrustBadge from "@/components/TrustBadge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Search, Star, Users, Clock, MessageSquare, CheckCircle, XCircle, Plus, BookOpen } from "lucide-react";

const SkillSwap = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [requestsReceived, setRequestsReceived] = useState<any[]>([]);
  const [mySkillOfferings, setMySkillOfferings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load approved skill offerings
      const { data: skillsData, error: skillsError } = await supabase
        .from('skill_offerings')
        .select('*, profiles!teacher_id(name), trust_scores!teacher_id(trust_level, overall_score, completed_sessions)')
        .eq('approval_status', 'approved');

      if (skillsError) throw skillsError;

      const skillsWithProfiles = skillsData?.map(skill => ({
        ...skill,
        user_name: skill.profiles?.name || 'Unknown',
        trust_level: skill.trust_scores?.trust_level || 'newbie',
        overall_score: skill.trust_scores?.overall_score || 0,
        completed_sessions: skill.trust_scores?.completed_sessions || 0
      })) || [];

      setAvailableSkills(skillsWithProfiles);

      // Load user's skill requests
      if (user) {
        const { data: requestsData, error: requestsError } = await supabase
          .from('skill_requests')
          .select(`
            *,
            skill_offerings (skill_name, teacher_id),
            profiles:skill_offerings.teacher_id (name)
          `)
          .eq('requester_id', user.id);

        if (requestsError) throw requestsError;
        setMyRequests(requestsData || []);

        // Load requests for user's skills
        const { data: receivedData, error: receivedError } = await supabase
          .from('skill_requests')
          .select(`
            *,
            profiles:requester_id (name),
            skill_offerings (skill_name)
          `)
          .in('skill_offering_id', 
            await supabase
              .from('skill_offerings')
              .select('id')
              .eq('teacher_id', user.id)
              .then(res => res.data?.map(s => s.id) || [])
          );

        if (receivedError) throw receivedError;
        setRequestsReceived(receivedData || []);

        // Load user's skill offerings
        const { data: offeringsData, error: offeringsError } = await supabase
          .from('skill_offerings')
          .select('*')
          .eq('teacher_id', user.id);

        if (offeringsError) throw offeringsError;
        setMySkillOfferings(offeringsData || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error loading data",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkillRequest = async (skillOfferingId: string, skillName: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('skill_requests').insert({
        requester_id: user.id,
        skill_offering_id: skillOfferingId,
        message: `Request for ${skillName}`,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: "✅ Request Sent!",
        description: `Your request for ${skillName} has been sent successfully`,
      });

      loadData();
    } catch (error) {
      console.error('Error sending request:', error);
      toast({
        title: "Error sending request",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleRequestAction = async (requestId: string, action: string) => {
    try {
      const status = action.toLowerCase();
      const { error } = await supabase.from('skill_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;

      // If accepted, create a skill swap session
      if (status === 'accepted') {
        const request = requestsReceived.find(r => r.id === requestId);
        if (request) {
          const { error: sessionError } = await supabase
            .from('skill_swap_sessions')
            .insert({
              teacher_id: user?.id,
              learner_id: request.requester_id,
              skill_taught: request.skill_offerings.skill_name,
              session_date: new Date().toISOString(),
              status: 'pending'
            });

          if (sessionError) throw sessionError;
        }
      }

      toast({
        title: `✅ Request ${action}`,
        description: `You have ${action.toLowerCase()} the skill swap request`,
      });

      loadData();
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Error updating request",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const filteredSkills = availableSkills.filter(skill =>
    skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.skill_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Skill Swap</h1>
          <p className="text-muted-foreground text-lg">Exchange knowledge and grow together</p>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search skills or users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-lg bg-card border-border"
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={() => setShowAddSkillModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Teach a Skill</span>
          </Button>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger value="available" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Available</span>
            </TabsTrigger>
            <TabsTrigger value="my-skills" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>My Skills</span>
            </TabsTrigger>
            <TabsTrigger value="my-requests" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Requests</span>
            </TabsTrigger>
            <TabsTrigger value="received" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Received</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            {filteredSkills.length > 0 ? filteredSkills.map((skill, index) => (
              <Card key={skill.id} className="hover:shadow-lg transition-all duration-300 animate-scale-in border-border bg-card" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-card-foreground">{skill.skill_name}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <span className="text-primary font-medium">{skill.user_name}</span>
                        <Badge variant="secondary" className="text-xs">{skill.level}</Badge>
                        <Badge variant="outline" className="text-xs">{skill.skill_category}</Badge>
                      </CardDescription>
                    </div>
                    <TrustBadge
                      trustLevel={skill.trust_level}
                      overallScore={skill.overall_score}
                      completedSessions={skill.completed_sessions}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">{skill.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{skill.duration_minutes} minutes</span>
                    <span>Max {skill.max_learners} learner(s)</span>
                  </div>
                  <Button 
                    onClick={() => handleSkillRequest(skill.id, skill.skill_name)}
                    className="w-full"
                    size="lg"
                    disabled={skill.teacher_id === user?.id}
                  >
                    {skill.teacher_id === user?.id ? 'Your Skill' : 'Request Skill Swap'}
                  </Button>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No skills found matching your search.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-skills" className="space-y-4">
            {mySkillOfferings.length > 0 ? mySkillOfferings.map((skill, index) => (
              <Card key={skill.id} className="animate-scale-in border-border bg-card" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{skill.skill_name}</CardTitle>
                      <CardDescription>{skill.skill_category} • {skill.level}</CardDescription>
                    </div>
                    <Badge 
                      variant={skill.approval_status === 'approved' ? 'default' : 
                               skill.approval_status === 'rejected' ? 'destructive' : 'secondary'}
                    >
                      {skill.approval_status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{skill.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      Quiz: {skill.quiz_passed ? '✓ Passed' : '✗ Failed'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Demo: {skill.demo_video_url ? '✓ Uploaded' : '✗ Missing'}
                    </Badge>
                    {skill.demo_video_approved && (
                      <Badge variant="outline" className="text-xs text-success">
                        ✓ Video Approved
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No skills added yet.</p>
                <Button 
                  onClick={() => setShowAddSkillModal(true)}
                  className="mt-4"
                  variant="outline"
                >
                  Add Your First Skill
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-requests" className="space-y-4">
            {myRequests.length > 0 ? myRequests.map((request, index) => (
              <Card key={request.id} className="animate-scale-in border-border bg-card" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-bold text-card-foreground text-lg">{request.skill_offerings?.skill_name}</h3>
                      <p className="text-sm text-muted-foreground">Requested from {request.profiles?.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(request.created_at)}</p>
                      {request.message && (
                        <p className="text-sm mt-2 text-muted-foreground italic">"{request.message}"</p>
                      )}
                    </div>
                    <Badge 
                      variant={request.status === 'accepted' ? 'default' : 
                               request.status === 'rejected' ? 'destructive' : 'secondary'}
                      className="capitalize"
                    >
                      {request.status === 'accepted' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {request.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                      {request.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No requests sent yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="received" className="space-y-4">
            {requestsReceived.length > 0 ? requestsReceived.map((request, index) => (
              <Card key={request.id} className="animate-scale-in border-border bg-card" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-card-foreground text-lg">{request.skill_offerings?.skill_name}</h3>
                    <p className="text-sm text-primary font-medium">From {request.profiles?.name}</p>
                    {request.message && (
                      <p className="text-sm text-muted-foreground mt-2 italic">"{request.message}"</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(request.created_at)}</p>
                  </div>
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleRequestAction(request.id, 'accepted')}
                        size="sm" 
                        className="flex-1"
                        variant="default"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button 
                        onClick={() => handleRequestAction(request.id, 'rejected')}
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  )}
                  {request.status !== 'pending' && (
                    <Badge 
                      variant={request.status === 'accepted' ? 'default' : 'destructive'}
                      className="capitalize"
                    >
                      {request.status}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No requests received yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />

      <AddSkillModal
        open={showAddSkillModal}
        onOpenChange={setShowAddSkillModal}
        onSkillAdded={loadData}
      />
    </div>
  );
};

export default SkillSwap;
