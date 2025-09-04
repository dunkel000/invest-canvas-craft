import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, Info, Target } from "lucide-react";

interface EconomicIndicatorProps {
  title: string;
  value: number;
  change: number;
  target?: number;
  unit: string;
  description: string;
  significance: "critical" | "high" | "medium" | "low";
  trend: "bullish" | "bearish" | "neutral";
  forecast?: {
    next: number;
    timeframe: string;
    confidence: number;
  };
  historical?: {
    high: number;
    low: number;
    average: number;
  };
}

export const EconomicIndicator = ({
  title,
  value,
  change,
  target,
  unit,
  description,
  significance,
  trend,
  forecast,
  historical
}: EconomicIndicatorProps) => {
  const getSignificanceColor = (sig: string) => {
    switch (sig) {
      case "critical": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "bullish": return <TrendingUp className="h-4 w-4 text-primary" />;
      case "bearish": return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
  };

  const getProgressValue = () => {
    if (!historical) return 50;
    const range = historical.high - historical.low;
    return ((value - historical.low) / range) * 100;
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <Badge variant={getSignificanceColor(significance)}>
              {significance}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Value */}
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">
            {value.toFixed(2)}{unit}
          </div>
          <div className={`flex items-center justify-center gap-1 text-sm ${change >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {change > 0 ? '+' : ''}{change.toFixed(2)}{unit} from last period
          </div>
        </div>

        {/* Target Comparison */}
        {target && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">vs Target</span>
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {target.toFixed(2)}{unit}
              </span>
            </div>
            <Progress 
              value={Math.abs((value / target) * 100)} 
              className="h-2"
            />
            <div className={`text-xs text-center ${value >= target ? 'text-primary' : 'text-destructive'}`}>
              {value >= target ? 'Above' : 'Below'} target by {Math.abs(value - target).toFixed(2)}{unit}
            </div>
          </div>
        )}

        {/* Historical Context */}
        {historical && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Historical Range</div>
            <div className="space-y-1">
              <Progress 
                value={getProgressValue()} 
                className="h-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low: {historical.low.toFixed(1)}{unit}</span>
                <span>Avg: {historical.average.toFixed(1)}{unit}</span>
                <span>High: {historical.high.toFixed(1)}{unit}</span>
              </div>
            </div>
          </div>
        )}

        {/* Forecast */}
        {forecast && (
          <div className="bg-muted/20 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Info className="h-4 w-4 text-primary" />
              {forecast.timeframe} Forecast
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">{forecast.next.toFixed(2)}{unit}</span>
              <Badge variant="outline">
                {forecast.confidence}% confidence
              </Badge>
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Details
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Add Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};