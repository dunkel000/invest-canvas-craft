import { DashboardLayout } from "@/components/DashboardLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const InvestmentTemplates = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Investment Templates</h2>
            <p className="text-muted-foreground">Alternative assets: Pokémon cards, Real Estate, Collectibles, and more</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Collectibles</CardTitle>
                <CardDescription>Pokémon, Sports cards, Art</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No items tracked</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Real Estate</CardTitle>
                <CardDescription>Property investments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No properties tracked</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Precious Metals</CardTitle>
                <CardDescription>Gold, Silver, Platinum</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No metals tracked</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default InvestmentTemplates;