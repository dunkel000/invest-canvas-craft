import { DashboardLayout } from "@/components/DashboardLayout"
import { PortfolioStats } from "@/components/PortfolioStats"
import { PortfolioChart } from "@/components/PortfolioChart"
import { Button } from "@/components/ui/button"
import { AnalysisWidgets } from "@/components/analysis/AnalysisWidgets"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProtectedRoute from "@/components/ProtectedRoute"
import { BarChart3, TrendingUp } from "lucide-react"

const AllPortfolios = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">All Portfolios</h2>
              <p className="text-muted-foreground">Unified view of all your investment portfolios and holdings</p>
            </div>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Advanced Analysis
            </Button>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
              <TabsTrigger value="analysis">Quick Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-6">
              <PortfolioStats />
              <PortfolioChart />
            </TabsContent>
            
            <TabsContent value="analysis" className="space-y-6 mt-6">
              <AnalysisWidgets />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AllPortfolios;