import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle, XCircle, Brain, Video } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import SkillQuiz from "./SkillQuiz";

interface AddSkillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSkillAdded: () => void;
}

const SKILL_CATEGORIES = [
  'Programming',
  'Design',
  'Marketing',
  'Business',
  'Languages',
  'Music',
  'Art',
  'Writing',
  'Photography',
  'Cooking',
  'Fitness',
  'Other'
];

const ROLE_OPTIONS = {
  'Programming': [
    'Junior Software Developer',
    'Full Stack Developer', 
    'Frontend Developer',
    'Backend Developer',
    'Mobile App Developer',
    'DevOps Engineer',
    'Software Architect',
    'Tech Lead'
  ],
  'Design': [
    'UI/UX Designer',
    'Graphic Designer',
    'Product Designer',
    'Web Designer',
    'Motion Graphics Designer',
    'Creative Director'
  ],
  'Marketing': [
    'Digital Marketing Specialist',
    'Social Media Manager',
    'Content Marketing Manager',
    'SEO Specialist',
    'Marketing Manager',
    'Brand Manager'
  ],
  'Business': [
    'Business Analyst',
    'Product Manager',
    'Project Manager',
    'Consultant',
    'Operations Manager',
    'Strategy Manager'
  ],
  'Languages': [
    'Language Teacher',
    'Translator',
    'Interpreter',
    'Content Writer',
    'Localization Specialist'
  ],
  'Music': [
    'Music Teacher',
    'Sound Engineer',
    'Music Producer',
    'Composer',
    'Audio Technician'
  ],
  'Art': [
    'Art Teacher',
    'Illustrator',
    'Art Director',
    'Concept Artist',
    'Visual Artist'
  ],
  'Writing': [
    'Content Writer',
    'Technical Writer',
    'Copywriter',
    'Editor',
    'Journalist'
  ],
  'Photography': [
    'Photographer',
    'Photo Editor',
    'Visual Content Creator',
    'Photography Instructor'
  ],
  'Cooking': [
    'Chef',
    'Culinary Instructor',
    'Food Stylist',
    'Restaurant Manager'
  ],
  'Fitness': [
    'Personal Trainer',
    'Fitness Instructor',
    'Sports Coach',
    'Wellness Coach'
  ],
  'Other': [
    'Instructor',
    'Trainer',
    'Specialist',
    'Expert'
  ]
};

