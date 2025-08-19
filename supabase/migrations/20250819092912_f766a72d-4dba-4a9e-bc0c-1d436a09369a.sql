-- Add approval status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN approved BOOLEAN DEFAULT false,
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN approved_by UUID;

-- Create RLS policy for admins to update approval status
CREATE POLICY "Admins can update approval status" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Update existing users to be approved by default
UPDATE public.profiles SET approved = true WHERE approved IS NULL OR approved = false;