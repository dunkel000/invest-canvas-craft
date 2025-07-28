import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts'
import { BarChart3, TrendingUp } from 'lucide-react'
import { useState } from 'react'

const portfolioData = [
  { name: 'Stocks', value: 45, amount: 1281231 },
  { name: 'Bonds', value: 25, amount: 711898 },
  { name: 'Real Estate', value: 15, amount: 427139 },
  { name: 'Crypto', value: 10, amount: 284759 },
  { name: 'Commodities', value: 5, amount: 142380 },
]

// Sample data for different time horizons
const performanceDataSets = {
  '1D': [
    { period: '9:00', value: 2847592 },
    { period: '10:00', value: 2851234 },
    { period: '11:00', value: 2849876 },
    { period: '12:00', value: 2855432 },
    { period: '13:00', value: 2857890 },
    { period: '14:00', value: 2856123 },
    { period: '15:00', value: 2859456 },
    { period: '16:00', value: 2861789 },
  ],
  '1M': [
    { period: 'Week 1', value: 2720000 },
    { period: 'Week 2', value: 2780000 },
    { period: 'Week 3', value: 2820000 },
    { period: 'Week 4', value: 2847592 },
  ],
  'MTD': [
    { period: 'Jun 1', value: 2720000 },
    { period: 'Jun 8', value: 2780000 },
    { period: 'Jun 15', value: 2820000 },
    { period: 'Jun 22', value: 2835000 },
    { period: 'Jun 29', value: 2847592 },
  ],
  '3M': [
    { period: 'Apr', value: 2650000 },
    { period: 'May', value: 2720000 },
    { period: 'Jun', value: 2847592 },
  ],
  '6M': [
    { period: 'Jan', value: 2400000 },
    { period: 'Feb', value: 2510000 },
    { period: 'Mar', value: 2380000 },
    { period: 'Apr', value: 2650000 },
    { period: 'May', value: 2720000 },
    { period: 'Jun', value: 2847592 },
  ],
  '1Y': [
    { period: 'Q2 2023', value: 2200000 },
    { period: 'Q3 2023', value: 2350000 },
    { period: 'Q4 2023', value: 2280000 },
    { period: 'Q1 2024', value: 2450000 },
    { period: 'Q2 2024', value: 2847592 },
  ],
  'YTD': [
    { period: 'Jan', value: 2400000 },
    { period: 'Feb', value: 2510000 },
    { period: 'Mar', value: 2380000 },
    { period: 'Apr', value: 2650000 },
    { period: 'May', value: 2720000 },
    { period: 'Jun', value: 2847592 },
  ],
  '5Y': [
    { period: '2020', value: 1800000 },
    { period: '2021', value: 2100000 },
    { period: '2022', value: 2050000 },
    { period: '2023', value: 2450000 },
    { period: '2024', value: 2847592 },
  ],
  'All': [
    { period: '2018', value: 1200000 },
    { period: '2019', value: 1500000 },
    { period: '2020', value: 1800000 },
    { period: '2021', value: 2100000 },
    { period: '2022', value: 2050000 },
    { period: '2023', value: 2450000 },
    { period: '2024', value: 2847592 },
  ],
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))']

type TimeHorizon = '1D' | '1M' | 'MTD' | '3M' | '6M' | '1Y' | 'YTD' | '5Y' | 'All'
type ChartType = 'line' | 'bar'

export function PortfolioChart() {
  const [selectedHorizon, setSelectedHorizon] = useState<TimeHorizon>('6M')
  const [chartType, setChartType] = useState<ChartType>('line')
  
  const currentData = performanceDataSets[selectedHorizon]
  
  const timeHorizons: TimeHorizon[] = ['1D', '1M', 'MTD', '3M', '6M', '1Y', 'YTD', '5Y', 'All']
  
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Asset Allocation</CardTitle>
          <CardDescription className="text-muted-foreground">
            Portfolio distribution by asset type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Portfolio Performance</CardTitle>
              <CardDescription className="text-muted-foreground">
                {selectedHorizon} portfolio value trend
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <ToggleGroup type="single" value={chartType} onValueChange={(value) => value && setChartType(value as ChartType)}>
                <ToggleGroupItem value="line" aria-label="Line chart">
                  <TrendingUp className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="bar" aria-label="Bar chart">
                  <BarChart3 className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-4">
            {timeHorizons.map((horizon) => (
              <Button
                key={horizon}
                variant={selectedHorizon === horizon ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedHorizon(horizon)}
                className="text-xs"
              >
                {horizon}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'line' ? (
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="period" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Portfolio Value']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone"
                  dataKey="value" 
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <BarChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="period" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Portfolio Value']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}