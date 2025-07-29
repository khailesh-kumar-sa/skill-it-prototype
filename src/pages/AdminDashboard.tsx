import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BarChart3, 
  Settings, 
  Shield, 
  LogOut, 
  TrendingUp, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  UserPlus,
  MessageSquare,
  Star
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been securely logged out",
    });
    navigate('/');
  };

  // Mock data
  const stats = {
    totalUsers: 12547,
    activeUsers: 8234,
    newSignups: 234,
    revenue: 156890
  };

  const recentUsers = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "active", joinDate: "2024-01-15" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", status: "pending", joinDate: "2024-01-14" },
    { id: 3, name: "Carol Davis", email: "carol@example.com", status: "active", joinDate: "2024-01-13" },
    { id: 4, name: "David Wilson", email: "david@example.com", status: "inactive", joinDate: "2024-01-12" },
  ];

  const systemAlerts = [
    { id: 1, type: "warning", message: "High server load detected", time: "2 min ago" },
    { id: 2, type: "info", message: "Backup completed successfully", time: "1 hour ago" },
    { id: 3, type: "error", message: "Payment gateway timeout", time: "3 hours ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Skill It Management Portal</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-card-foreground">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="flex items-center mt-4 space-x-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm text-success font-medium">+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-card-foreground">{stats.activeUsers.toLocaleString()}</p>
                </div>
                <Activity className="w-8 h-8 text-accent" />
              </div>
              <div className="flex items-center mt-4 space-x-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm text-success font-medium">+8% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-premium/10 to-premium/5 border border-premium/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Signups</p>
                  <p className="text-2xl font-bold text-card-foreground">{stats.newSignups}</p>
                </div>
                <UserPlus className="w-8 h-8 text-premium" />
              </div>
              <div className="flex items-center mt-4 space-x-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm text-success font-medium">+23% today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold text-card-foreground">${stats.revenue.toLocaleString()}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-success" />
              </div>
              <div className="flex items-center mt-4 space-x-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm text-success font-medium">+18% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Feedback</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <CardTitle className="text-xl font-bold">User Management</CardTitle>
                    <CardDescription>Manage and monitor user accounts</CardDescription>
                  </div>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground font-semibold text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={
                          user.status === 'active' ? 'default' : 
                          user.status === 'pending' ? 'secondary' : 
                          'destructive'
                        }>
                          {user.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{user.joinDate}</span>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Monthly user registration trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Chart visualization would go here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feature Usage</CardTitle>
                  <CardDescription>Most popular platform features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Interview Trainer</span>
                      <span className="text-sm text-muted-foreground">78%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Career Test</span>
                      <span className="text-sm text-muted-foreground">65%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Skill Swap</span>
                      <span className="text-sm text-muted-foreground">52%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-premium h-2 rounded-full" style={{ width: '52%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Feedback</CardTitle>
                <CardDescription>Recent reviews and suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="font-medium">Sarah Johnson</span>
                      </div>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">"The interview trainer is amazing! Really helped me prepare for my job interviews."</p>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-400">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                          <Star className="w-4 h-4 text-muted" />
                        </div>
                        <span className="font-medium">Mike Chen</span>
                      </div>
                      <span className="text-sm text-muted-foreground">1 day ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">"Great platform overall. Would love to see more career paths in tech."</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure platform settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="site-name">Site Name</Label>
                      <Input id="site-name" defaultValue="Skill It" />
                    </div>
                    <div>
                      <Label htmlFor="support-email">Support Email</Label>
                      <Input id="support-email" defaultValue="support@skillit.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="max-users">Max Users</Label>
                      <Input id="max-users" defaultValue="50000" type="number" />
                    </div>
                    <div>
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input id="session-timeout" defaultValue="30" type="number" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Reset</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent system notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      alert.type === 'error' ? 'border-destructive/30 bg-destructive/5' :
                      alert.type === 'warning' ? 'border-warning/30 bg-warning/5' :
                      'border-primary/30 bg-primary/5'
                    }`}>
                      {alert.type === 'error' && <AlertTriangle className="w-5 h-5 text-destructive" />}
                      {alert.type === 'warning' && <Clock className="w-5 h-5 text-warning" />}
                      {alert.type === 'info' && <CheckCircle className="w-5 h-5 text-success" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-card-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;