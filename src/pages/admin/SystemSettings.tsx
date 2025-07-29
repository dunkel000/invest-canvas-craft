import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import AdminRoute from "@/components/AdminRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Settings, Database, Mail, Shield, AlertTriangle, Download } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">System Settings</h2>
            <p className="text-muted-foreground">Configure platform-wide settings and features</p>
          </div>

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

          {/* Save Settings */}
          <div className="flex justify-end">
            <Button onClick={saveSettings} disabled={loading}>
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
};

export default SystemSettings;