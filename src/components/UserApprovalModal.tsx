import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, User, Mail, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserApprovalModal = ({ open, onOpenChange }: UserApprovalModalProps) => {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPendingUsers();
    }
  }, [open]);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingUsers(data || []);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      toast({
        title: "Error loading users",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId: string, userName: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          approved, 
          approved_at: approved ? new Date().toISOString() : null,
          approved_by: approved ? (await supabase.auth.getUser()).data.user?.id : null
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: approved ? "User Approved" : "User Rejected",
        description: `${userName} has been ${approved ? 'approved' : 'rejected'}`,
      });

      // Refresh the list
      fetchPendingUsers();
    } catch (error) {
      console.error('Error updating user approval:', error);
      toast({
        title: "Error updating approval",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>User Approval Queue</span>
          </DialogTitle>
          <DialogDescription>
            Review and approve new user registrations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : pendingUsers.length > 0 ? (
            pendingUsers.map((user) => (
              <Card key={user.id} className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <CardDescription className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatTimeAgo(user.created_at)}</span>
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Pending</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Role:</span>
                      <span className="ml-2 capitalize">{user.role}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Mobile:</span>
                      <span className="ml-2">{user.mobile_number || 'Not provided'}</span>
                    </div>
                  </div>
                  {user.bio && (
                    <div>
                      <span className="font-medium text-muted-foreground text-sm">Bio:</span>
                      <p className="text-sm mt-1">{user.bio}</p>
                    </div>
                  )}
                  {user.interests && (
                    <div>
                      <span className="font-medium text-muted-foreground text-sm">Interests:</span>
                      <p className="text-sm mt-1">{user.interests}</p>
                    </div>
                  )}
                  <div className="flex space-x-3 pt-2">
                    <Button
                      onClick={() => handleApproval(user.user_id, user.name, true)}
                      className="flex items-center space-x-2"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </Button>
                    <Button
                      onClick={() => handleApproval(user.user_id, user.name, false)}
                      variant="destructive"
                      className="flex items-center space-x-2"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-muted-foreground">No pending user approvals</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserApprovalModal;