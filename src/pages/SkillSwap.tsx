
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNavigation from "@/components/BottomNavigation";
import { toast } from "@/hooks/use-toast";

const SkillSwap = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const availableSkills = [
    {
      id: 1,
      skill: "React Development",
      user: "Sarah Chen",
      description: "5+ years experience building modern web applications with React and TypeScript",
      level: "Expert",
      rating: "4.9"
    },
    {
      id: 2,
      skill: "Graphic Design",
      user: "Mike Rodriguez",
      description: "Professional designer specializing in brand identity and digital marketing materials",
      level: "Advanced",
      rating: "4.8"
    },
    {
      id: 3,
      skill: "Python Programming",
      user: "Alex Kim",
      description: "Data science and machine learning expert with industry experience",
      level: "Expert",
      rating: "4.9"
    },
    {
      id: 4,
      skill: "Digital Marketing",
      user: "Emma Davis",
      description: "Growth marketing specialist with proven ROI track record",
      level: "Intermediate",
      rating: "4.7"
    }
  ];

  const myRequests = [
    {
      id: 1,
      skill: "UI/UX Design",
      requestedFrom: "Jordan Lee",
      status: "Pending",
      date: "2 days ago"
    },
    {
      id: 2,
      skill: "Public Speaking",
      requestedFrom: "Maria Garcia",
      status: "Accepted",
      date: "1 week ago"
    }
  ];

  const requestsReceived = [
    {
      id: 1,
      skill: "Project Management",
      requestedBy: "Tom Wilson",
      message: "I'd love to learn your project management approach for tech teams",
      date: "1 day ago"
    },
    {
      id: 2,
      skill: "Content Writing",
      requestedBy: "Lisa Park",
      message: "Could you help me improve my technical writing skills?",
      date: "3 days ago"
    }
  ];

  const handleSkillRequest = (skillId: number, skillName: string) => {
    toast({
      title: "Request Sent!",
      description: `Your request for ${skillName} has been sent`,
    });
  };

  const handleRequestAction = (requestId: number, action: string) => {
    toast({
      title: `Request ${action}`,
      description: `You have ${action.toLowerCase()} the skill swap request`,
    });
  };

  const filteredSkills = availableSkills.filter(skill =>
    skill.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-20">
      <div className="p-6">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Skill Swap</h1>
          <p className="text-gray-600">Exchange knowledge and grow together</p>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search skills or users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 text-lg"
          />
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            {filteredSkills.map((skill, index) => (
              <Card key={skill.id} className="hover:shadow-lg transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-800">{skill.skill}</CardTitle>
                      <CardDescription className="text-purple-600 font-medium">{skill.user} • {skill.level}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-500 text-sm">⭐ {skill.rating}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">{skill.description}</p>
                  <Button 
                    onClick={() => handleSkillRequest(skill.id, skill.skill)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Request Skill Swap
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="my-requests" className="space-y-4">
            {myRequests.map((request, index) => (
              <Card key={request.id} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-800">{request.skill}</h3>
                      <p className="text-sm text-gray-600">Requested from {request.requestedFrom}</p>
                      <p className="text-xs text-gray-500">{request.date}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'Accepted' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {request.status}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="received" className="space-y-4">
            {requestsReceived.map((request, index) => (
              <Card key={request.id} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-800">{request.skill}</h3>
                    <p className="text-sm text-purple-600 font-medium">From {request.requestedBy}</p>
                    <p className="text-sm text-gray-600 mt-2">{request.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{request.date}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleRequestAction(request.id, 'Accepted')}
                      size="sm" 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </Button>
                    <Button 
                      onClick={() => handleRequestAction(request.id, 'Declined')}
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                    >
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default SkillSwap;
