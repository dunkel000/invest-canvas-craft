import { DashboardLayout } from "@/components/DashboardLayout"
import { FlowDesigner as FlowDesignerComponent } from "@/components/FlowDesigner"

const FlowDesigner = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Flow Designer</h2>
          <p className="text-muted-foreground">Design and visualize your investment workflows</p>
        </div>
        
        <FlowDesignerComponent />
      </div>
    </DashboardLayout>
  );
};

export default FlowDesigner;