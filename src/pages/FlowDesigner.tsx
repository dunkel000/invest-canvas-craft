import { DashboardLayout } from "@/components/DashboardLayout"
import { AssetComposer as AssetComposerComponent } from "@/components/FlowDesigner"
import ProtectedRoute from "@/components/ProtectedRoute"

const FlowDesigner = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Asset Composer</h2>
            <p className="text-muted-foreground">Design and analyze your asset compositions with cashflows and risk assessments</p>
          </div>
          
          <AssetComposerComponent />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default FlowDesigner;