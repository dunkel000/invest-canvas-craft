import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Percent } from 'lucide-react';
import { Portfolio } from '@/hooks/usePortfolios';

interface PerformanceAnalysisProps {
  portfolio: Portfolio | null;
}

// Mock performance data
const performanceData = [
  { period: 'Jan', return: 2.1, benchmark: 1.8, cumulative: 102.1 },
  { period: 'Feb', return: 1.3, benchmark: 0.9, cumulative: 103.4 },
  { period: 'Mar', return: -0.8, benchmark: -1.2, cumulative: 102.6 },
  { period: 'Apr', return: 3.2, benchmark: 2.8, cumulative: 105.9 },
  { period: 'May', return: 1.7, benchmark: 1.4, cumulative: 107.7 },
  { period: 'Jun', return: 2.4, benchmark: 2.1, cumulative: 110.3 },
];

const metrics = [
  { label: 'Total Return', value: '10.3%', benchmark: '8.1%', period: 'YTD' },
  { label: 'Annualized Return', value: '12.8%', benchmark: '10.2%', period: '3Y' },
  { label: 'Volatility', value: '14.2%', benchmark: '16.1%', period: '1Y' },
  { label: 'Sharpe Ratio', value: '0.89', benchmark: '0.72', period: '1Y' },
  { label: 'Max Drawdown', value: '-8.4%', benchmark: '-12.1%', period: '1Y' },
  { label: 'Beta', value: '0.92', benchmark: '1.00', period: '1Y' },
];

const monthlyReturns = [
  { month: 'Jan', portfolio: 2.1, benchmark: 1.8 },
  { month: 'Feb', portfolio: 1.3, benchmark: 0.9 },
  { month: 'Mar', portfolio: -0.8, benchmark: -1.2 },
  { month: 'Apr', portfolio: 3.2, benchmark: 2.8 },
  { month: 'May', portfolio: 1.7, benchmark: 1.4 },
  { month: 'Jun', portfolio: 2.4, benchmark: 2.1 },
];

export function PerformanceAnalysis({ portfolio }: PerformanceAnalysisProps) {
  if (!portfolio) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a portfolio to view performance analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {metric.period}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">vs Benchmark:</span>
                  <span className="font-medium">{metric.benchmark}</span>
                  {parseFloat(metric.value) > parseFloat(metric.benchmark) ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="cumulative" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="cumulative">Cumulative Returns</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="cumulative" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Cumulative Performance
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Portfolio vs benchmark cumulative returns over time
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
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
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--popover-foreground))'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cumulative" 
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

        <TabsContent value="monthly" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Monthly Returns
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Month-by-month performance comparison
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="month" 
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
                    <Bar 
                      dataKey="portfolio" 
                      fill="hsl(var(--primary))" 
                      name="Portfolio"
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar 
                      dataKey="benchmark" 
                      fill="hsl(var(--muted-foreground))" 
                      name="Benchmark"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}