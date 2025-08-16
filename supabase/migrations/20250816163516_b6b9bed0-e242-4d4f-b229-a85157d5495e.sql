-- Create skill swap sessions table
CREATE TABLE public.skill_swap_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  learner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_taught text NOT NULL,
  session_date timestamp with time zone NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create peer reviews table
CREATE TABLE public.peer_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.skill_swap_sessions(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  teaching_rating integer NOT NULL CHECK (teaching_rating >= 1 AND teaching_rating <= 5),
  communication_rating integer NOT NULL CHECK (communication_rating >= 1 AND communication_rating <= 5),
  knowledge_rating integer NOT NULL CHECK (knowledge_rating >= 1 AND knowledge_rating <= 5),
  overall_rating integer NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  written_feedback text,
  is_teacher_review boolean NOT NULL DEFAULT false, -- true if reviewing the teacher, false if reviewing the learner
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(session_id, reviewer_id, is_teacher_review)
);

-- Create trust scores table
CREATE TABLE public.trust_scores (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  overall_score decimal(3,2) NOT NULL DEFAULT 0.00 CHECK (overall_score >= 0 AND overall_score <= 5),
  completed_sessions integer NOT NULL DEFAULT 0,
  total_reviews integer NOT NULL DEFAULT 0,
  avg_teaching_rating decimal(3,2) DEFAULT 0.00,
  avg_communication_rating decimal(3,2) DEFAULT 0.00,
  avg_knowledge_rating decimal(3,2) DEFAULT 0.00,
  trust_level text NOT NULL DEFAULT 'newbie' CHECK (trust_level IN ('newbie', 'bronze', 'silver', 'gold', 'platinum')),
  last_calculated timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.skill_swap_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skill_swap_sessions
CREATE POLICY "Users can view sessions they're involved in"
ON public.skill_swap_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = teacher_id OR auth.uid() = learner_id);

CREATE POLICY "Users can create their own sessions"
ON public.skill_swap_sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = teacher_id OR auth.uid() = learner_id);

CREATE POLICY "Users can update sessions they're involved in"
ON public.skill_swap_sessions
FOR UPDATE
TO authenticated
USING (auth.uid() = teacher_id OR auth.uid() = learner_id);

-- RLS Policies for peer_reviews
CREATE POLICY "Users can view reviews for their sessions"
ON public.peer_reviews
FOR SELECT
TO authenticated
USING (
  auth.uid() = reviewer_id OR 
  auth.uid() = reviewee_id OR
  EXISTS (
    SELECT 1 FROM public.skill_swap_sessions s 
    WHERE s.id = peer_reviews.session_id 
    AND (s.teacher_id = auth.uid() OR s.learner_id = auth.uid())
  )
);

CREATE POLICY "Users can create reviews for completed sessions"
ON public.peer_reviews
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reviewer_id);

-- RLS Policies for trust_scores (public read, system write)
CREATE POLICY "Trust scores are publicly viewable"
ON public.trust_scores
FOR SELECT
TO authenticated
USING (true);

-- Function to calculate trust score
CREATE OR REPLACE FUNCTION public.calculate_trust_score(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  completed_count integer;
  review_count integer;
  avg_teaching decimal(3,2);
  avg_communication decimal(3,2);
  avg_knowledge decimal(3,2);
  overall_avg decimal(3,2);
  new_trust_level text;
BEGIN
  -- Count completed sessions where user was a teacher
  SELECT COUNT(*)
  INTO completed_count
  FROM skill_swap_sessions
  WHERE teacher_id = target_user_id AND status = 'completed';

  -- Get average ratings
  SELECT 
    COUNT(*),
    AVG(teaching_rating),
    AVG(communication_rating),
    AVG(knowledge_rating),
    AVG(overall_rating)
  INTO 
    review_count,
    avg_teaching,
    avg_communication,
    avg_knowledge,
    overall_avg
  FROM peer_reviews
  WHERE reviewee_id = target_user_id AND is_teacher_review = true;

  -- Set defaults if no reviews
  avg_teaching := COALESCE(avg_teaching, 0);
  avg_communication := COALESCE(avg_communication, 0);
  avg_knowledge := COALESCE(avg_knowledge, 0);
  overall_avg := COALESCE(overall_avg, 0);
  review_count := COALESCE(review_count, 0);

  -- Calculate trust level
  IF completed_count >= 50 AND overall_avg >= 4.5 THEN
    new_trust_level := 'platinum';
  ELSIF completed_count >= 25 AND overall_avg >= 4.0 THEN
    new_trust_level := 'gold';
  ELSIF completed_count >= 10 AND overall_avg >= 3.5 THEN
    new_trust_level := 'silver';
  ELSIF completed_count >= 5 AND overall_avg >= 3.0 THEN
    new_trust_level := 'bronze';
  ELSE
    new_trust_level := 'newbie';
  END IF;

  -- Upsert trust score
  INSERT INTO trust_scores (
    user_id,
    overall_score,
    completed_sessions,
    total_reviews,
    avg_teaching_rating,
    avg_communication_rating,
    avg_knowledge_rating,
    trust_level,
    last_calculated,
    updated_at
  )
  VALUES (
    target_user_id,
    overall_avg,
    completed_count,
    review_count,
    avg_teaching,
    avg_communication,
    avg_knowledge,
    new_trust_level,
    now(),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    overall_score = EXCLUDED.overall_score,
    completed_sessions = EXCLUDED.completed_sessions,
    total_reviews = EXCLUDED.total_reviews,
    avg_teaching_rating = EXCLUDED.avg_teaching_rating,
    avg_communication_rating = EXCLUDED.avg_communication_rating,
    avg_knowledge_rating = EXCLUDED.avg_knowledge_rating,
    trust_level = EXCLUDED.trust_level,
    last_calculated = EXCLUDED.last_calculated,
    updated_at = EXCLUDED.updated_at;
END;
$$;

-- Trigger to update trust scores when reviews are added
CREATE OR REPLACE FUNCTION public.update_trust_score_on_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Update trust score for the reviewee
  PERFORM calculate_trust_score(NEW.reviewee_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_trust_score_after_review
  AFTER INSERT ON public.peer_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_trust_score_on_review();

-- Add updated_at triggers
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.skill_swap_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trust_scores_updated_at
  BEFORE UPDATE ON public.trust_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();