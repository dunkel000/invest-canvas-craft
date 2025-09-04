import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp, TrendingDown, DollarSign, Globe, AlertTriangle, Activity, BarChart3, PieChart as PieChartIcon, Calendar, Settings, RefreshCw, Download, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Enhanced mock data for economic indicators
const economicData = [
  { date: "2024-01", gdp: 4.2, inflation: 2.1, unemployment: 3.8, interest: 5.25, consumer_confidence: 112.3, manufacturing_pmi: 52.4 },
  { date: "2024-02", gdp: 4.1, inflation: 2.3, unemployment: 3.7, interest: 5.50, consumer_confidence: 108.7, manufacturing_pmi: 51.8 },
  { date: "2024-03", gdp: 4.3, inflation: 2.2, unemployment: 3.6, interest: 5.25, consumer_confidence: 115.2, manufacturing_pmi: 53.1 },
  { date: "2024-04", gdp: 4.0, inflation: 2.4, unemployment: 3.8, interest: 5.00, consumer_confidence: 110.5, manufacturing_pmi: 52.7 },
  { date: "2024-05", gdp: 4.2, inflation: 2.0, unemployment: 3.5, interest: 4.75, consumer_confidence: 118.9, manufacturing_pmi: 54.2 },
  { date: "2024-06", gdp: 4.4, inflation: 1.9, unemployment: 3.4, interest: 4.50, consumer_confidence: 121.1, manufacturing_pmi: 55.3 },
];

const marketData = [
  { date: "Jan", spx: 4200, nasdaq: 13000, bonds: 4.2, commodities: 85, vix: 18.5, dollar_index: 103.2 },
  { date: "Feb", spx: 4350, nasdaq: 13500, bonds: 4.1, commodities: 88, vix: 16.2, dollar_index: 104.1 },
  { date: "Mar", spx: 4180, nasdaq: 12800, bonds: 4.3, commodities: 82, vix: 22.1, dollar_index: 102.8 },
  { date: "Apr", spx: 4480, nasdaq: 14200, bonds: 4.0, commodities: 90, vix: 15.8, dollar_index: 105.3 },
  { date: "May", spx: 4520, nasdaq: 14800, bonds: 3.9, commodities: 93, vix: 14.2, dollar_index: 106.7 },
  { date: "Jun", spx: 4650, nasdaq: 15200, bonds: 3.8, commodities: 95, vix: 13.8, dollar_index: 107.2 },
];

const sectorPerformance = [
  { sector: "Technology", ytd: 18.5, week: 2.3, momentum: "strong" },
  { sector: "Healthcare", ytd: 12.7, week: 1.1, momentum: "moderate" },
  { sector: "Financials", ytd: 15.2, week: -0.8, momentum: "weak" },
  { sector: "Energy", ytd: 8.9, week: 3.7, momentum: "strong" },
  { sector: "Consumer Disc.", ytd: 22.1, week: 1.9, momentum: "strong" },
  { sector: "Industrials", ytd: 14.3, week: 0.5, momentum: "moderate" },
];

const globalMarkets = [
  { market: "S&P 500", value: 4650, change: 1.24, region: "US" },
  { market: "NASDAQ", value: 15200, change: 1.89, region: "US" },
  { market: "FTSE 100", value: 7420, change: 0.76, region: "UK" },
  { market: "DAX", value: 15890, change: 1.12, region: "DE" },
  { market: "Nikkei 225", value: 32400, change: -0.43, region: "JP" },
  { market: "Shanghai", value: 3240, change: 0.89, region: "CN" },
];

const economicCalendar = [
  { date: "Dec 13", event: "CPI Report", importance: "high", impact: "USD", forecast: "2.1%" },
  { date: "Dec 14", event: "Retail Sales", importance: "medium", impact: "USD", forecast: "0.3%" },
  { date: "Dec 15", event: "Fed Meeting", importance: "high", impact: "USD", forecast: "4.50%" },
  { date: "Dec 16", event: "ECB Decision", importance: "high", impact: "EUR", forecast: "4.00%" },
  { date: "Dec 17", event: "GDP Flash", importance: "medium", impact: "EUR", forecast: "0.4%" },
];

const correlationMatrix = [
  { asset1: "Stocks", asset2: "Bonds", correlation: -0.65 },
  { asset1: "Dollar", asset2: "Gold", correlation: -0.78 },
  { asset1: "Oil", asset2: "Inflation", correlation: 0.72 },
  { asset1: "VIX", asset2: "SPX", correlation: -0.85 },
  { asset1: "Tech", asset2: "Yields", correlation: -0.43 },
];

