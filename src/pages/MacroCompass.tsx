import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedChart } from "@/components/MacroCompass/AdvancedChart";
import { MarketHeatmap } from "@/components/MacroCompass/MarketHeatmap";
import { EconomicIndicator } from "@/components/MacroCompass/EconomicIndicator";
import { RealTimeNewsFeed } from "@/components/MacroCompass/RealTimeNewsFeed";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Treemap, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp, TrendingDown, DollarSign, Globe, AlertTriangle, Activity, BarChart3, PieChart as PieChartIcon, Calendar, Settings, RefreshCw, Download, Filter, Zap, Target, Brain, Satellite } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Enhanced sophisticated mock data
const economicIndicators = [
  {
    title: "GDP Growth Rate",
    value: 4.4,
    change: 0.2,
    target: 3.5,
    unit: "%",
    description: "Quarterly GDP growth shows robust economic expansion driven by consumer spending and business investment.",
    significance: "critical" as const,
    trend: "bullish" as const,
    forecast: { next: 4.1, timeframe: "Next Quarter", confidence: 78 },
    historical: { high: 6.2, low: -2.1, average: 2.8 }
  },
  {
    title: "Core Inflation",
    value: 1.9,
    change: -0.1,
    target: 2.0,
    unit: "%",
    description: "Core inflation remains near Fed target, supporting potential monetary policy flexibility.",
    significance: "critical" as const,
    trend: "neutral" as const,
    forecast: { next: 2.1, timeframe: "Next Month", confidence: 82 },
    historical: { high: 4.8, low: 0.1, average: 2.2 }
  },
  {
    title: "Unemployment Rate",
    value: 3.4,
    change: -0.1,
    target: 4.0,
    unit: "%",
    description: "Unemployment at multi-decade lows indicates tight labor market conditions.",
    significance: "high" as const,
    trend: "bullish" as const,
    forecast: { next: 3.5, timeframe: "Next Month", confidence: 75 },
    historical: { high: 14.8, low: 3.4, average: 6.2 }
  }
];

const advancedMarketData = [
  { date: "2024-01", spx: 4200, nasdaq: 13000, vix: 18.5, yields: 4.2, dxy: 103.2, sentiment: 0.72 },
  { date: "2024-02", spx: 4350, nasdaq: 13500, vix: 16.2, yields: 4.1, dxy: 104.1, sentiment: 0.78 },
  { date: "2024-03", spx: 4180, nasdaq: 12800, vix: 22.1, yields: 4.3, dxy: 102.8, sentiment: 0.45 },
  { date: "2024-04", spx: 4480, nasdaq: 14200, vix: 15.8, yields: 4.0, dxy: 105.3, sentiment: 0.85 },
  { date: "2024-05", spx: 4520, nasdaq: 14800, vix: 14.2, yields: 3.9, dxy: 106.7, sentiment: 0.89 },
  { date: "2024-06", spx: 4650, nasdaq: 15200, vix: 13.8, yields: 3.8, dxy: 107.2, sentiment: 0.92 },
  { date: "2024-07", spx: 4720, nasdaq: 15800, vix: 12.5, yields: 3.7, dxy: 108.1, sentiment: 0.95 },
  { date: "2024-08", spx: 4580, nasdaq: 15100, vix: 19.3, yields: 4.1, dxy: 106.8, sentiment: 0.62 },
  { date: "2024-09", spx: 4820, nasdaq: 16200, vix: 11.2, yields: 3.6, dxy: 109.5, sentiment: 0.98 },
];

const heatmapData = [
  { name: "AAPL", value: 175.43, change: 2.34, volume: 45123000, category: "Technology" },
  { name: "MSFT", value: 338.11, change: 1.87, volume: 28934000, category: "Technology" },
  { name: "GOOGL", value: 125.73, change: -0.95, volume: 31245000, category: "Technology" },
  { name: "TSLA", value: 248.48, change: 4.12, volume: 67891000, category: "Technology" },
  { name: "JPM", value: 147.23, change: 0.67, volume: 12456000, category: "Financials" },
  { name: "BAC", value: 34.56, change: -1.23, volume: 45678000, category: "Financials" },
  { name: "GS", value: 334.78, change: 1.45, volume: 2345000, category: "Financials" },
  { name: "XOM", value: 104.23, change: 3.45, volume: 18234000, category: "Energy" },
  { name: "CVX", value: 145.67, change: 2.78, volume: 9876000, category: "Energy" },
];

