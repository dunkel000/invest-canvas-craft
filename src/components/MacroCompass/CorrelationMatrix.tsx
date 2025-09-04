import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface CorrelationData {
  asset1: string;
  asset2: string;
  correlation: number;
  significance: number;
  period: string;
}

interface CorrelationMatrixProps {
  assets: string[];
  correlations: CorrelationData[];
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

export const CorrelationMatrix = ({ 
  assets, 
  correlations, 
  timeframe, 
  onTimeframeChange 
}: CorrelationMatrixProps) => {
  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.8) return correlation > 0 ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground";
    if (abs >= 0.6) return correlation > 0 ? "bg-primary/70 text-primary-foreground" : "bg-destructive/70 text-destructive-foreground";
    if (abs >= 0.4) return correlation > 0 ? "bg-primary/40 text-foreground" : "bg-destructive/40 text-foreground";
    if (abs >= 0.2) return correlation > 0 ? "bg-primary/20 text-foreground" : "bg-destructive/20 text-foreground";
    return "bg-muted text-muted-foreground";
  };

  const getCorrelation = (asset1: string, asset2: string): number => {
    if (asset1 === asset2) return 1;
    const correlation = correlations.find(
      c => (c.asset1 === asset1 && c.asset2 === asset2) || 
           (c.asset1 === asset2 && c.asset2 === asset1)
    );
    return correlation?.correlation || 0;
  };

  const getSignificance = (asset1: string, asset2: string): number => {
    if (asset1 === asset2) return 100;
    const correlation = correlations.find(
      c => (c.asset1 === asset1 && c.asset2 === asset2) || 
           (c.asset1 === asset2 && c.asset2 === asset1)
    );
    return correlation?.significance || 0;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Asset Correlation Matrix
          </CardTitle>
          <div className="flex items-center gap-3">
            <Select value={timeframe} onValueChange={onTimeframeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1M">1 Month</SelectItem>
                <SelectItem value="3M">3 Months</SelectItem>
                <SelectItem value="6M">6 Months</SelectItem>
                <SelectItem value="1Y">1 Year</SelectItem>
                <SelectItem value="3Y">3 Years</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Matrix */}
          <div className="grid gap-1" style={{ gridTemplateColumns: `120px repeat(${assets.length}, 1fr)` }}>
            {/* Header row */}
            <div></div>
            {assets.map(asset => (
              <div key={asset} className="text-xs font-medium text-center p-2 text-muted-foreground">
                {asset}
              </div>
            ))}
            
            {/* Data rows */}
            {assets.map(rowAsset => (
              <>
                <div key={`${rowAsset}-label`} className="text-xs font-medium p-2 text-right text-muted-foreground">
                  {rowAsset}
                </div>
                {assets.map(colAsset => {
                  const correlation = getCorrelation(rowAsset, colAsset);
                  const significance = getSignificance(rowAsset, colAsset);
                  
                  return (
                    <div
                      key={`${rowAsset}-${colAsset}`}
                      className={`
                        ${getCorrelationColor(correlation)}
                        p-2 text-center text-xs font-medium rounded cursor-pointer
                        hover:scale-105 transition-transform group relative
                      `}
                      title={`${rowAsset} vs ${colAsset}: ${correlation.toFixed(3)} (${significance}% significant)`}
                    >
                      {correlation.toFixed(2)}
                      {significance < 95 && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-warning rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>

          {/* Legend */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="text-sm font-medium">Correlation Strength</div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary"></div>
                  <span>Strong Positive (0.8+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary/40"></div>
                  <span>Moderate (0.4-0.8)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted"></div>
                  <span>Weak (0-0.4)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-destructive/40"></div>
                  <span>Negative (-0.4 to 0)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-destructive"></div>
                  <span>Strong Negative (-0.8+)</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span>Low significance (&lt;95%)</span>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-border">
            <div className="space-y-2">
              <div className="text-sm font-medium text-primary">Highest Positive</div>
              <div className="text-xs text-muted-foreground">
                SPY-QQQ: 0.92 (Very High)
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-destructive">Highest Negative</div>
              <div className="text-xs text-muted-foreground">
                VIX-SPY: -0.78 (High)
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-warning">Diversification</div>
              <div className="text-xs text-muted-foreground">
                GLD offers best portfolio hedge
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};