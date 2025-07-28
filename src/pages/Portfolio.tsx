import { DashboardLayout } from "@/components/DashboardLayout"
import { PortfolioChart } from "@/components/PortfolioChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react"

const holdings = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 150, price: 175.23, change: 2.45, changePercent: 1.42, value: 26284.50 },
  { symbol: "GOOGL", name: "Alphabet Inc.", shares: 50, price: 2435.67, change: -12.34, changePercent: -0.50, value: 121783.50 },
  { symbol: "MSFT", name: "Microsoft Corp.", shares: 100, price: 332.89, change: 5.67, changePercent: 1.73, value: 33289.00 },
  { symbol: "TSLA", name: "Tesla Inc.", shares: 75, price: 248.56, change: -8.23, changePercent: -3.20, value: 18642.00 },
  { symbol: "AMZN", name: "Amazon.com Inc.", shares: 25, price: 3234.12, change: 15.78, changePercent: 0.49, value: 80853.00 },
]

const Portfolio = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Portfolio Holdings</h2>
          <p className="text-muted-foreground">Detailed view of your investment positions</p>
        </div>
        
        <PortfolioChart />
        
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Current Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {holdings.map((holding) => (
                <div key={holding.symbol} className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/5">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{holding.symbol.slice(0, 2)}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{holding.symbol}</h3>
                      <p className="text-sm text-muted-foreground">{holding.name}</p>
                      <p className="text-xs text-muted-foreground">{holding.shares} shares</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-foreground">${holding.price.toFixed(2)}</p>
                    <div className="flex items-center gap-1">
                      {holding.change > 0 ? (
                        <TrendingUp className="w-3 h-3 text-success" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-destructive" />
                      )}
                      <span className={`text-xs ${holding.change > 0 ? 'text-success' : 'text-destructive'}`}>
                        {holding.change > 0 ? '+' : ''}{holding.change.toFixed(2)} ({holding.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${holding.value.toLocaleString()}</p>
                    <Badge variant="outline" className="text-xs">
                      {((holding.value / 2847592) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Portfolio;