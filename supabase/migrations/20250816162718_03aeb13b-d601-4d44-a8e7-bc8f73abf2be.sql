-- Add mobile_number column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN mobile_number text;

-- Create unique constraint on mobile_number to prevent duplicate free trials
ALTER TABLE public.profiles 
ADD CONSTRAINT unique_mobile_number UNIQUE (mobile_number);

-- Add a table to track free trial usage per mobile number
CREATE TABLE public.free_trial_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mobile_number text NOT NULL,
  trial_started_at timestamp with time zone NOT NULL DEFAULT now(),
  trial_expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(mobile_number)
);

-- Enable RLS on free_trial_usage table
ALTER TABLE public.free_trial_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for free_trial_usage
CREATE POLICY "Users can view their own trial data" 
ON public.free_trial_usage 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trial data" 
ON public.free_trial_usage 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Create function to check if mobile number has used free trial
CREATE OR REPLACE FUNCTION public.check_mobile_trial_eligibility(mobile_num text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT NOT EXISTS (
    SELECT 1 
    FROM public.free_trial_usage 
    WHERE mobile_number = mobile_num
  );
$$;