import { DashboardLayout } from "@/components/DashboardLayout";
import AdminRoute from "@/components/AdminRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Database, Settings, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
            <p className="text-muted-foreground">Manage users, system settings, and monitor activity</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Management</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  Manage user accounts and roles
                </p>
                <Link to="/admin/users">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Users
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Analytics</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  View platform usage statistics
                </p>
                <Link to="/admin/analytics">
                  <Button variant="outline" size="sm" className="w-full">
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Settings</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  Configure system preferences
                </p>
                <Link to="/admin/settings">
                  <Button variant="outline" size="sm" className="w-full">
                    Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" asChild>
                  <Link to="/admin/users">
                    <Users className="mr-2 h-4 w-4" />
                    Promote User to Admin
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/admin/analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Generate Report
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
};

export default AdminDashboard;