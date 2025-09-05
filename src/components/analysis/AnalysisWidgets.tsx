import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, PieChart, BarChart3, LineChart, Calculator, Target, AlertCircle, DollarSign } from 'lucide-react';
import { PerformanceAnalysis } from './widgets/PerformanceAnalysis';
import { AllocationAnalysis } from './widgets/AllocationAnalysis';
import { RiskAnalysis } from './widgets/RiskAnalysis';
import { BenchmarkAnalysis } from './widgets/BenchmarkAnalysis';
import { usePortfolios } from '@/hooks/usePortfolios';

const analysisWidgets = [
  {
    id: 'performance',
    title: 'Performance Analysis',
    description: 'Returns, volatility, and performance metrics',
    icon: TrendingUp,
    category: 'performance',
  },
  {
    id: 'allocation',
    title: 'Asset Allocation',
    description: 'Portfolio composition and diversification',
    icon: PieChart,
    category: 'allocation',
  },
  {
    id: 'risk',
    title: 'Risk Assessment',
    description: 'Risk metrics and stress testing',
    icon: AlertCircle,
    category: 'risk',
  },
  {
    id: 'benchmark',
    title: 'Benchmark Comparison',
    description: 'Compare against market indices',
    icon: BarChart3,
    category: 'performance',
  },
  {
    id: 'correlation',
    title: 'Correlation Matrix',
    description: 'Asset correlation analysis',
    icon: LineChart,
    category: 'risk',
  },
  {
    id: 'ratios',
    title: 'Financial Ratios',
    description: 'Sharpe, Sortino, and other ratios',
    icon: Calculator,
    category: 'performance',
  },
  {
    id: 'rebalancing',
    title: 'Rebalancing Analysis',
    description: 'Portfolio rebalancing recommendations',
    icon: Target,
    category: 'allocation',
  },
  {
    id: 'cashflow',
    title: 'Cash Flow Analysis',
    description: 'Income and dividend tracking',
    icon: DollarSign,
    category: 'cashflow',
  },
];

const categories = [
  { value: 'all', label: 'All Widgets' },
  { value: 'performance', label: 'Performance' },
  { value: 'allocation', label: 'Allocation' },
  { value: 'risk', label: 'Risk' },
  { value: 'cashflow', label: 'Cash Flow' },
];

export function AnalysisWidgets() {
  const { portfolios, selectedPortfolio } = usePortfolios();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeWidget, setActiveWidget] = useState<string | null>(null);

  const filteredWidgets = selectedCategory === 'all' 
    ? analysisWidgets 
    : analysisWidgets.filter(widget => widget.category === selectedCategory);

  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case 'performance':
        return <PerformanceAnalysis portfolio={selectedPortfolio} />;
      case 'allocation':
        return <AllocationAnalysis portfolio={selectedPortfolio} />;
      case 'risk':
        return <RiskAnalysis portfolio={selectedPortfolio} />;
      case 'benchmark':
        return <BenchmarkAnalysis portfolio={selectedPortfolio} />;
      default:
        return (
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Widget implementation coming soon</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Portfolio Analysis</h2>
          <p className="text-muted-foreground">
            Predefined analysis widgets for comprehensive portfolio insights
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedPortfolio && (
            <Badge variant="outline" className="px-3 py-1">
              {selectedPortfolio.name}
            </Badge>
          )}
        </div>
      </div>

      {activeWidget ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {analysisWidgets.find(w => w.id === activeWidget)?.title}
            </h3>
            <Button 
              variant="outline" 
              onClick={() => setActiveWidget(null)}
            >
              Back to Widgets
            </Button>
          </div>
          {renderWidget(activeWidget)}
        </div>
      ) : (
        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredWidgets.map((widget) => (
                <Card 
                  key={widget.id} 
                  className="bg-card border-border cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveWidget(widget.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <widget.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-sm font-medium text-foreground">
                          {widget.title}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {widget.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      {widget.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="space-y-2">
            {filteredWidgets.map((widget) => (
              <Card 
                key={widget.id} 
                className="bg-card border-border cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => setActiveWidget(widget.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <widget.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{widget.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {widget.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {widget.description}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Open
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}