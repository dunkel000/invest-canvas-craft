import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { LineChart as LineIcon, BarChart3, PieChart as PieIcon, TrendingUp, Download, Settings } from 'lucide-react';
import { usePortfolios } from '@/hooks/usePortfolios';

// Mock data for different chart types
const mockTimeSeriesData = [
  { period: 'Jan', portfolio: 100000, benchmark: 98000, volume: 1200 },
  { period: 'Feb', portfolio: 105000, benchmark: 102000, volume: 1400 },
  { period: 'Mar', portfolio: 103000, benchmark: 99000, volume: 1600 },
  { period: 'Apr', portfolio: 108000, benchmark: 104000, volume: 1300 },
  { period: 'May', portfolio: 112000, benchmark: 107000, volume: 1500 },
  { period: 'Jun', portfolio: 115000, benchmark: 110000, volume: 1700 },
];

const mockAllocationData = [
  { name: 'Stocks', value: 65, color: 'hsl(var(--chart-1))' },
  { name: 'Bonds', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Real Estate', value: 8, color: 'hsl(var(--chart-3))' },
  { name: 'Cash', value: 2, color: 'hsl(var(--chart-4))' },
];

const chartTypes = [
  { value: 'line', label: 'Line Chart', icon: LineIcon },
  { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
  { value: 'area', label: 'Area Chart', icon: TrendingUp },
  { value: 'pie', label: 'Pie Chart', icon: PieIcon },
];

const dataFields = [
  { value: 'portfolio', label: 'Portfolio Value' },
  { value: 'benchmark', label: 'Benchmark' },
  { value: 'volume', label: 'Volume' },
  { value: 'returns', label: 'Returns' },
  { value: 'allocation', label: 'Allocation' },
];

const timeRanges = [
  { value: '1m', label: '1 Month' },
  { value: '3m', label: '3 Months' },
  { value: '6m', label: '6 Months' },
  { value: '1y', label: '1 Year' },
  { value: '2y', label: '2 Years' },
  { value: 'all', label: 'All Time' },
];

export function ChartBuilder() {
  const { portfolios, selectedPortfolio } = usePortfolios();
  const [chartType, setChartType] = useState('line');
  const [selectedFields, setSelectedFields] = useState(['portfolio']);
  const [timeRange, setTimeRange] = useState('6m');
  const [chartTitle, setChartTitle] = useState('Portfolio Performance');

  const renderChart = () => {
    const data = chartType === 'pie' ? mockAllocationData : mockTimeSeriesData;

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
              {selectedFields.includes('portfolio') && (
                <Line 
                  type="monotone" 
                  dataKey="portfolio" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  name="Portfolio"
                />
              )}
              {selectedFields.includes('benchmark') && (
                <Line 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 4 }}
                  name="Benchmark"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
              {selectedFields.includes('portfolio') && (
                <Bar 
                  dataKey="portfolio" 
                  fill="hsl(var(--primary))"
                  name="Portfolio"
                  radius={[2, 2, 0, 0]}
                />
              )}
              {selectedFields.includes('benchmark') && (
                <Bar 
                  dataKey="benchmark" 
                  fill="hsl(var(--muted-foreground))"
                  name="Benchmark"
                  radius={[2, 2, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
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
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
              {selectedFields.includes('portfolio') && (
                <Area
                  type="monotone"
                  dataKey="portfolio"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#portfolioGradient)"
                  strokeWidth={2}
                  name="Portfolio"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
                formatter={(value: number) => [`${value}%`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Chart Builder</h2>
        <p className="text-muted-foreground">
          Create custom visualizations from your portfolio data
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Chart Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chart Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Chart Type</Label>
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chartTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Chart Title</Label>
                <Input 
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                  placeholder="Enter chart title"
                />
              </div>

              {/* Data Fields */}
              {chartType !== 'pie' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Data Fields</Label>
                  <div className="space-y-2">
                    {dataFields.slice(0, 3).map((field) => (
                      <label key={field.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedFields.includes(field.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFields([...selectedFields, field.value]);
                            } else {
                              setSelectedFields(selectedFields.filter(f => f !== field.value));
                            }
                          }}
                          className="rounded border-border"
                        />
                        <span className="text-sm text-foreground">{field.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Time Range */}
              {chartType !== 'pie' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Time Range</Label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Portfolio Selection */}
              {selectedPortfolio && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Portfolio</Label>
                  <Badge variant="outline" className="w-full justify-center py-2">
                    {selectedPortfolio.name}
                  </Badge>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-4">
                <Button className="w-full" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Chart
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Options
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Display */}
        <div className="lg:col-span-3">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">
                  {chartTitle}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {chartTypes.find(t => t.value === chartType)?.label}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {timeRange.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {renderChart()}
              </div>
              
              {/* Chart Legend */}
              {chartType === 'pie' ? (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {mockAllocationData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-sm">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-foreground">{item.name}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-4 mt-4">
                  {selectedFields.includes('portfolio') && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-foreground">Portfolio</span>
                    </div>
                  )}
                  {selectedFields.includes('benchmark') && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                      <span className="text-foreground">Benchmark</span>
                    </div>
                  )}
                  {selectedFields.includes('volume') && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-chart-3" />
                      <span className="text-foreground">Volume</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}