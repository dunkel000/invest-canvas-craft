import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface HeatmapData {
  name: string;
  value: number;
  change: number;
  volume?: number;
  marketCap?: number;
  category: string;
}

interface MarketHeatmapProps {
  data: HeatmapData[];
  title: string;
  description?: string;
}

export const MarketHeatmap = ({ data, title, description }: MarketHeatmapProps) => {
  const getHeatColor = (change: number) => {
    if (change >= 3) return "bg-primary/80 text-primary-foreground border-primary";
    if (change >= 1) return "bg-primary/40 text-foreground border-primary/50";
    if (change >= 0) return "bg-success/20 text-foreground border-success/30";
    if (change >= -1) return "bg-warning/20 text-foreground border-warning/30";
    if (change >= -3) return "bg-destructive/40 text-foreground border-destructive/50";
    return "bg-destructive/80 text-destructive-foreground border-destructive";
  };

  const getSize = (value: number, maxValue: number) => {
    const ratio = value / maxValue;
    if (ratio > 0.8) return "h-24 w-32";
    if (ratio > 0.6) return "h-20 w-28";
    if (ratio > 0.4) return "h-16 w-24";
    if (ratio > 0.2) return "h-12 w-20";
    return "h-10 w-16";
  };

  const maxValue = Math.max(...data.map(d => d.value));
  const categories = [...new Set(data.map(d => d.category))];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                {category}
              </h4>
              <div className="flex flex-wrap gap-3">
                {data
                  .filter(item => item.category === category)
                  .map((item, index) => (
                    <div
                      key={index}
                      className={`
                        ${getSize(item.value, maxValue)}
                        ${getHeatColor(item.change)}
                        rounded-lg p-3 border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer
                        flex flex-col justify-between relative overflow-hidden
                      `}
                    >
                      {/* Background pattern for better visual hierarchy */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="w-full h-full bg-gradient-to-br from-transparent via-white to-transparent"></div>
                      </div>
                      
                      <div className="relative z-10">
                        <div className="text-xs font-medium truncate mb-1">{item.name}</div>
                        <div className="text-lg font-bold">{item.value.toLocaleString()}</div>
                        
                        <div className="flex items-center gap-1 mt-1">
                          {item.change >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span className="text-xs font-medium">
                            {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                          </span>
                        </div>
                        
                        {item.volume && (
                          <div className="text-xs opacity-75 mt-1">
                            Vol: {(item.volume / 1000000).toFixed(1)}M
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary/80"></div>
                <span>Strong Growth (+3%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-success/20 border border-success/30"></div>
                <span>Positive (0-1%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-destructive/80"></div>
                <span>Strong Decline (-3%+)</span>
              </div>
            </div>
            <div className="text-muted-foreground">
              Size represents market cap/volume
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};