import { DashboardLayout } from "@/components/DashboardLayout"
import { PortfolioStats } from "@/components/PortfolioStats"
import { PortfolioChart } from "@/components/PortfolioChart"
import ProtectedRoute from "@/components/ProtectedRoute"

const AllPortfolios = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">All Portfolios</h2>
            <p className="text-muted-foreground">Unified view of all your investment portfolios and holdings</p>
          </div>
          
          <PortfolioStats />
          <PortfolioChart />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AllPortfolios;