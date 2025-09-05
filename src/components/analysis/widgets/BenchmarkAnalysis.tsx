import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BarChart3, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { Portfolio } from '@/hooks/usePortfolios';
import { useState } from 'react';

interface BenchmarkAnalysisProps {
  portfolio: Portfolio | null;
}

// Mock benchmark data
const benchmarks = [
  { value: 'sp500', label: 'S&P 500' },
  { value: 'msci_world', label: 'MSCI World' },
  { value: 'nasdaq', label: 'NASDAQ 100' },
  { value: 'russell2000', label: 'Russell 2000' },
  { value: 'ftse100', label: 'FTSE 100' },
];

const performanceComparison = [
  { period: 'Jan', portfolio: 102.1, sp500: 101.8, msci_world: 101.5 },
  { period: 'Feb', portfolio: 103.4, sp500: 102.7, msci_world: 102.1 },
  { period: 'Mar', portfolio: 102.6, sp500: 101.5, msci_world: 100.9 },
  { period: 'Apr', portfolio: 105.9, sp500: 104.3, msci_world: 103.7 },
  { period: 'May', portfolio: 107.7, sp500: 105.7, msci_world: 105.1 },
  { period: 'Jun', portfolio: 110.3, sp500: 107.8, msci_world: 107.2 },
];

const relativePerformance = [
  { period: 'Jan', outperformance: 0.3 },
  { period: 'Feb', outperformance: 0.7 },
  { period: 'Mar', outperformance: 1.1 },
  { period: 'Apr', outperformance: 1.6 },
  { period: 'May', outperformance: 2.0 },
  { period: 'Jun', outperformance: 2.5 },
];

const benchmarkMetrics = {
  sp500: {
    correlation: 0.87,
    beta: 0.92,
    alpha: 2.1,
    tracking_error: 3.2,
    information_ratio: 0.66,
    excess_return: 2.5,
  },
  msci_world: {
    correlation: 0.82,
    beta: 0.89,
    alpha: 2.8,
    tracking_error: 4.1,
    information_ratio: 0.68,
    excess_return: 3.1,
  },
};

export function BenchmarkAnalysis({ portfolio }: BenchmarkAnalysisProps) {
  const [selectedBenchmark, setSelectedBenchmark] = useState('sp500');

  if (!portfolio) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a portfolio to view benchmark analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentMetrics = benchmarkMetrics[selectedBenchmark as keyof typeof benchmarkMetrics];

  return (
    <div className="space-y-6">
      {/* Benchmark Selection */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Benchmark Comparison</h3>
          <p className="text-sm text-muted-foreground">
            Compare portfolio performance against market indices
          </p>
        </div>
        <Select value={selectedBenchmark} onValueChange={setSelectedBenchmark}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select benchmark" />
          </SelectTrigger>
          <SelectContent>
            {benchmarks.map((benchmark) => (
              <SelectItem key={benchmark.value} value={benchmark.value}>
                {benchmark.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alpha
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {currentMetrics.alpha}%
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-success">Excess return</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Beta
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {currentMetrics.beta}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-muted-foreground">
                  {currentMetrics.beta < 1 ? 'Lower' : 'Higher'} volatility
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Correlation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {currentMetrics.correlation}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-muted-foreground">
                  {currentMetrics.correlation > 0.8 ? 'High' : 'Moderate'} correlation
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tracking Error
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {currentMetrics.tracking_error}%
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-muted-foreground">Active risk</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Information Ratio
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {currentMetrics.information_ratio}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-success">Risk-adjusted outperformance</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Excess Return
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                +{currentMetrics.excess_return}%
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-muted-foreground">YTD</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Cumulative Performance
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Portfolio vs {benchmarks.find(b => b.value === selectedBenchmark)?.label}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceComparison}>
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
                    dataKey="portfolio" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    name="Portfolio"
                  />
                  <Line 
                    type="monotone" 
                    dataKey={selectedBenchmark} 
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

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Relative Performance
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Cumulative outperformance vs benchmark
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={relativePerformance}>
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
                    formatter={(value: number) => [`${value}%`, 'Outperformance']}
                  />
                  <Bar 
                    dataKey="outperformance" 
                    fill="hsl(var(--primary))"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                Strong Relative Performance
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Your portfolio has outperformed the {benchmarks.find(b => b.value === selectedBenchmark)?.label} by {currentMetrics.excess_return}% 
                year-to-date with an information ratio of {currentMetrics.information_ratio}, indicating good risk-adjusted returns. 
                The correlation of {currentMetrics.correlation} suggests moderate tracking while maintaining some independence from market movements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}