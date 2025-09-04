import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp, TrendingDown, DollarSign, Globe, AlertTriangle, Activity, BarChart3, PieChart as PieChartIcon } from "lucide-react";

// Mock data for economic indicators
const economicData = [
  { month: "Jan", gdp: 4.2, inflation: 2.1, unemployment: 3.8, interest: 5.25 },
  { month: "Feb", gdp: 4.1, inflation: 2.3, unemployment: 3.7, interest: 5.50 },
  { month: "Mar", gdp: 4.3, inflation: 2.2, unemployment: 3.6, interest: 5.25 },
  { month: "Apr", gdp: 4.0, inflation: 2.4, unemployment: 3.8, interest: 5.00 },
  { month: "May", gdp: 4.2, inflation: 2.0, unemployment: 3.5, interest: 4.75 },
  { month: "Jun", gdp: 4.4, inflation: 1.9, unemployment: 3.4, interest: 4.50 },
];

const marketData = [
  { date: "Jan", spx: 4200, nasdaq: 13000, bonds: 4.2, commodities: 85 },
  { date: "Feb", spx: 4350, nasdaq: 13500, bonds: 4.1, commodities: 88 },
  { date: "Mar", spx: 4180, nasdaq: 12800, bonds: 4.3, commodities: 82 },
  { date: "Apr", spx: 4480, nasdaq: 14200, bonds: 4.0, commodities: 90 },
  { date: "May", spx: 4520, nasdaq: 14800, bonds: 3.9, commodities: 93 },
  { date: "Jun", spx: 4650, nasdaq: 15200, bonds: 3.8, commodities: 95 },
];

const correlationData = [
  { name: "Stocks vs Bonds", value: -0.65, color: "hsl(var(--destructive))" },
  { name: "USD vs Commodities", value: -0.42, color: "hsl(var(--warning))" },
  { name: "Tech vs Finance", value: 0.73, color: "hsl(var(--primary))" },
  { name: "Energy vs Materials", value: 0.85, color: "hsl(var(--primary))" },
];

const volatilityData = [
  { asset: "VIX", current: 18.2, trend: "down" },
  { asset: "10Y Treasury", current: 12.4, trend: "up" },
  { asset: "EUR/USD", current: 8.7, trend: "down" },
  { asset: "Oil", current: 24.8, trend: "up" },
];

const MacroCompass = () => {
  const [timeframe, setTimeframe] = useState("6M");

  const chartConfig = {
    gdp: { label: "GDP Growth", color: "hsl(var(--primary))" },
    inflation: { label: "Inflation", color: "hsl(var(--secondary))" },
    unemployment: { label: "Unemployment", color: "hsl(var(--accent))" },
    interest: { label: "Interest Rate", color: "hsl(var(--warning))" },
    spx: { label: "S&P 500", color: "hsl(var(--primary))" },
    nasdaq: { label: "NASDAQ", color: "hsl(var(--secondary))" },
    bonds: { label: "10Y Bonds", color: "hsl(var(--accent))" },
    commodities: { label: "Commodities", color: "hsl(var(--warning))" },
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Macro Compass</h1>
            <p className="text-muted-foreground mt-1">Advanced quantitative macro indicator analysis</p>
          </div>
          <div className="flex items-center gap-2">
            {["1W", "1M", "3M", "6M", "1Y", "Max"].map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(period)}
                className="h-8"
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">GDP Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">4.4%</div>
              <p className="text-xs text-muted-foreground">
                +0.2% from last quarter
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inflation Rate</CardTitle>
              <TrendingDown className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">1.9%</div>
              <p className="text-xs text-muted-foreground">
                -0.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unemployment</CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">3.4%</div>
              <p className="text-xs text-muted-foreground">
                -0.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fed Rate</CardTitle>
              <DollarSign className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">4.50%</div>
              <p className="text-xs text-muted-foreground">
                -0.25% from last meeting
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics */}
        <Tabs defaultValue="economic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="economic">Economic Indicators</TabsTrigger>
            <TabsTrigger value="markets">Market Overview</TabsTrigger>
            <TabsTrigger value="correlations">Correlations</TabsTrigger>
            <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="economic" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Economic Indicators Trends
                  </CardTitle>
                  <CardDescription>Key economic metrics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={economicData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="gdp" stroke="hsl(var(--primary))" strokeWidth={2} />
                        <Line type="monotone" dataKey="inflation" stroke="hsl(var(--secondary))" strokeWidth={2} />
                        <Line type="monotone" dataKey="unemployment" stroke="hsl(var(--accent))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interest Rate Policy</CardTitle>
                  <CardDescription>Federal Reserve rate changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={economicData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="interest" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="markets" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Indices Performance</CardTitle>
                  <CardDescription>Major market indices comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={marketData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                        <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line yAxisId="left" type="monotone" dataKey="spx" stroke="hsl(var(--primary))" strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="nasdaq" stroke="hsl(var(--secondary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bonds & Commodities</CardTitle>
                  <CardDescription>Alternative asset performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={marketData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="bonds" fill="hsl(var(--accent))" />
                        <Bar dataKey="commodities" fill="hsl(var(--warning))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="correlations" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Asset Correlations
                  </CardTitle>
                  <CardDescription>Cross-asset correlation analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {correlationData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={Math.abs(item.value) > 0.6 ? "default" : "secondary"}>
                            {item.value > 0 ? "+" : ""}{item.value.toFixed(2)}
                          </Badge>
                          <div 
                            className="w-12 h-2 rounded-full"
                            style={{ backgroundColor: item.color, opacity: Math.abs(item.value) }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Correlation Matrix</CardTitle>
                  <CardDescription>Interactive correlation heatmap</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px]">
                  <div className="text-center">
                    <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Advanced correlation matrix</p>
                    <p className="text-xs text-muted-foreground">Coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Volatility Monitor
                  </CardTitle>
                  <CardDescription>Current volatility across major assets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {volatilityData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{item.asset}</span>
                          {item.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-destructive" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <Badge variant={item.current > 20 ? "destructive" : item.current > 15 ? "secondary" : "default"}>
                          {item.current}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Alerts</CardTitle>
                  <CardDescription>Active monitoring and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">High Volatility Alert</p>
                        <p className="text-xs text-muted-foreground">Oil volatility above 20%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <Activity className="h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Economic Data Release</p>
                        <p className="text-xs text-muted-foreground">CPI data due tomorrow</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                      <Globe className="h-4 w-4 text-secondary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Market Event</p>
                        <p className="text-xs text-muted-foreground">Fed meeting next week</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MacroCompass;