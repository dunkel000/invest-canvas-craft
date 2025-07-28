import { DashboardLayout } from "@/components/DashboardLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const FinancialGoals = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Financial Goals</h2>
            <p className="text-muted-foreground">Track progress towards your financial objectives</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Retirement Planning</CardTitle>
                <CardDescription>Long-term wealth building</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Home Purchase</CardTitle>
                <CardDescription>Down payment savings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Education Fund</CardTitle>
                <CardDescription>College savings planning</CardDescription>
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

export default FinancialGoals;