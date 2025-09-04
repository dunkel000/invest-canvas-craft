import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageCircle, 
  BarChart3,
  Smile,
  Frown,
  Meh
} from "lucide-react";

interface SentimentData {
  source: string;
  sentiment: number; // -100 to 100
  change: number;
  volume: number;
  reliability: number;
  lastUpdated: string;
}

interface SentimentMetric {
  name: string;
  value: number;
  change: number;
  description: string;
}

interface SentimentAnalysisProps {
  sources: SentimentData[];
  metrics: SentimentMetric[];
  overallSentiment: number;
  fearGreedIndex: number;
}

export const SentimentAnalysis = ({ 
  sources, 
  metrics, 
  overallSentiment, 
  fearGreedIndex 
}: SentimentAnalysisProps) => {
  const getSentimentIcon = (sentiment: number) => {
    if (sentiment > 20) return <Smile className="h-4 w-4 text-success" />;
    if (sentiment < -20) return <Frown className="h-4 w-4 text-destructive" />;
    return <Meh className="h-4 w-4 text-warning" />;
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 20) return "text-success";
    if (sentiment < -20) return "text-destructive";
    return "text-warning";
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 60) return "Extremely Bullish";
    if (sentiment > 20) return "Bullish";
    if (sentiment > -20) return "Neutral";
    if (sentiment > -60) return "Bearish";
    return "Extremely Bearish";
  };

  const getFearGreedLabel = (index: number) => {
    if (index >= 75) return "Extreme Greed";
    if (index >= 55) return "Greed";
    if (index >= 45) return "Neutral";
    if (index >= 25) return "Fear";
    return "Extreme Fear";
  };

  const getFearGreedColor = (index: number) => {
    if (index >= 75) return "text-destructive";
    if (index >= 55) return "text-warning";
    if (index >= 45) return "text-primary";
    if (index >= 25) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6">
      {/* Overall Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Market Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              {getSentimentIcon(overallSentiment)}
              <div className={`text-4xl font-bold ${getSentimentColor(overallSentiment)}`}>
                {overallSentiment > 0 ? '+' : ''}{overallSentiment.toFixed(0)}
              </div>
            </div>
            <div className="space-y-2">
              <div className={`font-medium ${getSentimentColor(overallSentiment)}`}>
                {getSentimentLabel(overallSentiment)}
              </div>
              <Progress 
                value={50 + (overallSentiment / 2)} 
                className="h-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Bearish</span>
                <span>Neutral</span>
                <span>Bullish</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Fear & Greed Index
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className={`text-4xl font-bold ${getFearGreedColor(fearGreedIndex)}`}>
              {fearGreedIndex}
            </div>
            <div className="space-y-2">
              <div className={`font-medium ${getFearGreedColor(fearGreedIndex)}`}>
                {getFearGreedLabel(fearGreedIndex)}
              </div>
              <Progress 
                value={fearGreedIndex} 
                className="h-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Extreme Fear</span>
                <span>Neutral</span>
                <span>Extreme Greed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sources.map((source, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{source.source}</div>
                    <Badge variant="outline" className="text-xs">
                      {source.reliability}% reliable
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    {source.volume.toLocaleString()} signals
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getSentimentColor(source.sentiment)}`}>
                      {source.sentiment > 0 ? '+' : ''}{source.sentiment.toFixed(0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Sentiment Score</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`flex items-center justify-center gap-1 text-lg font-bold ${
                      source.change >= 0 ? 'text-primary' : 'text-destructive'
                    }`}>
                      {source.change >= 0 ? 
                        <TrendingUp className="h-4 w-4" /> : 
                        <TrendingDown className="h-4 w-4" />
                      }
                      {source.change > 0 ? '+' : ''}{source.change.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">24h Change</div>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {getSentimentLabel(source.sentiment)}
                    </div>
                    <div className="text-sm text-muted-foreground">Classification</div>
                  </div>
                </div>

                <div className="mt-3">
                  <Progress 
                    value={50 + (source.sentiment / 2)} 
                    className="h-2"
                  />
                </div>

                <div className="mt-2 text-xs text-muted-foreground text-right">
                  Last updated: {source.lastUpdated}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Sentiment Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center space-y-2 p-4 border border-border rounded-lg">
                <div className="text-lg font-bold">{metric.value.toFixed(1)}</div>
                <div className="text-sm font-medium">{metric.name}</div>
                <div className={`text-xs flex items-center justify-center gap-1 ${
                  metric.change >= 0 ? 'text-primary' : 'text-destructive'
                }`}>
                  {metric.change >= 0 ? 
                    <TrendingUp className="h-3 w-3" /> : 
                    <TrendingDown className="h-3 w-3" />
                  }
                  {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Market Psychology Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-sm font-medium text-primary">Bullish Signals</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Institutional buying pressure increasing
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Social sentiment improving across platforms
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Options flow showing bullish positioning
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-sm font-medium text-destructive">Bearish Signals</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  Elevated VIX suggesting fear
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  High put/call ratios
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  Negative news sentiment trending
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};