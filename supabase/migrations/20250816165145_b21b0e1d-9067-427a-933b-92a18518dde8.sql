-- Create skill_offerings table for teachers to offer skills
CREATE TABLE public.skill_offerings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  skill_name TEXT NOT NULL,
  skill_category TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  prerequisites TEXT,
  duration_minutes INTEGER DEFAULT 60,
  max_learners INTEGER DEFAULT 1,
  quiz_passed BOOLEAN DEFAULT false,
  demo_video_url TEXT,
  demo_video_approved BOOLEAN DEFAULT false,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.skill_offerings ENABLE ROW LEVEL SECURITY;

-- Create policies for skill_offerings
CREATE POLICY "Anyone can view approved skill offerings" 
ON public.skill_offerings 
FOR SELECT 
USING (approval_status = 'approved');

CREATE POLICY "Teachers can create their own skill offerings" 
ON public.skill_offerings 
FOR INSERT 
WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own skill offerings" 
ON public.skill_offerings 
FOR UPDATE 
USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can view their own skill offerings" 
ON public.skill_offerings 
FOR SELECT 
USING (auth.uid() = teacher_id);

-- Create skill_quizzes table
CREATE TABLE public.skill_quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_category TEXT NOT NULL,
  skill_level TEXT NOT NULL CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  questions JSONB NOT NULL,
  passing_score INTEGER DEFAULT 70,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for skill_quizzes
ALTER TABLE public.skill_quizzes ENABLE ROW LEVEL SECURITY;

-- Create policy for skill_quizzes (public read access for taking quizzes)
CREATE POLICY "Anyone can view skill quizzes" 
ON public.skill_quizzes 
FOR SELECT 
USING (true);

-- Create quiz_attempts table
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quiz_id UUID NOT NULL REFERENCES public.skill_quizzes(id),
  skill_offering_id UUID REFERENCES public.skill_offerings(id),
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  time_taken_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for quiz_attempts
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for quiz_attempts
CREATE POLICY "Users can view their own quiz attempts" 
ON public.quiz_attempts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz attempts" 
ON public.quiz_attempts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create skill_requests table for learners to request skills
CREATE TABLE public.skill_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL,
  skill_offering_id UUID NOT NULL REFERENCES public.skill_offerings(id),
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  requested_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for skill_requests
ALTER TABLE public.skill_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for skill_requests
CREATE POLICY "Users can view their own skill requests" 
ON public.skill_requests 
FOR SELECT 
USING (auth.uid() = requester_id);

CREATE POLICY "Teachers can view requests for their skills" 
ON public.skill_requests 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.skill_offerings so 
  WHERE so.id = skill_requests.skill_offering_id 
  AND so.teacher_id = auth.uid()
));

CREATE POLICY "Users can create skill requests" 
ON public.skill_requests 
FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Teachers can update requests for their skills" 
ON public.skill_requests 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.skill_offerings so 
  WHERE so.id = skill_requests.skill_offering_id 
  AND so.teacher_id = auth.uid()
));

-- Add trigger for skill_offerings timestamps
CREATE TRIGGER update_skill_offerings_updated_at
BEFORE UPDATE ON public.skill_offerings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for skill_requests timestamps
CREATE TRIGGER update_skill_requests_updated_at
BEFORE UPDATE ON public.skill_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample quiz data
INSERT INTO public.skill_quizzes (skill_category, skill_level, questions, passing_score) VALUES
('Programming', 'beginner', '[
  {
    "question": "What is a variable in programming?",
    "options": ["A storage location with a name", "A type of loop", "A function parameter", "A programming language"],
    "correct": 0
  },
  {
    "question": "Which of these is NOT a programming concept?",
    "options": ["Variables", "Functions", "Loops", "Electricity"],
    "correct": 3
  },
  {
    "question": "What does IDE stand for?",
    "options": ["Internet Development Environment", "Integrated Development Environment", "International Data Exchange", "Input Device Extension"],
    "correct": 1
  },
  {
    "question": "What is debugging?",
    "options": ["Creating bugs", "Finding and fixing errors", "Writing documentation", "Testing performance"],
    "correct": 1
  },
  {
    "question": "What is a function?",
    "options": ["A reusable block of code", "A type of variable", "A programming language", "A computer component"],
    "correct": 0
  }
]', 70),
('Design', 'beginner', '[
  {
    "question": "What are the primary colors?",
    "options": ["Red, Blue, Yellow", "Red, Green, Blue", "Black, White, Gray", "Purple, Orange, Green"],
    "correct": 0
  },
  {
    "question": "What is typography?",
    "options": ["Color theory", "The art of arranging text", "3D modeling", "Photography"],
    "correct": 1
  },
  {
    "question": "What does UI stand for?",
    "options": ["Universal Interface", "User Interface", "Unique Identifier", "Unified Integration"],
    "correct": 1
  },
  {
    "question": "What is white space in design?",
    "options": ["Empty or negative space", "The color white", "Paper background", "Text alignment"],
    "correct": 0
  },
  {
    "question": "What is a wireframe?",
    "options": ["A type of font", "A low-fidelity design blueprint", "A color palette", "A design tool"],
    "correct": 1
  }
]', 70);