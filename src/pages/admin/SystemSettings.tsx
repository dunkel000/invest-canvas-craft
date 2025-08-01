import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import AdminRoute from "@/components/AdminRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Settings, Database, Mail, Shield, AlertTriangle, Download, Package, Users, Crown, Star, User, Zap, TrendingUp } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

interface RoleLimits {
  role: string;
  max_portfolios: number;
  max_api_connections: number;
  max_requests_per_day: number;
  subscription_tier: string;
  features_enabled: any;
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
  investment_professional: TrendingUp,
  premium_user: Star,
  standard_user: User,
  user: Shield
};

const tierColors = {
  enterprise: "bg-purple-600",
  professional: "bg-blue-600", 
  premium: "bg-gold-600",
  standard: "bg-green-600",
  basic: "bg-gray-600"
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
  const [roleLimits, setRoleLimits] = useState<Record<string, RoleLimits>>({});
  const [loading, setLoading] = useState(false);
  const [modulesLoading, setModulesLoading] = useState(true);

  useEffect(() => {
    fetchModulesAndPermissions();
    fetchRoleLimits();
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
      toast.error('Failed to load module settings');
    } finally {
      setModulesLoading(false);
    }
  };

  const fetchRoleLimits = async () => {
    try {
      const roles = ['admin', 'investment_professional', 'premium_user', 'standard_user', 'user'] as const
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, max_portfolios, max_api_connections, max_requests_per_day, subscription_tier, features_enabled')
        .in('role', roles)
        .limit(1)
        .order('created_at', { ascending: false })

      if (error) throw error

      const limitsMap: Record<string, RoleLimits> = {}
      data?.forEach((item: any) => {
        limitsMap[item.role] = item
      })

      // Set defaults for roles that don't exist yet
      roles.forEach(role => {
        if (!limitsMap[role]) {
          limitsMap[role] = {
            role,
            max_portfolios: role === 'admin' ? -1 : 5,
            max_api_connections: role === 'admin' ? -1 : 2,
            max_requests_per_day: role === 'admin' ? -1 : 1000,
            subscription_tier: 'basic',
            features_enabled: {}
          }
        }
      })

      setRoleLimits(limitsMap)
    } catch (error) {
      console.error('Error fetching role limits:', error)
      toast.error('Failed to fetch role limits')
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
      
      toast.success("System settings have been saved");
    } catch (error) {
      toast.error("Failed to save settings");
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

      toast.success(`Module access updated for ${roleLabels[role as keyof typeof roleLabels]}`);
    } catch (error) {
      console.error('Error updating role permission:', error);
      toast.error("Failed to update module access");
    }
  };

  const getPermissionForRole = (role: string, moduleId: string): boolean => {
    const permission = rolePermissions.find(p => p.role === role && p.module_id === moduleId);
    return permission?.is_enabled ?? true; // Default to true if no explicit permission
  };

  const updateRoleLimits = async (role: string, limits: Partial<RoleLimits>) => {
    try {
      const { error } = await supabase.rpc('update_role_limits', {
        _role: role as any,
        _max_portfolios: limits.max_portfolios,
        _max_api_connections: limits.max_api_connections,
        _max_requests_per_day: limits.max_requests_per_day,
        _features_enabled: limits.features_enabled || {},
        _subscription_tier: limits.subscription_tier || 'basic'
      })

      if (error) throw error

      setRoleLimits(prev => ({
        ...prev,
        [role]: { ...prev[role], ...limits }
      }))

      toast.success(`Updated limits for ${roleLabels[role as keyof typeof roleLabels]}`)
    } catch (error) {
      console.error('Error updating role limits:', error)
      toast.error('Failed to update role limits')
    }
  }

  const performBackup = async () => {
    setLoading(true);
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Database backup completed successfully");
    } catch (error) {
      toast.error("Backup failed");
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="modules">Module Management</TabsTrigger>
            <TabsTrigger value="roles">Role Configuration</TabsTrigger>
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

          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Role Limits & Permissions
                </CardTitle>
                <CardDescription>
                  Configure portfolio limits, API access, and feature permissions for each user role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(roleLabels).map(([roleKey, roleLabel]) => {
                  const Icon = roleIcons[roleKey as keyof typeof roleIcons]
                  const limits = roleLimits[roleKey]
                  
                  if (!limits) return null

                  return (
                    <Card key={roleKey} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Icon className="w-6 h-6" />
                          <div>
                            <h3 className="text-lg font-semibold">{roleLabel}</h3>
                            <Badge variant="outline" className={`${tierColors[limits.subscription_tier as keyof typeof tierColors]} text-white`}>
                              {limits.subscription_tier?.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`${roleKey}-portfolios`}>Max Portfolios</Label>
                          <Input
                            id={`${roleKey}-portfolios`}
                            type="number"
                            value={limits.max_portfolios === -1 ? '' : limits.max_portfolios}
                            placeholder="Unlimited"
                            onChange={(e) => {
                              const value = e.target.value === '' ? -1 : parseInt(e.target.value)
                              updateRoleLimits(roleKey, { max_portfolios: value })
                            }}
                          />
                          <p className="text-xs text-muted-foreground">
                            {limits.max_portfolios === -1 ? 'Unlimited' : `Maximum ${limits.max_portfolios} portfolios`}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`${roleKey}-api`}>Max API Connections</Label>
                          <Input
                            id={`${roleKey}-api`}
                            type="number"
                            value={limits.max_api_connections === -1 ? '' : limits.max_api_connections}
                            placeholder="Unlimited"
                            onChange={(e) => {
                              const value = e.target.value === '' ? -1 : parseInt(e.target.value)
                              updateRoleLimits(roleKey, { max_api_connections: value })
                            }}
                          />
                          <p className="text-xs text-muted-foreground">
                            {limits.max_api_connections === -1 ? 'Unlimited' : `Maximum ${limits.max_api_connections} connections`}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`${roleKey}-requests`}>Daily API Requests</Label>
                          <Input
                            id={`${roleKey}-requests`}
                            type="number"
                            value={limits.max_requests_per_day === -1 ? '' : limits.max_requests_per_day}
                            placeholder="Unlimited"
                            onChange={(e) => {
                              const value = e.target.value === '' ? -1 : parseInt(e.target.value)
                              updateRoleLimits(roleKey, { max_requests_per_day: value })
                            }}
                          />
                          <p className="text-xs text-muted-foreground">
                            {limits.max_requests_per_day === -1 ? 'Unlimited' : `${limits.max_requests_per_day.toLocaleString()} requests/day`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-3">Feature Access</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {['advanced_analytics', 'ai_recommendations', 'risk_modeling', 'custom_reports'].map((feature) => (
                            <div key={feature} className="flex items-center space-x-2">
                              <Switch
                                id={`${roleKey}-${feature}`}
                                checked={limits.features_enabled?.[feature] || false}
                                onCheckedChange={(checked) => {
                                  updateRoleLimits(roleKey, {
                                    features_enabled: {
                                      ...limits.features_enabled,
                                      [feature]: checked
                                    }
                                  })
                                }}
                              />
                              <Label htmlFor={`${roleKey}-${feature}`} className="text-sm">
                                {feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  )
                })}
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