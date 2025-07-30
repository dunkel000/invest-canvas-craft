import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import AdminRoute from "@/components/AdminRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Settings, Database, Mail, Shield, AlertTriangle, Download, Package, Users, Crown, Star, User, Zap } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

interface SystemModule {
  id: string;
  module_id: string;
  name: string;
  path: string;
  icon: string;
  category: string;
  description: string;
  min_role: string;
  requires_subscription: boolean;
  is_active: boolean;
  sort_order: number;
}

interface RolePermission {
  role: string;
  module_id: string;
  is_enabled: boolean;
}

const roleLabels = {
  admin: 'Admin',
  investment_professional: 'Investment Professional',
  premium_user: 'Premium User',
  standard_user: 'Standard User',
  user: 'User'
};

const roleIcons = {
  admin: Crown,
  investment_professional: Star,
  premium_user: Zap,
  standard_user: User,
  user: User
};

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    portfolioCreationEnabled: true,
    apiConnectionsEnabled: true,
    maxPortfoliosPerUser: 10,
    dataRetentionDays: 365,
    systemMessage: "",
  });
  
  const [modules, setModules] = useState<SystemModule[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [modulesLoading, setModulesLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchModulesAndPermissions();
  }, []);

  const fetchModulesAndPermissions = async () => {
    try {
      // Fetch all system modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('system_modules')
        .select('*')
        .order('sort_order');

      if (modulesError) throw modulesError;

      // Fetch all role permissions
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('role_module_permissions')
        .select('*');

      if (permissionsError) throw permissionsError;

      setModules(modulesData || []);
      setRolePermissions(permissionsData || []);
    } catch (error) {
      console.error('Error fetching modules and permissions:', error);
      toast({
        title: "Error",
        description: "Failed to load module settings",
        variant: "destructive",
      });
    } finally {
      setModulesLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // In a real app, you would save these to a database
      // For now, we'll just simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "System settings have been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRolePermission = async (role: string, moduleId: string, enabled: boolean) => {
    try {
      const { error } = await supabase.rpc('update_role_module_permission', {
        _role: role as any, // Cast to avoid enum type issues
        _module_id: moduleId,
        _enabled: enabled
      });

      if (error) throw error;

      // Update local state
      setRolePermissions(prev => {
        const existing = prev.find(p => p.role === role && p.module_id === moduleId);
        if (existing) {
          return prev.map(p => 
            p.role === role && p.module_id === moduleId 
              ? { ...p, is_enabled: enabled }
              : p
          );
        } else {
          return [...prev, { role, module_id: moduleId, is_enabled: enabled }];
        }
      });

      toast({
        title: "Success",
        description: `Module access updated for ${roleLabels[role as keyof typeof roleLabels]}`,
      });
    } catch (error) {
      console.error('Error updating role permission:', error);
      toast({
        title: "Error",
        description: "Failed to update module access",
        variant: "destructive",
      });
    }
  };

  const getPermissionForRole = (role: string, moduleId: string): boolean => {
    const permission = rolePermissions.find(p => p.role === role && p.module_id === moduleId);
    return permission?.is_enabled ?? true; // Default to true if no explicit permission
  };

  const performBackup = async () => {
    setLoading(true);
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success",
        description: "Database backup completed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Backup failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'investment_professional': return 'default';
      case 'premium_user': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">System Settings</h2>
            <p className="text-muted-foreground">Configure platform-wide settings and module access</p>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General Settings</TabsTrigger>
              <TabsTrigger value="modules">Module Management</TabsTrigger>
              <TabsTrigger value="database">Database Operations</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              {/* Platform Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Platform Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenance">Maintenance Mode</Label>
                      <div className="text-sm text-muted-foreground">
                        Temporarily disable access to the platform
                      </div>
                    </div>
                    <Switch
                      id="maintenance"
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="registration">User Registration</Label>
                      <div className="text-sm text-muted-foreground">
                        Allow new users to register accounts
                      </div>
                    </div>
                    <Switch
                      id="registration"
                      checked={settings.registrationEnabled}
                      onCheckedChange={(checked) => handleSettingChange('registrationEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="portfolios">Portfolio Creation</Label>
                      <div className="text-sm text-muted-foreground">
                        Allow users to create new portfolios
                      </div>
                    </div>
                    <Switch
                      id="portfolios"
                      checked={settings.portfolioCreationEnabled}
                      onCheckedChange={(checked) => handleSettingChange('portfolioCreationEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="api-connections">API Connections</Label>
                      <div className="text-sm text-muted-foreground">
                        Allow users to connect external APIs
                      </div>
                    </div>
                    <Switch
                      id="api-connections"
                      checked={settings.apiConnectionsEnabled}
                      onCheckedChange={(checked) => handleSettingChange('apiConnectionsEnabled', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* System Limits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    System Limits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="max-portfolios">Maximum Portfolios per User</Label>
                    <Input
                      id="max-portfolios"
                      type="number"
                      value={settings.maxPortfoliosPerUser}
                      onChange={(e) => handleSettingChange('maxPortfoliosPerUser', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="retention">Data Retention (Days)</Label>
                    <Input
                      id="retention"
                      type="number"
                      value={settings.dataRetentionDays}
                      onChange={(e) => handleSettingChange('dataRetentionDays', parseInt(e.target.value))}
                      className="mt-1"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      How long to keep user data before automatic deletion
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Message */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    System Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="system-message">System-wide Message</Label>
                    <Textarea
                      id="system-message"
                      placeholder="Enter a message to display to all users..."
                      value={settings.systemMessage}
                      onChange={(e) => handleSettingChange('systemMessage', e.target.value)}
                      className="mt-1"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      This message will be displayed as a banner to all users
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Save Settings */}
              <div className="flex justify-end">
                <Button onClick={saveSettings} disabled={loading}>
                  {loading ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="modules" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Module Access Control
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure which modules are available for each user role
                  </p>
                </CardHeader>
                <CardContent>
                  {modulesLoading ? (
                    <div className="text-center py-8">Loading modules...</div>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(
                        modules.reduce((acc, module) => {
                          if (!acc[module.category]) acc[module.category] = [];
                          acc[module.category].push(module);
                          return acc;
                        }, {} as Record<string, SystemModule[]>)
                      ).map(([category, categoryModules]) => (
                        <div key={category} className="space-y-4">
                          <h3 className="text-lg font-semibold capitalize">{category} Modules</h3>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Module</TableHead>
                                <TableHead>Admin</TableHead>
                                <TableHead>Investment Pro</TableHead>
                                <TableHead>Premium User</TableHead>
                                <TableHead>Standard User</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {categoryModules.map((module) => (
                                <TableRow key={module.id}>
                                  <TableCell>
                                    <div className="space-y-1">
                                      <div className="font-medium">{module.name}</div>
                                      <div className="text-sm text-muted-foreground">{module.description}</div>
                                      <div className="flex gap-2">
                                        <Badge variant={getRoleBadgeVariant(module.min_role)} className="text-xs">
                                          Min: {roleLabels[module.min_role as keyof typeof roleLabels]}
                                        </Badge>
                                        {module.requires_subscription && (
                                          <Badge variant="outline" className="text-xs">Premium</Badge>
                                        )}
                                      </div>
                                    </div>
                                  </TableCell>
                                  {['admin', 'investment_professional', 'premium_user', 'standard_user'].map((role) => (
                                    <TableCell key={role}>
                                      <Switch
                                        checked={getPermissionForRole(role, module.module_id)}
                                        onCheckedChange={(checked) => updateRolePermission(role, module.module_id, checked)}
                                        disabled={loading}
                                      />
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="database" className="space-y-6">
              {/* Database Operations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Operations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={performBackup}
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Create Backup
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Reset System
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset System</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will reset all system settings to their default values. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Reset System
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
};

export default SystemSettings;