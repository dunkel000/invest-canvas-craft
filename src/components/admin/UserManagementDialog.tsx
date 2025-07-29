import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Shield, User, Trash2, UserPlus, BarChart3 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  roles: string[];
}

interface UserStats {
  portfolio_count: number;
  asset_count: number;
  total_value: number;
}

interface UserManagementDialogProps {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}

export const UserManagementDialog = ({ user, isOpen, onClose, onUserUpdated }: UserManagementDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user && isOpen) {
      fetchUserStats();
    }
  }, [user, isOpen]);

  const fetchUserStats = async () => {
    if (!user) return;
    
    setStatsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_user_statistics', {
        _user_id: user.id
      });

      if (error) throw error;
      setUserStats(data as unknown as UserStats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const assignRole = async (role: 'admin' | 'manager' | 'user') => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('assign_role_to_user', {
        _user_email: user.email,
        _role: role
      });

      if (error) throw error;

      if (data) {
        // Log the action
        await supabase.rpc('log_admin_action', {
          _action: `assign_role_${role}`,
          _target_user_id: user.id,
          _details: { role, user_email: user.email }
        });

        toast({
          title: "Success",
          description: `${role} role assigned to ${user.email}`,
        });
        onUserUpdated();
      } else {
        toast({
          title: "Error",
          description: "Failed to assign role",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeRole = async (role: 'admin' | 'manager' | 'user') => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('remove_role_from_user', {
        _user_email: user.email,
        _role: role
      });

      if (error) throw error;

      if (data) {
        // Log the action
        await supabase.rpc('log_admin_action', {
          _action: `remove_role_${role}`,
          _target_user_id: user.id,
          _details: { role, user_email: user.email }
        });

        toast({
          title: "Success",
          description: `${role} role removed from ${user.email}`,
        });
        onUserUpdated();
      } else {
        toast({
          title: "Error",
          description: "Failed to remove role",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4" />;
      case 'manager':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive' as const;
      case 'manager':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  const canRemoveRole = (role: string) => {
    return role !== 'user'; // Can't remove the default user role
  };

  const hasRole = (role: string) => {
    return user?.roles.includes(role) || false;
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage User: {user.email}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information */}
          <div>
            <h3 className="text-lg font-medium mb-3">User Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">User ID:</span>
                <div className="font-mono">{user.id.slice(0, 8)}...</div>
              </div>
              <div>
                <span className="text-muted-foreground">Created:</span>
                <div>{new Date(user.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* User Statistics */}
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              User Statistics
            </h3>
            {statsLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : userStats ? (
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{userStats.portfolio_count}</div>
                  <div className="text-muted-foreground">Portfolios</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{userStats.asset_count}</div>
                  <div className="text-muted-foreground">Assets</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">${userStats.total_value.toLocaleString()}</div>
                  <div className="text-muted-foreground">Total Value</div>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">Failed to load statistics</div>
            )}
          </div>

          <Separator />

          {/* Role Management */}
          <div>
            <h3 className="text-lg font-medium mb-3">Role Management</h3>
            
            {/* Current Roles */}
            <div className="mb-4">
              <span className="text-sm text-muted-foreground mb-2 block">Current Roles:</span>
              <div className="flex gap-2 flex-wrap">
                {user.roles.map((role) => (
                  <div key={role} className="flex items-center gap-1">
                    <Badge variant={getRoleVariant(role)} className="flex items-center gap-1">
                      {getRoleIcon(role)}
                      {role}
                    </Badge>
                    {canRemoveRole(role) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Role</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove the "{role}" role from {user.email}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeRole(role as 'admin' | 'manager' | 'user')} disabled={loading}>
                              Remove Role
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add Roles */}
            <div>
              <span className="text-sm text-muted-foreground mb-2 block">Add Roles:</span>
              <div className="flex gap-2">
                {!hasRole('admin') && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => assignRole('admin')}
                    disabled={loading}
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Make Admin
                  </Button>
                )}
                {!hasRole('manager') && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => assignRole('manager')}
                    disabled={loading}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Make Manager
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};