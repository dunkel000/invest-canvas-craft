import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Brush } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Maximize2 } from 'lucide-react';
import { useState } from 'react';

const mockData = [
  { name: 'Jan', value: 100000, growth: 102000, date: '2024-01' },
  { name: 'Feb', value: 105000, growth: 108000, date: '2024-02' },
  { name: 'Mar', value: 103000, growth: 112000, date: '2024-03' },
  { name: 'Apr', value: 108000, growth: 116000, date: '2024-04' },
  { name: 'May', value: 112000, growth: 120000, date: '2024-05' },
  { name: 'Jun', value: 118000, growth: 125000, date: '2024-06' },
  { name: 'Jul', value: 122000, growth: 128000, date: '2024-07' },
  { name: 'Aug', value: 119000, growth: 131000, date: '2024-08' },
  { name: 'Sep', value: 125000, growth: 135000, date: '2024-09' },
  { name: 'Oct', value: 128000, growth: 138000, date: '2024-10' },
  { name: 'Nov', value: 132000, growth: 142000, date: '2024-11' },
  { name: 'Dec', value: 135000, growth: 145000, date: '2024-12' },
];

const timePeriods = [
  { label: '1D', value: '1d' },
  { label: '5D', value: '5d' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: 'YTD', value: 'ytd' },
  { label: '1Y', value: '1y' },
  { label: '5Y', value: '5y' },
  { label: 'MAX', value: 'max' },
];

export const PortfolioChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('ytd');
  const [showBrush, setShowBrush] = useState(true);
  
  const latest = mockData[mockData.length - 1];
  const previous = mockData[mockData.length - 2];
  const change = latest && previous ? ((latest.value - previous.value) / previous.value * 100) : 0;
  const absoluteChange = latest && previous ? (latest.value - previous.value) : 0;

  return (
    <Card className="w-full bg-card border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Portfolio Performance</h3>
            <div className="flex items-center gap-4 mt-2">
              <div className="text-2xl font-bold text-foreground">
                ${latest?.value.toLocaleString()}
              </div>
              <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {change > 0 ? '+' : ''}${absoluteChange.toLocaleString()} ({change > 0 ? '+' : ''}{change.toFixed(2)}%)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Time Period Controls */}
        <div className="flex items-center gap-1 mt-4">
          {timePeriods.map((period) => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod(period.value)}
              className={`h-8 px-3 text-xs ${
                selectedPeriod === period.value 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {period.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="h-64 px-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="portfolioGradientPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-line-primary))" stopOpacity={0.4} />
                  <stop offset="70%" stopColor="hsl(var(--chart-line-primary))" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="hsl(var(--chart-line-primary))" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="portfolioGradientSecondary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-line-secondary))" stopOpacity={0.3} />
                  <stop offset="70%" stopColor="hsl(var(--chart-line-secondary))" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="hsl(var(--chart-line-secondary))" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="name" 
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
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--chart-line-primary))"
                fillOpacity={1}
                fill="url(#portfolioGradientPrimary)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, stroke: "hsl(var(--chart-line-primary))", strokeWidth: 2, fill: "hsl(var(--chart-line-primary))" }}
              />
              
              {showBrush && (
                <Brush 
                  dataKey="name" 
                  height={30} 
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--muted))"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Chart Controls Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm text-muted-foreground">Portfolio Value</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowBrush(!showBrush)}
              className="h-7 px-2 text-xs"
            >
              {showBrush ? 'Hide' : 'Show'} Range Selector
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Real-time
            </Badge>
            <span className="text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};