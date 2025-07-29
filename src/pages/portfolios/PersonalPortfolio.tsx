import { DashboardLayout } from "@/components/DashboardLayout"
import { PortfolioManager } from "@/components/PortfolioManager"
import ProtectedRoute from "@/components/ProtectedRoute"

const PersonalPortfolio = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PortfolioManager />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PersonalPortfolio;