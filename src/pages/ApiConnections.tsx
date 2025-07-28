import { DashboardLayout } from "@/components/DashboardLayout"
import { ApiConnections as ApiConnectionsComponent } from "@/components/ApiConnections"
import ProtectedRoute from "@/components/ProtectedRoute"

const ApiConnections = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">API Connections</h2>
            <p className="text-muted-foreground">Connect and manage external portfolio data sources</p>
          </div>
          
          <ApiConnectionsComponent />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ApiConnections;