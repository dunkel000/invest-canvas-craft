import { DashboardLayout } from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Lightbulb, Building2, Globe2 } from "lucide-react";

const stocksByProvider = {
  "NASDAQ": [
    { symbol: "AAPL", name: "Apple Inc.", price: "$185.25", change: "+2.34%", positive: true },
    { symbol: "MSFT", name: "Microsoft Corp.", price: "$374.12", change: "+1.87%", positive: true },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: "$134.56", change: "-0.45%", positive: false },
    { symbol: "TSLA", name: "Tesla Inc.", price: "$248.73", change: "+3.21%", positive: true },
  ],
  "NYSE": [
    { symbol: "JPM", name: "JPMorgan Chase", price: "$154.89", change: "+0.67%", positive: true },
    { symbol: "JNJ", name: "Johnson & Johnson", price: "$162.34", change: "-0.23%", positive: false },
    { symbol: "V", name: "Visa Inc.", price: "$258.91", change: "+1.45%", positive: true },
    { symbol: "PG", name: "Procter & Gamble", price: "$145.67", change: "+0.89%", positive: true },
  ],
  "LSE": [
    { symbol: "SHEL", name: "Shell plc", price: "£24.56", change: "+1.23%", positive: true },
    { symbol: "AZN", name: "AstraZeneca", price: "£102.45", change: "-0.78%", positive: false },
    { symbol: "ULVR", name: "Unilever", price: "£38.92", change: "+0.56%", positive: true },
  ]
};

const investmentIdeas = [
  {
    title: "Clean Energy Transition",
    description: "Solar and wind energy companies positioned for long-term growth",
    tags: ["ESG", "Growth", "Long-term"],
    risk: "Medium"
  },
  {
    title: "AI & Machine Learning",
    description: "Companies at the forefront of artificial intelligence revolution",
    tags: ["Technology", "Innovation", "High-growth"],
    risk: "High"
  },
  {
    title: "Dividend Aristocrats",
    description: "Stable companies with 25+ years of consecutive dividend increases",
    tags: ["Income", "Stability", "Conservative"],
    risk: "Low"
  },
  {
    title: "Emerging Markets",
    description: "Growth opportunities in developing economies",
    tags: ["Global", "Growth", "Diversification"],
    risk: "High"
  }
];

const Discover = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Discover</h2>
            <p className="text-muted-foreground">Explore investment opportunities and market insights</p>
          </div>

          <Tabs defaultValue="stocks" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stocks" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Stocks by Exchange
              </TabsTrigger>
              <TabsTrigger value="ideas" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Investment Ideas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stocks" className="space-y-6">
              {Object.entries(stocksByProvider).map(([exchange, stocks]) => (
                <Card key={exchange}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe2 className="h-5 w-5" />
                      {exchange}
                    </CardTitle>
                    <CardDescription>
                      Top performing stocks from {exchange}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {stocks.map((stock) => (
                        <div key={stock.symbol} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-sm">{stock.symbol}</h4>
                              <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
                            </div>
                            {stock.positive ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-lg font-bold">{stock.price}</p>
                            <p className={`text-sm ${stock.positive ? 'text-green-600' : 'text-red-600'}`}>
                              {stock.change}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="ideas" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {investmentIdeas.map((idea, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        {idea.title}
                      </CardTitle>
                      <CardDescription>{idea.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {idea.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Risk Level:</span>
                          <Badge variant={
                            idea.risk === 'Low' ? 'default' : 
                            idea.risk === 'Medium' ? 'secondary' : 
                            'destructive'
                          }>
                            {idea.risk}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Discover;