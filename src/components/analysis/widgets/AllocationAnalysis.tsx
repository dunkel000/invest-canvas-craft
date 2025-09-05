import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PieChart as PieIcon, Target, TrendingUp } from 'lucide-react';
import { Portfolio } from '@/hooks/usePortfolios';

interface AllocationAnalysisProps {
  portfolio: Portfolio | null;
}

// Mock allocation data
const assetAllocation = [
  { name: 'Equities', value: 65, target: 70, color: 'hsl(var(--chart-1))' },
  { name: 'Fixed Income', value: 25, target: 20, color: 'hsl(var(--chart-2))' },
  { name: 'Real Estate', value: 8, target: 8, color: 'hsl(var(--chart-3))' },
  { name: 'Cash', value: 2, target: 2, color: 'hsl(var(--chart-4))' },
];

const sectorAllocation = [
  { name: 'Technology', value: 28, color: 'hsl(var(--chart-1))' },
  { name: 'Healthcare', value: 18, color: 'hsl(var(--chart-2))' },
  { name: 'Financials', value: 15, color: 'hsl(var(--chart-3))' },
  { name: 'Consumer', value: 12, color: 'hsl(var(--chart-4))' },
  { name: 'Energy', value: 10, color: 'hsl(var(--chart-5))' },
  { name: 'Industrials', value: 8, color: 'hsl(var(--chart-6))' },
  { name: 'Materials', value: 5, color: 'hsl(var(--chart-7))' },
  { name: 'Utilities', value: 4, color: 'hsl(var(--chart-8))' },
];

const geographicAllocation = [
  { name: 'US', value: 60, color: 'hsl(var(--chart-1))' },
  { name: 'Europe', value: 20, color: 'hsl(var(--chart-2))' },
  { name: 'Asia Pacific', value: 15, color: 'hsl(var(--chart-3))' },
  { name: 'Emerging Markets', value: 5, color: 'hsl(var(--chart-4))' },
];

const driftAnalysis = [
  { category: 'Equities', current: 65, target: 70, drift: -5 },
  { category: 'Fixed Income', current: 25, target: 20, drift: 5 },
  { category: 'Real Estate', current: 8, target: 8, drift: 0 },
  { category: 'Cash', current: 2, target: 2, drift: 0 },
];

export function AllocationAnalysis({ portfolio }: AllocationAnalysisProps) {
  if (!portfolio) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <PieIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a portfolio to view allocation analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-popover-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">
            {`${payload[0].value}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Allocation Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Asset Allocation
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Current vs target allocation
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {assetAllocation.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.value}%</span>
                    <span className="text-muted-foreground">({item.target}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Allocation Drift
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Deviation from target allocation
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={driftAnalysis} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    type="number" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--popover-foreground))'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Drift']}
                  />
                  <Bar 
                    dataKey="drift" 
                    fill="hsl(var(--primary))"
                    radius={[0, 2, 2, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Tabs defaultValue="sector" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="sector">Sector Breakdown</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>

        <TabsContent value="sector" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Sector Allocation
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Portfolio breakdown by economic sectors
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sectorAllocation}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        paddingAngle={1}
                        dataKey="value"
                      >
                        {sectorAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {sectorAllocation.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-foreground">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Geographic Allocation
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Portfolio breakdown by geographic regions
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={geographicAllocation}>
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
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--popover))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: 'hsl(var(--popover-foreground))'
                        }}
                        formatter={(value: number) => [`${value}%`, 'Allocation']}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="hsl(var(--primary))"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {geographicAllocation.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-foreground font-medium">{item.name}</span>
                      </div>
                      <Badge variant="outline">{item.value}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}