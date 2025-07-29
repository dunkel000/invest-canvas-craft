import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import AdminRoute from "@/components/AdminRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Crown, User } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  roles: string[];
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [promotionEmail, setPromotionEmail] = useState("");
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      // For now, we'll use a mock implementation since we can't directly query auth.users
      // In a real implementation, you'd need an admin API endpoint or edge function
      setUsers([]);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async () => {
    if (!promotionEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('promote_to_admin', { _user_email: promotionEmail });

      if (error) {
        throw error;
      }

      if (data) {
        toast({
          title: "Success",
          description: `User ${promotionEmail} has been promoted to admin`,
        });
        setPromotionEmail("");
        fetchUsers();
      } else {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      toast({
        title: "Error",
        description: "Failed to promote user",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">User Management</h2>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Promote User to Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter user email"
                  value={promotionEmail}
                  onChange={(e) => setPromotionEmail(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={promoteToAdmin}>
                  <Crown className="mr-2 h-4 w-4" />
                  Promote to Admin
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">
                    User listing requires additional admin API endpoints to be implemented.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    For now, use the "Promote to Admin" function above to manage admin roles.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
};

export default UserManagement;