const MacroCompass = () => {
  const [timeframe, setTimeframe] = useState("6M");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState<Date>();

  const chartConfig = {
    gdp: { label: "GDP Growth", color: "hsl(var(--primary))" },
    inflation: { label: "Inflation", color: "hsl(var(--secondary))" },
    unemployment: { label: "Unemployment", color: "hsl(var(--accent))" },
    interest: { label: "Interest Rate", color: "hsl(var(--warning))" },
    consumer_confidence: { label: "Consumer Confidence", color: "hsl(var(--success))" },
    manufacturing_pmi: { label: "Manufacturing PMI", color: "hsl(var(--info))" },
    spx: { label: "S&P 500", color: "hsl(var(--primary))" },
    nasdaq: { label: "NASDAQ", color: "hsl(var(--secondary))" },
    bonds: { label: "10Y Bonds", color: "hsl(var(--accent))" },
    commodities: { label: "Commodities", color: "hsl(var(--warning))" },
    vix: { label: "VIX", color: "hsl(var(--destructive))" },
    dollar_index: { label: "Dollar Index", color: "hsl(var(--success))" },
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Macro Compass</h1>
            <p className="text-muted-foreground mt-1">
              Good morning, <span className="text-primary">Analyst</span>. You have <span className="text-primary">12 notifications</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Calendar className="h-4 w-4 mr-2" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select Date"}
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
            
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            
            <Button variant="outline" size="sm" className="h-8">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            {["Week", "Month", "Quarter", "Year", "Max"].map((period) => (
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

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">GDP Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">4.4%</div>
              <div className="flex items-center text-xs text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.3%
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inflation CPI</CardTitle>
              <Activity className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">1.9%</div>
              <div className="flex items-center text-xs text-primary">
                <TrendingDown className="h-3 w-3 mr-1" />
                -0.1%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unemployment</CardTitle>
              <BarChart3 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">3.4%</div>
              <div className="flex items-center text-xs text-primary">
                <TrendingDown className="h-3 w-3 mr-1" />
                -0.1%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fed Rate</CardTitle>
              <DollarSign className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">4.50%</div>
              <div className="flex items-center text-xs text-destructive">
                <TrendingDown className="h-3 w-3 mr-1" />
                -0.25%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">VIX</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">13.8</div>
              <div className="flex items-center text-xs text-primary">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2.4%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">DXY</CardTitle>
              <Globe className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">107.2</div>
              <div className="flex items-center text-xs text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.5%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-8 lg:grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="markets">Markets</TabsTrigger>
            <TabsTrigger value="economics">Economics</TabsTrigger>
            <TabsTrigger value="sectors">Sectors</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="correlations">Correlations</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Market Overview
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Week</Button>
                      <Button variant="outline" size="sm">Month</Button>
                      <Button variant="default" size="sm">Max</Button>
                    </div>
                  </div>
                  <CardDescription>Key Keywords: S&P 500 rally, Economic growth acceleration</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={marketData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="spx" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} />
                        <Line type="monotone" dataKey="spx" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground">4,650 <span className="text-lg text-primary">+334</span></p>
                      <p className="text-sm text-muted-foreground">Total S&P 500 Points</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary">+7.8%</p>
                      <p className="text-sm text-muted-foreground">YTD Performance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Economic Spotlight</CardTitle>
                  <CardDescription>Latest economic indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Consumer Confidence</span>
                      <Badge variant="default">121.1</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Highest level since 2020, indicating strong consumer sentiment</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-secondary/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Manufacturing PMI</span>
                      <Badge variant="secondary">55.3</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Above 50 indicates expansion in manufacturing sector</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-accent/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Trade Balance</span>
                      <Badge variant="outline">-$68.2B</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Improving from previous month's -$71.1B deficit</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="markets" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Global Markets</CardTitle>
                  <CardDescription>Major indices performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {globalMarkets.map((market, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">{market.region}</Badge>
                          <span className="font-medium">{market.market}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{market.value.toLocaleString()}</div>
                          <div className={`text-sm flex items-center ${market.change >= 0 ? 'text-primary' : 'text-destructive'}`}>
                            {market.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                            {market.change > 0 ? '+' : ''}{market.change.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sector Performance</CardTitle>
                  <CardDescription>YTD and weekly performance by sector</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sectorPerformance.map((sector, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{sector.sector}</span>
                          <Badge variant={sector.momentum === 'strong' ? 'default' : sector.momentum === 'moderate' ? 'secondary' : 'outline'}>
                            {sector.momentum}
                          </Badge>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-sm font-semibold text-primary">YTD: +{sector.ytd}%</div>
                          <div className={`text-xs ${sector.week >= 0 ? 'text-primary' : 'text-destructive'}`}>
                            Week: {sector.week > 0 ? '+' : ''}{sector.week}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="economics" className="space-y-4">
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
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
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
                  <CardTitle>Leading Indicators</CardTitle>
                  <CardDescription>Forward-looking economic signals</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={economicData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="consumer_confidence" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="manufacturing_pmi" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sectors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sector Rotation Analysis</CardTitle>
                <CardDescription>Capital flows and momentum across sectors</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sectorPerformance} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                      <YAxis dataKey="sector" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="ytd" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="global" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Global Market Heatmap</CardTitle>
                  <CardDescription>Real-time performance across major markets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {globalMarkets.map((market, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg text-center transition-all hover:scale-105 ${
                          market.change >= 2 ? 'bg-primary/20 border border-primary/30' :
                          market.change >= 0 ? 'bg-success/20 border border-success/30' :
                          market.change >= -2 ? 'bg-warning/20 border border-warning/30' :
                          'bg-destructive/20 border border-destructive/30'
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">{market.market}</div>
                        <div className="text-lg font-bold">{market.value.toLocaleString()}</div>
                        <div className={`text-sm ${market.change >= 0 ? 'text-primary' : 'text-destructive'}`}>
                          {market.change > 0 ? '+' : ''}{market.change.toFixed(2)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Currency Monitor</CardTitle>
                  <CardDescription>Major currency pairs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { pair: "EUR/USD", rate: "1.0892", change: -0.23 },
                    { pair: "GBP/USD", rate: "1.2654", change: 0.18 },
                    { pair: "USD/JPY", rate: "148.75", change: 0.34 },
                    { pair: "USD/CHF", rate: "0.8923", change: -0.12 },
                  ].map((currency, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/20">
                      <span className="font-medium">{currency.pair}</span>
                      <div className="text-right">
                        <div className="font-semibold">{currency.rate}</div>
                        <div className={`text-xs ${currency.change >= 0 ? 'text-primary' : 'text-destructive'}`}>
                          {currency.change > 0 ? '+' : ''}{currency.change.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
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
                    Asset Correlation Matrix
                  </CardTitle>
                  <CardDescription>Cross-asset correlation analysis with significance levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {correlationMatrix.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                        <span className="text-sm font-medium">{item.asset1} vs {item.asset2}</span>
                        <div className="flex items-center gap-3">
                          <Badge variant={Math.abs(item.correlation) > 0.7 ? "default" : Math.abs(item.correlation) > 0.4 ? "secondary" : "outline"}>
                            {item.correlation > 0 ? "+" : ""}{item.correlation.toFixed(2)}
                          </Badge>
                          <div 
                            className="w-16 h-2 rounded-full"
                            style={{ 
                              backgroundColor: item.correlation > 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))",
                              opacity: Math.abs(item.correlation)
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk-Return Profile</CardTitle>
                  <CardDescription>Asset positioning analysis</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px]">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Advanced risk-return scatter plot</p>
                    <p className="text-xs text-muted-foreground">Interactive visualization coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Economic Calendar
                </CardTitle>
                <CardDescription>Upcoming economic events and data releases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {economicCalendar.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-semibold">{event.date}</div>
                        </div>
                        <div>
                          <div className="font-medium">{event.event}</div>
                          <div className="text-sm text-muted-foreground">Expected: {event.forecast}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={event.importance === 'high' ? 'destructive' : event.importance === 'medium' ? 'secondary' : 'outline'}>
                          {event.importance}
                        </Badge>
                        <Badge variant="outline">{event.impact}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Active Risk Alerts
                  </CardTitle>
                  <CardDescription>Real-time monitoring and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">High Volatility Alert</p>
                        <p className="text-xs text-muted-foreground">VIX spike detected: +15% intraday</p>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </div>
                      <Badge variant="destructive">Critical</Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
                      <Activity className="h-5 w-5 text-warning" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Economic Data Release</p>
                        <p className="text-xs text-muted-foreground">CPI data scheduled for release in 2 hours</p>
                        <p className="text-xs text-muted-foreground">Expected impact: High</p>
                      </div>
                      <Badge variant="secondary">Medium</Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Market Momentum</p>
                        <p className="text-xs text-muted-foreground">Technology sector showing strong upward momentum</p>
                        <p className="text-xs text-muted-foreground">15 minutes ago</p>
                      </div>
                      <Badge variant="default">Info</Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                      <Globe className="h-5 w-5 text-secondary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Central Bank Watch</p>
                        <p className="text-xs text-muted-foreground">Fed officials speaking today - market sensitive</p>
                        <p className="text-xs text-muted-foreground">1 hour ago</p>
                      </div>
                      <Badge variant="outline">Watch</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Volatility Monitor</CardTitle>
                  <CardDescription>Current volatility across major assets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { asset: "VIX", current: 13.8, change: -2.4, level: "low" },
                      { asset: "10Y Treasury", current: 12.4, change: 1.2, level: "medium" },
                      { asset: "EUR/USD", current: 8.7, change: -0.3, level: "low" },
                      { asset: "Oil (WTI)", current: 24.8, change: 3.1, level: "high" },
                      { asset: "Gold", current: 15.2, change: 0.8, level: "medium" },
                      { asset: "Bitcoin", current: 67.3, change: -4.2, level: "very high" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{item.asset}</span>
                          {item.change >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-destructive" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant={
                            item.level === "very high" ? "destructive" :
                            item.level === "high" ? "secondary" :
                            item.level === "medium" ? "outline" : "default"
                          }>
                            {item.current}%
                          </Badge>
                          <div className={`text-xs ${item.change >= 0 ? 'text-destructive' : 'text-primary'}`}>
                            {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
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