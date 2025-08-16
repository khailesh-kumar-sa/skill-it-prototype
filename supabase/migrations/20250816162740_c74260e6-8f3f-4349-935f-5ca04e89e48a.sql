-- Fix the search path for the function
CREATE OR REPLACE FUNCTION public.check_mobile_trial_eligibility(mobile_num text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT NOT EXISTS (
    SELECT 1 
    FROM public.free_trial_usage 
    WHERE mobile_number = mobile_num
  );
$$;