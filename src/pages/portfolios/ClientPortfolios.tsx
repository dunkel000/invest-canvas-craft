import { DashboardLayout } from "@/components/DashboardLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const ClientPortfolios = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Client Portfolios</h2>
            <p className="text-muted-foreground">Manage portfolios for your advisory clients</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Active Clients</CardTitle>
                <CardDescription>Currently managed portfolios</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No active clients</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Reports</CardTitle>
                <CardDescription>Client portfolio summaries</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No reports generated</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Billing & Fees</CardTitle>
                <CardDescription>Advisory fee management</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No billing setup</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ClientPortfolios;