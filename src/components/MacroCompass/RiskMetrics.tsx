import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Target,
  Zap,
  BarChart3
} from "lucide-react";

interface RiskMetric {
  name: string;
  value: number;
  change: number;
  status: "low" | "medium" | "high" | "critical";
  description: string;
  threshold: {
    low: number;
    medium: number;
    high: number;
  };
}

interface RiskMetricsProps {
  metrics: RiskMetric[];
  overallScore: number;
  riskAppetite: "conservative" | "moderate" | "aggressive";
}

export const RiskMetrics = ({ metrics, overallScore, riskAppetite }: RiskMetricsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "low": return "secondary";
      case "medium": return "default";
      case "high": return "destructive";
      case "critical": return "destructive";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "low": return <Shield className="h-4 w-4 text-success" />;
      case "medium": return <Activity className="h-4 w-4 text-primary" />;
      case "high": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "critical": return <Zap className="h-4 w-4 text-destructive" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return "Low Risk";
    if (score >= 60) return "Moderate Risk";
    if (score >= 40) return "High Risk";
    return "Critical Risk";
  };

  const criticalMetrics = metrics.filter(m => m.status === "critical" || m.status === "high");

  return (
    <div className="space-y-6">
      {/* Overall Risk Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Portfolio Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}
              </div>
              <div className="text-sm text-muted-foreground">Risk Score</div>
              <div className={`text-sm font-medium ${getScoreColor(overallScore)}`}>
                {getRiskLevel(overallScore)}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Risk Appetite</span>
                <Badge variant="outline" className="capitalize">
                  {riskAppetite}
                </Badge>
              </div>
              <Progress value={overallScore} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Conservative</span>
                <span>Moderate</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Recommendation</div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                {overallScore >= 80 
                  ? "Portfolio risk is well-managed. Consider minor position adjustments."
                  : overallScore >= 60
                  ? "Moderate risk detected. Monitor positions closely and consider hedging."
                  : "High risk exposure. Immediate portfolio rebalancing recommended."
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {criticalMetrics.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Critical Risk Alerts ({criticalMetrics.length})</div>
            <div className="space-y-1">
              {criticalMetrics.map((metric, index) => (
                <div key={index} className="text-sm">
                  • {metric.name}: {metric.value.toFixed(2)} 
                  ({metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%)
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Individual Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{metric.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(metric.status)}
                  <Badge variant={getStatusColor(metric.status)} className="text-xs">
                    {metric.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {metric.value.toFixed(2)}
                </div>
                <div className={`flex items-center justify-center gap-1 text-sm ${
                  metric.change >= 0 ? 'text-destructive' : 'text-success'
                }`}>
                  {metric.change >= 0 ? 
                    <TrendingUp className="h-3 w-3" /> : 
                    <TrendingDown className="h-3 w-3" />
                  }
                  {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                </div>
              </div>

              {/* Risk Level Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Med</span>
                  <span>High</span>
                </div>
                <div className="relative">
                  <div className="w-full h-2 bg-gradient-to-r from-success via-warning to-destructive rounded-full"></div>
                  <div 
                    className="absolute top-0 w-3 h-2 bg-foreground border-2 border-background rounded-full transform -translate-x-1/2"
                    style={{
                      left: `${Math.min(100, Math.max(0, 
                        (metric.value - metric.threshold.low) / 
                        (metric.threshold.high - metric.threshold.low) * 100
                      ))}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span>{metric.threshold.low}</span>
                  <span>{metric.threshold.medium}</span>
                  <span>{metric.threshold.high}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {metric.description}
              </p>

              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="text-sm font-medium">Immediate Actions</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  Reduce position size in high-volatility assets
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  Increase cash allocation by 5-10%
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Consider VIX hedging strategies
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium">Strategic Adjustments</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Diversify across uncorrelated assets
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Implement systematic rebalancing
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  Review stop-loss levels
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};