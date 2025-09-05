import { DashboardLayout } from "@/components/DashboardLayout"
import { AnalysisWidgets } from "@/components/analysis/AnalysisWidgets"
import { ChartBuilder } from "@/components/analysis/ChartBuilder"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProtectedRoute from "@/components/ProtectedRoute"

const Analysis = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Tabs defaultValue="widgets" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="widgets">Analysis Widgets</TabsTrigger>
            <TabsTrigger value="builder">Chart Builder</TabsTrigger>
          </TabsList>
          
          <TabsContent value="widgets" className="space-y-6 mt-6">
            <AnalysisWidgets />
          </TabsContent>
          
          <TabsContent value="builder" className="space-y-6 mt-6">
            <ChartBuilder />
          </TabsContent>
        </Tabs>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Analysis;