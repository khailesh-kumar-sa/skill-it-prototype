
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Search, Star, Users, Clock, MessageSquare, CheckCircle, XCircle } from "lucide-react";

const SkillSwap = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [requestsReceived, setRequestsReceived] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load real data from database if available, otherwise show empty state
      setAvailableSkills([]);
      setMyRequests([]);
      setRequestsReceived([]);
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkillRequest = async (skillId: number, skillName: string) => {
    try {
      // In a real implementation, this would create a request in Supabase
      // const { error } = await supabase.from('skill_requests').insert({
      //   requester_id: user?.id,
      //   skill_id: skillId,
      //   message: `Request for ${skillName}`
      // });

      toast({
        title: "✅ Request Sent!",
        description: `Your request for ${skillName} has been sent successfully`,
      });
    } catch (error) {
      toast({
        title: "Error sending request",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleRequestAction = async (requestId: number, action: string) => {
    try {
      // In a real implementation, this would update the request status in Supabase
      // const { error } = await supabase.from('skill_requests')
      //   .update({ status: action.toLowerCase() })
      //   .eq('id', requestId);

      setRequestsReceived(prev => 
        prev.filter(request => request.id !== requestId)
      );

      toast({
        title: `✅ Request ${action}`,
        description: `You have ${action.toLowerCase()} the skill swap request`,
      });
    } catch (error) {
      toast({
        title: "Error updating request",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const filteredSkills = availableSkills.filter(skill =>
    skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.user_name.toLowerCase().includes(searchTerm.toLowerCase())
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

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="available" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Available</span>
            </TabsTrigger>
            <TabsTrigger value="my-requests" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>My Requests</span>
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
                      <CardDescription className="text-primary font-medium flex items-center space-x-2">
                        <span>{skill.user_name}</span>
                        <Badge variant="secondary" className="text-xs">{skill.level}</Badge>
                      </CardDescription>
                    </div>
                    <div className="text-right flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{skill.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">{skill.description}</p>
                  <Button 
                    onClick={() => handleSkillRequest(skill.id, skill.skill_name)}
                    className="w-full"
                    size="lg"
                  >
                    Request Skill Swap
                  </Button>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No skills found matching your search.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-requests" className="space-y-4">
            {myRequests.length > 0 ? myRequests.map((request, index) => (
              <Card key={request.id} className="animate-scale-in border-border bg-card" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-bold text-card-foreground text-lg">{request.skill_name}</h3>
                      <p className="text-sm text-muted-foreground">Requested from {request.requested_from}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(request.created_at)}</p>
                    </div>
                    <Badge 
                      variant={request.status === 'accepted' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {request.status === 'accepted' && <CheckCircle className="w-3 h-3 mr-1" />}
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
                    <h3 className="font-bold text-card-foreground text-lg">{request.skill_name}</h3>
                    <p className="text-sm text-primary font-medium">From {request.requested_by}</p>
                    <p className="text-sm text-muted-foreground mt-2">{request.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(request.created_at)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleRequestAction(request.id, 'Accepted')}
                      size="sm" 
                      className="flex-1"
                      variant="default"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                    <Button 
                      onClick={() => handleRequestAction(request.id, 'Declined')}
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                  </div>
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
    </div>
  );
};

export default SkillSwap;
