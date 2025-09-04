import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, ExternalLink, Bookmark, Share2, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: Date;
  category: "breaking" | "economic" | "market" | "policy" | "earnings";
  sentiment: "positive" | "negative" | "neutral";
  impact: "high" | "medium" | "low";
  tags: string[];
  url?: string;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Federal Reserve Signals Potential Rate Cut in Next Meeting",
    summary: "Fed officials hint at dovish policy shift amid cooling inflation data, markets rally on speculation",
    source: "Federal Reserve",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    category: "breaking",
    sentiment: "positive",
    impact: "high",
    tags: ["Fed", "Interest Rates", "Monetary Policy"]
  },
  {
    id: "2",
    title: "Q3 GDP Growth Exceeds Expectations at 4.9%",
    summary: "Strong consumer spending and business investment drive economic expansion beyond forecasts",
    source: "Bureau of Economic Analysis",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    category: "economic",
    sentiment: "positive",
    impact: "high",
    tags: ["GDP", "Economic Growth", "Consumer Spending"]
  },
  {
    id: "3",
    title: "Tech Sector Volatility Spikes on AI Regulation Concerns",
    summary: "Major tech stocks see increased volatility as new AI oversight framework is proposed",
    source: "Market Watch",
    timestamp: new Date(Date.now() - 32 * 60 * 1000), // 32 minutes ago
    category: "market",
    sentiment: "negative",
    impact: "medium",
    tags: ["Technology", "AI", "Regulation", "Volatility"]
  },
  {
    id: "4",
    title: "Oil Prices Surge 3% on Geopolitical Tensions",
    summary: "Crude oil futures climb as Middle East supply concerns intensify market sentiment",
    source: "Energy Information Administration",
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    category: "market",
    sentiment: "neutral",
    impact: "medium",
    tags: ["Oil", "Energy", "Geopolitics", "Commodities"]
  },
  {
    id: "5",
    title: "Unemployment Rate Drops to 3.2%, Lowest in Two Years",
    summary: "Job market continues to show strength with 250K new positions added in latest report",
    source: "Bureau of Labor Statistics",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    category: "economic",
    sentiment: "positive",
    impact: "high",
    tags: ["Employment", "Jobs", "Labor Market"]
  }
];

export const RealTimeNewsFeed = () => {
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [filter, setFilter] = useState<string>("all");

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <TrendingUp className="h-4 w-4 text-primary" />;
      case "negative": return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "breaking": return "bg-destructive/10 text-destructive border-destructive/20";
      case "economic": return "bg-primary/10 text-primary border-primary/20";
      case "market": return "bg-secondary/10 text-secondary border-secondary/20";
      case "policy": return "bg-warning/10 text-warning border-warning/20";
      case "earnings": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const filteredNews = filter === "all" ? news : news.filter(item => item.category === filter);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Market News Feed
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {["all", "breaking", "economic", "market", "policy"].map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category)}
              className="text-xs"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="space-y-1 p-4">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className="group border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="text-xs">
                      {item.source.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1 shrink-0">
                        {getSentimentIcon(item.sentiment)}
                        <Badge variant={getImpactColor(item.impact)} className="text-xs">
                          {item.impact}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {item.source}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(item.timestamp)} ago
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Bookmark className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Share2 className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};