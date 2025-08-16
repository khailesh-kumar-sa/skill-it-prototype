import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  revieweeId: string;
  revieweeName: string;
  isTeacherReview: boolean;
  onReviewSubmitted: () => void;
}

interface RatingProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const StarRating = ({ label, value, onChange }: RatingProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-colors duration-200"
          >
            <Star
              className={`w-6 h-6 ${
                star <= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const ReviewModal = ({
  open,
  onOpenChange,
  sessionId,
  revieweeId,
  revieweeName,
  isTeacherReview,
  onReviewSubmitted
}: ReviewModalProps) => {
  const [ratings, setRatings] = useState({
    teaching: 0,
    communication: 0,
    knowledge: 0,
    overall: 0
  });
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (category: keyof typeof ratings, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async () => {
    if (ratings.teaching === 0 || ratings.communication === 0 || ratings.knowledge === 0 || ratings.overall === 0) {
      toast({
        title: "Please rate all categories",
        description: "All rating fields are required",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('peer_reviews')
        .insert({
          session_id: sessionId,
          reviewer_id: (await supabase.auth.getUser()).data.user?.id,
          reviewee_id: revieweeId,
          teaching_rating: ratings.teaching,
          communication_rating: ratings.communication,
          knowledge_rating: ratings.knowledge,
          overall_rating: ratings.overall,
          written_feedback: feedback.trim() || null,
          is_teacher_review: isTeacherReview
        });

      if (error) throw error;

      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback. This helps improve our community.",
      });

      onReviewSubmitted();
      onOpenChange(false);
      
      // Reset form
      setRatings({ teaching: 0, communication: 0, knowledge: 0, overall: 0 });
      setFeedback('');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error submitting review",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Rate {isTeacherReview ? 'Teacher' : 'Learner'}: {revieweeName}
          </DialogTitle>
          <DialogDescription>
            Your honest feedback helps maintain quality in our skill-sharing community.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <StarRating
            label="Teaching Ability"
            value={ratings.teaching}
            onChange={(value) => handleRatingChange('teaching', value)}
          />

          <StarRating
            label="Communication Skills"
            value={ratings.communication}
            onChange={(value) => handleRatingChange('communication', value)}
          />

          <StarRating
            label="Knowledge Level"
            value={ratings.knowledge}
            onChange={(value) => handleRatingChange('knowledge', value)}
          />

          <StarRating
            label="Overall Experience"
            value={ratings.overall}
            onChange={(value) => handleRatingChange('overall', value)}
          />

          <div className="space-y-2">
            <Label htmlFor="feedback">Written Feedback (Optional)</Label>
            <Textarea
              id="feedback"
              placeholder="Share specific feedback about your learning experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;