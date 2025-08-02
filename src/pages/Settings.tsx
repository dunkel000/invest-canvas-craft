import { DashboardLayout } from "@/components/DashboardLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import { ProfileSettings } from "@/components/ProfileSettings"

const Settings = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Settings</h2>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          
          <ProfileSettings />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Settings;