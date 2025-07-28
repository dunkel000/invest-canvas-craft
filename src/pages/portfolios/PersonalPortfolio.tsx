import { DashboardLayout } from "@/components/DashboardLayout"
import { PortfolioStats } from "@/components/PortfolioStats"
import { PortfolioChart } from "@/components/PortfolioChart"
import ProtectedRoute from "@/components/ProtectedRoute"

const PersonalPortfolio = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Personal Portfolio</h2>
            <p className="text-muted-foreground">Your individual investment holdings and performance</p>
          </div>
          
          <PortfolioStats />
          <PortfolioChart />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PersonalPortfolio;