-- Fix the delete_user function with proper security settings
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;