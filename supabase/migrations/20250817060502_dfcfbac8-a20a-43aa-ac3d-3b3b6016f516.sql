-- Update existing skill offerings to approved status for testing
UPDATE skill_offerings SET approval_status = 'approved' WHERE approval_status = 'pending';

-- Create admin function to approve skills
CREATE OR REPLACE FUNCTION approve_skill_offering(skill_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
  UPDATE skill_offerings 
  SET approval_status = 'approved', 
      updated_at = now()
  WHERE id = skill_id;
END;
$$;