import { DashboardLayout } from "@/components/DashboardLayout"
import { PortfolioStats } from "@/components/PortfolioStats"
import { PortfolioChart } from "@/components/PortfolioChart"
import ProtectedRoute from "@/components/ProtectedRoute"

const Index = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
            <p className="text-muted-foreground">Monitor your investment portfolio performance</p>
          </div>
          
          <PortfolioStats />
          <PortfolioChart />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Index;
