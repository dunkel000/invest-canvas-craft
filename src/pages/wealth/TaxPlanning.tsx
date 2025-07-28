import { DashboardLayout } from "@/components/DashboardLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const TaxPlanning = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Tax Planning</h2>
            <p className="text-muted-foreground">Optimize your tax strategy across all holdings</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Tax Loss Harvesting</CardTitle>
                <CardDescription>Opportunities to offset gains</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tax-Advantaged Accounts</CardTitle>
                <CardDescription>IRA, 401k optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Capital Gains Analysis</CardTitle>
                <CardDescription>Short vs long-term planning</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default TaxPlanning;