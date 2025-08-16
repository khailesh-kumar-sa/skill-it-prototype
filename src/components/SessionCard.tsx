import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Star } from "lucide-react";
import { format } from 'date-fns';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ReviewModal from "./ReviewModal";
import TrustBadge from "./TrustBadge";

interface SessionCardProps {
  session: {
    id: string;
    teacher_id: string;
    learner_id: string;
    skill_taught: string;
    session_date: string;
    duration_minutes: number;
    status: 'pending' | 'completed' | 'cancelled';
  };
  teacherProfile?: {
    name: string;
    trust_level: 'newbie' | 'bronze' | 'silver' | 'gold' | 'platinum';
    overall_score: number;
    completed_sessions: number;
  };
  learnerProfile?: {
    name: string;
  };
  onStatusUpdate?: () => void;
}

const SessionCard = ({ session, teacherProfile, learnerProfile, onStatusUpdate }: SessionCardProps) => {
  const { user } = useAuth();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{ id: string; name: string; isTeacher: boolean } | null>(null);
  const [hasReviewed, setHasReviewed] = useState<{ teacher: boolean; learner: boolean }>({ 
    teacher: false, 
    learner: false 
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const isTeacher = user?.id === session.teacher_id;
  const isLearner = user?.id === session.learner_id;

  useEffect(() => {
    checkExistingReviews();
  }, [session.id, user?.id]);

  const checkExistingReviews = async () => {
    if (!user?.id || session.status !== 'completed') return;

    try {
      const { data: reviews } = await supabase
        .from('peer_reviews')
        .select('is_teacher_review')
        .eq('session_id', session.id)
        .eq('reviewer_id', user.id);

      if (reviews) {
        const teacherReviewExists = reviews.some(r => r.is_teacher_review);
        const learnerReviewExists = reviews.some(r => !r.is_teacher_review);
        
        setHasReviewed({
          teacher: teacherReviewExists,
          learner: learnerReviewExists
        });
      }
    } catch (error) {
      console.error('Error checking reviews:', error);
    }
  };

  const handleMarkCompleted = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('skill_swap_sessions')
        .update({ status: 'completed' })
        .eq('id', session.id);

      if (error) throw error;

      toast({
        title: "Session marked as completed",
        description: "You can now leave reviews for each other",
      });

      onStatusUpdate?.();
    } catch (error) {
      console.error('Error updating session:', error);
      toast({
        title: "Error updating session",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReviewClick = (targetId: string, targetName: string, isTeacherReview: boolean) => {
    setReviewTarget({ id: targetId, name: targetName, isTeacher: isTeacherReview });
    setShowReviewModal(true);
  };

  const getStatusBadge = () => {
    switch (session.status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{session.skill_taught}</CardTitle>
              <CardDescription className="flex items-center space-x-4 mt-2">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(session.session_date), 'MMM dd, yyyy')}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {session.duration_minutes} min
                </span>
              </CardDescription>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Participants */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Teacher:</span>
                <span>{teacherProfile?.name || 'Loading...'}</span>
              </div>
              {teacherProfile && (
                <TrustBadge 
                  trustLevel={teacherProfile.trust_level}
                  overallScore={teacherProfile.overall_score}
                  completedSessions={teacherProfile.completed_sessions}
                />
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Learner:</span>
              <span>{learnerProfile?.name || 'Loading...'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {session.status === 'pending' && (isTeacher || isLearner) && (
              <Button
                onClick={handleMarkCompleted}
                disabled={isUpdating}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                {isUpdating ? 'Updating...' : 'Mark as Completed'}
              </Button>
            )}

            {session.status === 'completed' && isLearner && !hasReviewed.teacher && (
              <Button
                onClick={() => handleReviewClick(session.teacher_id, teacherProfile?.name || 'Teacher', true)}
                size="sm"
                variant="outline"
                className="flex items-center space-x-1"
              >
                <Star className="w-4 h-4" />
                <span>Review Teacher</span>
              </Button>
            )}

            {session.status === 'completed' && isTeacher && !hasReviewed.learner && (
              <Button
                onClick={() => handleReviewClick(session.learner_id, learnerProfile?.name || 'Learner', false)}
                size="sm"
                variant="outline"
                className="flex items-center space-x-1"
              >
                <Star className="w-4 h-4" />
                <span>Review Learner</span>
              </Button>
            )}

            {session.status === 'completed' && (
              <div className="text-xs text-muted-foreground">
                Reviews: {hasReviewed.teacher ? '✓' : '○'} Teacher 
                {isTeacher && (hasReviewed.learner ? ' • ✓ Learner' : ' • ○ Learner')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {reviewTarget && (
        <ReviewModal
          open={showReviewModal}
          onOpenChange={setShowReviewModal}
          sessionId={session.id}
          revieweeId={reviewTarget.id}
          revieweeName={reviewTarget.name}
          isTeacherReview={reviewTarget.isTeacher}
          onReviewSubmitted={() => {
            checkExistingReviews();
            onStatusUpdate?.();
          }}
        />
      )}
    </>
  );
};

export default SessionCard;