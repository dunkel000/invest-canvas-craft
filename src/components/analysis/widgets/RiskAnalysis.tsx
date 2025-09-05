import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts';
import { AlertTriangle, Shield, TrendingDown, Activity } from 'lucide-react';
import { Portfolio } from '@/hooks/usePortfolios';

interface RiskAnalysisProps {
  portfolio: Portfolio | null;
}

// Mock risk data
const riskMetrics = [
  { label: 'Portfolio Beta', value: '0.92', benchmark: '1.00', status: 'low' },
  { label: 'Value at Risk (1%)', value: '-4.2%', benchmark: '-5.8%', status: 'medium' },
  { label: 'Tracking Error', value: '3.1%', benchmark: '0%', status: 'medium' },
  { label: 'Information Ratio', value: '0.64', benchmark: '0.00', status: 'high' },
  { label: 'Downside Deviation', value: '8.7%', benchmark: '11.2%', status: 'low' },
  { label: 'Calmar Ratio', value: '1.52', benchmark: '0.84', status: 'high' },
];

const volatilityData = [
  { period: 'Jan', portfolio: 12.4, benchmark: 15.1 },
  { period: 'Feb', portfolio: 14.2, benchmark: 16.8 },
  { period: 'Mar', portfolio: 18.7, benchmark: 22.3 },
  { period: 'Apr', portfolio: 11.9, benchmark: 14.6 },
  { period: 'May', portfolio: 13.5, benchmark: 15.9 },
  { period: 'Jun', portfolio: 10.8, benchmark: 13.2 },
];

const drawdownData = [
  { period: 'Jan', drawdown: 0 },
  { period: 'Feb', drawdown: -1.2 },
  { period: 'Mar', drawdown: -5.8 },
  { period: 'Apr', drawdown: -2.1 },
  { period: 'May', drawdown: -0.8 },
  { period: 'Jun', drawdown: 0 },
];

const stressTest = [
  { scenario: 'Market Crash (-20%)', impact: '-18.2%', confidence: '95%' },
  { scenario: 'Interest Rate +200bp', impact: '-12.4%', confidence: '90%' },
  { scenario: 'Currency Crisis', impact: '-8.7%', confidence: '85%' },
  { scenario: 'Inflation Spike', impact: '-6.3%', confidence: '80%' },
];

const getRiskColor = (status: string) => {
  switch (status) {
    case 'low':
      return 'text-success';
    case 'medium':
      return 'text-warning';
    case 'high':
      return 'text-primary';
    default:
      return 'text-muted-foreground';
  }
};

const getRiskBadge = (status: string) => {
  switch (status) {
    case 'low':
      return 'Low Risk';
    case 'medium':
      return 'Medium Risk';
    case 'high':
      return 'High Return';
    default:
      return 'Unknown';
  }
};

export function RiskAnalysis({ portfolio }: RiskAnalysisProps) {
  if (!portfolio) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a portfolio to view risk analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Risk Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {riskMetrics.map((metric) => (
          <Card key={metric.label} className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getRiskColor(metric.status)}`}
                >
                  {getRiskBadge(metric.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Benchmark:</span>
                  <span className="font-medium">{metric.benchmark}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Charts */}
      <Tabs defaultValue="volatility" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="volatility">Volatility</TabsTrigger>
          <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
          <TabsTrigger value="stress">Stress Test</TabsTrigger>
        </TabsList>

        <TabsContent value="volatility" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Rolling Volatility Analysis
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                30-day rolling volatility vs benchmark
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={volatilityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="period" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--popover-foreground))'
                      }}
                      formatter={(value: number) => [`${value}%`, '']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="portfolio" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      name="Portfolio"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="benchmark" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 4 }}
                      name="Benchmark"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drawdown" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Drawdown Analysis
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Peak-to-trough portfolio declines
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={drawdownData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="period" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--popover-foreground))'
                      }}
                      formatter={(value: number) => [`${value}%`, 'Drawdown']}
                    />
                    <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                    <Bar 
                      dataKey="drawdown" 
                      fill="hsl(var(--destructive))"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stress" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Stress Test Scenarios
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Portfolio impact under various stress scenarios
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stressTest.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-destructive/10">
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{test.scenario}</p>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {test.confidence}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-destructive">{test.impact}</p>
                      <p className="text-xs text-muted-foreground">Portfolio Impact</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Risk Assessment</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on current allocation, your portfolio shows moderate resilience to market stress. 
                      Consider increasing diversification to reduce exposure to systematic risks.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}