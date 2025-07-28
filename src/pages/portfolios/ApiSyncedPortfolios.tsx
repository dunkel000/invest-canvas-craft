import { DashboardLayout } from "@/components/DashboardLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const ApiSyncedPortfolios = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">API Synced Portfolios</h2>
            <p className="text-muted-foreground">Portfolios automatically synchronized from brokers and platforms</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Broker Integrations</CardTitle>
                <CardDescription>Connected brokerage accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No connected accounts</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Crypto Exchanges</CardTitle>
                <CardDescription>Digital asset platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No connected exchanges</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Bank Accounts</CardTitle>
                <CardDescription>Savings and checking accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No connected banks</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ApiSyncedPortfolios;