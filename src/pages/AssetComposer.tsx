import { DashboardLayout } from "@/components/DashboardLayout"
import { HeroSection } from "@/components/HeroSection"
import { AssetComposer as AssetComposerComponent } from "@/components/AssetComposer"
import ProtectedRoute from "@/components/ProtectedRoute"

const AssetComposerPage = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <HeroSection 
          title="Compose your own Symphony"
          subtitle="Design and analyze your asset compositions with cashflows and risk assessments"
        />

        <div className="space-y-6">          
          <AssetComposerComponent />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AssetComposerPage;