const correlationData = [
  { subject: "Stocks", A: 85, B: 76, C: 92, D: 68, E: 79, fullMark: 100 },
  { subject: "Bonds", A: 45, B: 88, C: 34, D: 92, E: 67, fullMark: 100 },
  { subject: "Commodities", A: 78, B: 45, C: 89, D: 34, E: 56, fullMark: 100 },
  { subject: "Currency", A: 67, B: 89, C: 45, D: 78, E: 91, fullMark: 100 },
  { subject: "REITs", A: 56, B: 67, C: 78, D: 89, E: 45, fullMark: 100 },
  { subject: "Crypto", A: 91, B: 34, C: 67, D: 45, E: 89, fullMark: 100 },
];

const MacroCompass = () => {
  const [timeframe, setTimeframe] = useState("YTD");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [activeView, setActiveView] = useState("grid");

  const chartConfig = {
    spx: { label: "S&P 500", color: "hsl(var(--primary))" },
    nasdaq: { label: "NASDAQ", color: "hsl(var(--secondary))" },
    vix: { label: "VIX", color: "hsl(var(--destructive))" },
    yields: { label: "10Y Yields", color: "hsl(var(--warning))" },
    dxy: { label: "Dollar Index", color: "hsl(var(--success))" },
    sentiment: { label: "Market Sentiment", color: "hsl(var(--info))" },
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Advanced Header with Real-time Status */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Macro Compass
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              Real-time quantitative macro analysis • Last update: {format(new Date(), "HH:mm:ss")}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Calendar className="h-4 w-4 mr-2" />
                  {selectedDate ? format(selectedDate, "PPP") : "Date Range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filter
            </Button>
            
            <Button variant="outline" size="sm" className="h-9">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            
            <Button variant="outline" size="sm" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>

            <div className="flex items-center gap-1 ml-2">
              {["1D", "1W", "1M", "3M", "6M", "YTD", "1Y", "5Y"].map((period) => (
                <Button
                  key={period}
                  variant={timeframe === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe(period)}
                  className="h-9 min-w-12"
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Regime</CardTitle>
              <Brain className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Bull Market</div>
              <div className="flex items-center text-xs text-primary mt-1">
                <Target className="h-3 w-3 mr-1" />
                98% confidence
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fear & Greed</CardTitle>
              <Activity className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Extreme Greed</div>
              <div className="flex items-center text-xs text-primary mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                87/100 score
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-warning/10 via-transparent to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Volatility Index</CardTitle>
              <Zap className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">13.8</div>
              <div className="flex items-center text-xs text-primary mt-1">
                <TrendingDown className="h-3 w-3 mr-1" />
                -15.2% today
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-transparent to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Parity</CardTitle>
              <BarChart3 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Balanced</div>
              <div className="flex items-center text-xs text-primary mt-1">
                <Globe className="h-3 w-3 mr-1" />
                Optimal allocation
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-transparent to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Macro Score</CardTitle>
              <Satellite className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">8.7/10</div>
              <div className="flex items-center text-xs text-primary mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Strong momentum
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="markets">Live Markets</TabsTrigger>
            <TabsTrigger value="economics">Economics</TabsTrigger>
            <TabsTrigger value="correlations">Correlations</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="risk">Risk Analytics</TabsTrigger>
            <TabsTrigger value="news">News & Events</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <AdvancedChart
                  data={advancedMarketData}
                  title="Multi-Asset Performance Dashboard"
                  description="Real-time tracking of major market indices with sentiment overlay"
                  primaryMetric="spx"
                  secondaryMetric="sentiment"
                  chartType="composed"
                  showBrush={true}
                  annotations={[
                    { x: "2024-08", label: "Market Correction", color: "hsl(var(--destructive))" },
                    { x: "2024-09", label: "Recovery Rally", color: "hsl(var(--primary))" }
                  ]}
                  height={400}
                />
              </div>
              
              <RealTimeNewsFeed />
            </div>
          </TabsContent>

          <TabsContent value="markets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MarketHeatmap
                data={heatmapData}
                title="Real-Time Market Heatmap"
                description="Live price movements across major asset classes"
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Cross-Asset Performance</CardTitle>
                  <CardDescription>Normalized returns across asset classes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={advancedMarketData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="spx" stroke="hsl(var(--primary))" strokeWidth={2} />
                        <Line type="monotone" dataKey="yields" stroke="hsl(var(--warning))" strokeWidth={2} strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="dxy" stroke="hsl(var(--success))" strokeWidth={2} strokeDasharray="3 3" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="economics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {economicIndicators.map((indicator, index) => (
                <EconomicIndicator key={index} {...indicator} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="correlations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Correlation Radar</CardTitle>
                  <CardDescription>Multi-dimensional correlation analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={correlationData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                        <Radar name="Current" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} strokeWidth={2} />
                        <Radar name="Previous" dataKey="B" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dynamic Correlation Matrix</CardTitle>
                  <CardDescription>Rolling correlation heatmap</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-1 text-xs">
                    {['', 'SPX', 'NDX', 'VIX', 'DXY', 'GLD'].map((label, i) => (
                      <div key={i} className={`p-2 text-center font-medium ${i === 0 ? '' : 'bg-muted/20'}`}>
                        {label}
                      </div>
                    ))}
                    {[
                      ['SPX', 1.00, 0.85, -0.73, -0.45, 0.12],
                      ['NDX', 0.85, 1.00, -0.68, -0.52, 0.08],
                      ['VIX', -0.73, -0.68, 1.00, 0.23, -0.15],
                      ['DXY', -0.45, -0.52, 0.23, 1.00, -0.67],
                      ['GLD', 0.12, 0.08, -0.15, -0.67, 1.00]
                    ].map((row, i) => 
                      row.map((cell, j) => (
                        <div 
                          key={`${i}-${j}`} 
                          className={`p-2 text-center text-xs ${
                            j === 0 ? 'font-medium bg-muted/20' : 
                            Math.abs(cell as number) > 0.7 ? 'bg-primary/20 text-primary' :
                            Math.abs(cell as number) > 0.4 ? 'bg-secondary/20 text-secondary' :
                            'bg-muted/10'
                          }`}
                        >
                          {j === 0 ? cell : (cell as number).toFixed(2)}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Sentiment Analysis</CardTitle>
                  <CardDescription>AI-powered sentiment tracking across multiple data sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <AdvancedChart
                    data={advancedMarketData}
                    title=""
                    primaryMetric="sentiment"
                    chartType="area"
                    height={300}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Breakdown</CardTitle>
                  <CardDescription>Real-time sentiment across channels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { source: "Social Media", score: 78, change: 5.2 },
                    { source: "News Articles", score: 65, change: -2.1 },
                    { source: "Analyst Reports", score: 82, change: 3.7 },
                    { source: "Options Flow", score: 71, change: 1.8 },
                    { source: "Insider Trading", score: 89, change: 7.3 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                      <span className="font-medium">{item.source}</span>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-semibold">{item.score}/100</div>
                          <div className={`text-xs ${item.change >= 0 ? 'text-primary' : 'text-destructive'}`}>
                            {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                          </div>
                        </div>
                        <div className="w-16 h-2 bg-muted rounded-full">
                          <div 
                            className="h-full bg-primary rounded-full transition-all" 
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>VaR Analysis</CardTitle>
                  <CardDescription>Value at Risk metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { period: "1-Day", var95: "-2.1%", var99: "-3.4%" },
                    { period: "1-Week", var95: "-4.8%", var99: "-7.2%" },
                    { period: "1-Month", var95: "-8.9%", var99: "-13.1%" }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.period}</span>
                        <Badge variant="outline">95% / 99%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-destructive font-mono">{item.var95}</span>
                        <span className="text-destructive font-mono font-bold">{item.var99}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stress Test Results</CardTitle>
                  <CardDescription>Portfolio performance under extreme scenarios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { scenario: "2008 Financial Crisis", impact: "-42.3%" },
                    { scenario: "COVID-19 Crash", impact: "-28.1%" },
                    { scenario: "1987 Black Monday", impact: "-35.7%" },
                    { scenario: "Rate Shock +200bp", impact: "-15.2%" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/10">
                      <span className="text-sm">{item.scenario}</span>
                      <Badge variant="destructive">{item.impact}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Attribution</CardTitle>
                  <CardDescription>Sources of portfolio risk</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { factor: "Market Beta", contribution: 45 },
                      { factor: "Sector Exposure", contribution: 28 },
                      { factor: "Interest Rate", contribution: 15 },
                      { factor: "Currency", contribution: 8 },
                      { factor: "Idiosyncratic", contribution: 4 }
                    ].map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.factor}</span>
                          <span>{item.contribution}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all" 
                            style={{ width: `${item.contribution}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RealTimeNewsFeed />
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Economic Calendar</CardTitle>
                  <CardDescription>Key events this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { date: "Today", event: "FOMC Meeting", impact: "High" },
                    { date: "Tomorrow", event: "CPI Release", impact: "High" },
                    { date: "Wednesday", event: "ECB Decision", impact: "Medium" },
                    { date: "Thursday", event: "Jobless Claims", impact: "Medium" },
                    { date: "Friday", event: "GDP Revision", impact: "Low" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="font-medium">{item.event}</div>
                        <div className="text-xs text-muted-foreground">{item.date}</div>
                      </div>
                      <Badge variant={item.impact === "High" ? "destructive" : item.impact === "Medium" ? "secondary" : "outline"}>
                        {item.impact}
                      </Badge>
                    </div>
                  ))}
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