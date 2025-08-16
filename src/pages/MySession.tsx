import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import SessionCard from "@/components/SessionCard";
import TrustBadge from "@/components/TrustBadge";
import BottomNavigation from "@/components/BottomNavigation";

interface Session {
  id: string;
  teacher_id: string;
  learner_id: string;
  skill_taught: string;
  session_date: string;
  duration_minutes: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  name: string;
  trust_level: string;
  overall_score: number;
  completed_sessions: number;
}

const MySessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [profiles, setProfiles] = useState<{ [key: string]: Profile }>({});
  const [userTrustScore, setUserTrustScore] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSessions();
      loadUserTrustScore();
    }
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;

    try {
      const { data: sessionsData, error } = await supabase
        .from('skill_swap_sessions')
        .select('*')
        .or(`teacher_id.eq.${user.id},learner_id.eq.${user.id}`)
        .order('session_date', { ascending: false });

      if (error) throw error;

      setSessions(sessionsData || []);

      // Load profiles for all participants
      const userIds = new Set<string>();
      sessionsData?.forEach(session => {
        userIds.add(session.teacher_id);
        userIds.add(session.learner_id);
      });

      if (userIds.size > 0) {
        await loadProfiles(Array.from(userIds));
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast({
        title: "Error loading sessions",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProfiles = async (userIds: string[]) => {
    try {
      // Load basic profile info
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', userIds);

      // Load trust scores
      const { data: trustData } = await supabase
        .from('trust_scores')
        .select('user_id, overall_score, completed_sessions, trust_level')
        .in('user_id', userIds);

      const profileMap: { [key: string]: Profile } = {};

      profilesData?.forEach(profile => {
        const trustScore = trustData?.find(t => t.user_id === profile.user_id);
        profileMap[profile.user_id] = {
          name: profile.name || 'Unknown User',
          trust_level: (trustScore?.trust_level as string) || 'newbie',
          overall_score: trustScore?.overall_score || 0,
          completed_sessions: trustScore?.completed_sessions || 0
        };
      });

      setProfiles(profileMap);
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  };

  const loadUserTrustScore = async () => {
    if (!user) return;

    try {
      const { data: trustData } = await supabase
        .from('trust_scores')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: profileData } = await supabase
        .from('profiles')
        .select('name')
        .eq('user_id', user.id)
        .single();

      if (trustData && profileData) {
        setUserTrustScore({
          name: profileData.name || 'Your Profile',
          trust_level: trustData.trust_level as string,
          overall_score: trustData.overall_score,
          completed_sessions: trustData.completed_sessions
        });
      }
    } catch (error) {
      console.error('Error loading user trust score:', error);
    }
  };

  const createDemoSession = async () => {
    if (!user) return;

    try {
      // Find another user to create a demo session with
      const { data: otherUsers } = await supabase
        .from('profiles')
        .select('user_id, name')
        .neq('user_id', user.id)
        .limit(1);

      if (!otherUsers || otherUsers.length === 0) {
        toast({
          title: "No other users found",
          description: "Create a session when more users join the platform",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('skill_swap_sessions')
        .insert({
          teacher_id: user.id,
          learner_id: otherUsers[0].user_id,
          skill_taught: 'React Development',
          session_date: new Date().toISOString(),
          duration_minutes: 60,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Demo session created!",
        description: "You can now test the review system",
      });

      loadSessions();
    } catch (error) {
      console.error('Error creating demo session:', error);
      toast({
        title: "Error creating session",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const filterSessions = (type: 'all' | 'teaching' | 'learning') => {
    if (!user) return [];
    
    switch (type) {
      case 'teaching':
        return sessions.filter(s => s.teacher_id === user.id);
      case 'learning':
        return sessions.filter(s => s.learner_id === user.id);
      default:
        return sessions;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-20">
        <div className="p-6 flex items-center justify-center h-64">
          <div className="text-gray-600">Loading sessions...</div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-20">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Sessions</h1>
          <p className="text-gray-600">Manage your skill-sharing sessions and reviews</p>
        </div>

        {/* User Trust Score */}
        {userTrustScore && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Your Trust Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TrustBadge
                trustLevel={userTrustScore.trust_level as 'newbie' | 'bronze' | 'silver' | 'gold' | 'platinum'}
                overallScore={userTrustScore.overall_score}
                completedSessions={userTrustScore.completed_sessions}
              />
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{userTrustScore.completed_sessions}</div>
                  <div className="text-sm text-muted-foreground">Sessions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{userTrustScore.overall_score.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary capitalize">{userTrustScore.trust_level}</div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sessions Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Sessions</TabsTrigger>
            <TabsTrigger value="teaching">Teaching</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filterSessions('all').length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your skill-sharing journey by creating a session
                  </p>
                  <Button onClick={createDemoSession} className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create Demo Session</span>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filterSessions('all').map(session => (
                <SessionCard
                  key={session.id}
                  session={session as any}
                  teacherProfile={profiles[session.teacher_id] as any}
                  learnerProfile={profiles[session.learner_id] as any}
                  onStatusUpdate={loadSessions}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="teaching" className="space-y-4">
            {filterSessions('teaching').length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No teaching sessions found</p>
                </CardContent>
              </Card>
            ) : (
              filterSessions('teaching').map(session => (
                <SessionCard
                  key={session.id}
                  session={session as any}
                  teacherProfile={profiles[session.teacher_id] as any}
                  learnerProfile={profiles[session.learner_id] as any}
                  onStatusUpdate={loadSessions}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="learning" className="space-y-4">
            {filterSessions('learning').length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No learning sessions found</p>
                </CardContent>
              </Card>
            ) : (
              filterSessions('learning').map(session => (
                <SessionCard
                  key={session.id}
                  session={session as any}
                  teacherProfile={profiles[session.teacher_id] as any}
                  learnerProfile={profiles[session.learner_id] as any}
                  onStatusUpdate={loadSessions}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default MySessions;