const AddSkillModal = ({ open, onOpenChange, onSkillAdded }: AddSkillModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Form, 2: Quiz, 3: Video, 4: Review
  const [formData, setFormData] = useState({
    skill_name: '',
    skill_category: '',
    description: '',
    level: '',
    prerequisites: '',
    duration_minutes: 60,
    max_learners: 1
  });
  const [selectedRole, setSelectedRole] = useState('');
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [demoVideoFile, setDemoVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Reset role when category changes
    if (field === 'skill_category') {
      setSelectedRole('');
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: "Please upload a video smaller than 50MB",
          variant: "destructive"
        });
        return;
      }
      
      setDemoVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const validateForm = () => {
    if (!formData.skill_name.trim()) {
      toast({
        title: "Skill name required",
        description: "Please enter a skill name",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.skill_category) {
      toast({
        title: "Category required",
        description: "Please select a skill category",
        variant: "destructive"
      });
      return false;
    }
    if (!selectedRole) {
      toast({
        title: "Role required",
        description: "Please select your target role",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.level) {
      toast({
        title: "Level required",
        description: "Please select a skill level",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.description.trim()) {
      toast({
        title: "Description required",
        description: "Please provide a description",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const proceedToQuiz = () => {
    if (validateForm()) {
      setStep(2);
      setShowQuiz(true);
    }
  };

  const handleQuizCompleted = (passed: boolean, score: number) => {
    setQuizPassed(passed);
    setQuizScore(score);
    setShowQuiz(false);
    if (passed) {
      setStep(3);
    } else {
      setStep(1);
    }
  };

  const proceedToReview = () => {
    if (!demoVideoFile) {
      toast({
        title: "Demo video required",
        description: "Please upload a demo video",
        variant: "destructive"
      });
      return;
    }
    setStep(4);
  };

  const submitSkillOffering = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // First upload the video file if present
      let demoVideoUrl = null;
      if (demoVideoFile) {
        const fileName = `${user.id}/${Date.now()}-${demoVideoFile.name}`;
        // For now, we'll store the file name. In a real app, you'd upload to storage
        demoVideoUrl = fileName;
      }

      const { error } = await supabase
        .from('skill_offerings')
        .insert({
          teacher_id: user.id,
          skill_name: formData.skill_name,
          skill_category: formData.skill_category,
          description: formData.description,
          level: formData.level,
          prerequisites: formData.prerequisites || null,
          duration_minutes: formData.duration_minutes,
          max_learners: formData.max_learners,
          quiz_passed: quizPassed,
          demo_video_url: demoVideoUrl,
          demo_video_approved: false, // Will be reviewed manually
          approval_status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Skill offering submitted!",
        description: "Your skill will be reviewed and approved within 24 hours",
      });

      onSkillAdded();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error submitting skill offering:', error);
      toast({
        title: "Error submitting skill",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      skill_name: '',
      skill_category: '',
      description: '',
      level: '',
      prerequisites: '',
      duration_minutes: 60,
      max_learners: 1
    });
    setSelectedRole('');
    setQuizPassed(false);
    setQuizScore(0);
    setDemoVideoFile(null);
    setVideoPreview(null);
  };

  const getStepIcon = (stepNumber: number) => {
    if (step > stepNumber) return <CheckCircle className="w-5 h-5 text-success" />;
    if (step === stepNumber) return <div className="w-5 h-5 rounded-full bg-primary"></div>;
    return <div className="w-5 h-5 rounded-full bg-muted"></div>;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Skill to Teach</DialogTitle>
            <DialogDescription>
              Go through our validation process to start teaching
            </DialogDescription>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-6">
            {[
              { number: 1, label: 'Details' },
              { number: 2, label: 'Quiz' },
              { number: 3, label: 'Demo' },
              { number: 4, label: 'Review' }
            ].map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  {getStepIcon(stepItem.number)}
                  <span className="text-xs mt-1">{stepItem.label}</span>
                </div>
                {index < 3 && (
                  <div className={`h-1 w-16 mx-2 ${step > stepItem.number ? 'bg-success' : 'bg-muted'}`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Skill Details Form */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="skill_name">Skill Name *</Label>
                  <Input
                    id="skill_name"
                    placeholder="e.g., React Development"
                    value={formData.skill_name}
                    onChange={(e) => handleInputChange('skill_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill_category">Category *</Label>
                  <Select value={formData.skill_category} onValueChange={(value) => handleInputChange('skill_category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SKILL_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Level *</Label>
                  <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="30"
                    max="180"
                    value={formData.duration_minutes}
                    onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you'll teach and what students will learn..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Target Role *</Label>
                <Select 
                  value={selectedRole} 
                  onValueChange={setSelectedRole}
                  disabled={!formData.skill_category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your target role" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.skill_category && ROLE_OPTIONS[formData.skill_category as keyof typeof ROLE_OPTIONS]?.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Quiz questions will be tailored to this specific role
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prerequisites">Prerequisites (Optional)</Label>
                <Textarea
                  id="prerequisites"
                  placeholder="What should students know before taking this session?"
                  rows={2}
                  value={formData.prerequisites}
                  onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={proceedToQuiz} className="flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>Take Validation Quiz</span>
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Demo Video Upload */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <Video className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Demo Video</h3>
                <p className="text-muted-foreground">
                  Upload a 3-5 minute video demonstrating your teaching ability
                </p>
              </div>

              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop<br />
                    MP4, MOV, AVI (max 50MB)
                  </p>
                </label>
              </div>

              {videoPreview && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <video 
                    controls 
                    className="w-full max-h-64 rounded-lg"
                    src={videoPreview}
                  />
                  <p className="text-sm text-muted-foreground">
                    File: {demoVideoFile?.name}
                  </p>
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Demo Video Guidelines</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Introduce yourself and your expertise</li>
                  <li>• Explain a key concept from your skill</li>
                  <li>• Demonstrate clear communication</li>
                  <li>• Keep it between 3-5 minutes</li>
                </ul>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={proceedToReview}>
                  Continue to Review
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Final Review */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Review Your Submission</h3>
                <p className="text-muted-foreground">
                  Please review all details before submitting
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{formData.skill_name}</CardTitle>
                  <CardDescription>{formData.skill_category} • {formData.level} • {selectedRole}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{formData.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{formData.duration_minutes} minutes</Badge>
                    <Badge variant="outline">Max {formData.max_learners} learner(s)</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      {quizPassed ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                      <span className="text-sm">
                        Quiz: {quizScore}% {quizPassed ? '(Passed)' : '(Failed)'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {demoVideoFile ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                      <span className="text-sm">
                        Demo Video {demoVideoFile ? 'Uploaded' : 'Missing'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What happens next?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your submission will be reviewed within 24 hours</li>
                  <li>• You'll be notified of the approval status</li>
                  <li>• Once approved, students can book your sessions</li>
                </ul>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button 
                  onClick={submitSkillOffering}
                  disabled={isSubmitting || !quizPassed || !demoVideoFile}
                  className="flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit for Review</span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <SkillQuiz
        open={showQuiz}
        onOpenChange={setShowQuiz}
        skillCategory={formData.skill_category}
        skillLevel={formData.level}
        targetRole={selectedRole}
        onQuizCompleted={handleQuizCompleted}
      />
    </>
  );
};

export default AddSkillModal;