import { ResponsiveContainer, ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine, Brush } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Maximize2 } from "lucide-react";

interface AdvancedChartProps {
  data: any[];
  title: string;
  description?: string;
  primaryMetric: string;
  secondaryMetric?: string;
  chartType?: "line" | "area" | "composed";
  showBrush?: boolean;
  annotations?: Array<{ x: string; label: string; color: string }>;
  height?: number;
}

export const AdvancedChart = ({ 
  data, 
  title, 
  description, 
  primaryMetric, 
  secondaryMetric,
  chartType = "composed",
  showBrush = false,
  annotations = [],
  height = 350
}: AdvancedChartProps) => {
  const latest = data[data.length - 1];
  const previous = data[data.length - 2];
  const change = latest && previous ? ((latest[primaryMetric] - previous[primaryMetric]) / previous[primaryMetric] * 100) : 0;

  const chartConfig = {
    [primaryMetric]: { label: primaryMetric, color: "hsl(var(--primary))" },
    [secondaryMetric || ""]: { label: secondaryMetric, color: "hsl(var(--secondary))" },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {title}
            </CardTitle>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-2xl font-bold">{latest?.[primaryMetric]?.toFixed(2)}</div>
              <div className={`text-sm flex items-center ${change >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {change > 0 ? '+' : ''}{change.toFixed(2)}%
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className={`h-[${height}px]`}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ stroke: "hsl(var(--border))", strokeDasharray: "5 5" }}
              />
              
              {/* Annotations */}
              {annotations.map((annotation, index) => (
                <ReferenceLine 
                  key={index}
                  x={annotation.x} 
                  stroke={annotation.color} 
                  strokeDasharray="2 2"
                  label={{ value: annotation.label, position: "top" }}
                />
              ))}
              
              {chartType === "area" && (
                <Area 
                  type="monotone" 
                  dataKey={primaryMetric} 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              )}
              
              {(chartType === "line" || chartType === "composed") && (
                <Line 
                  type="monotone" 
                  dataKey={primaryMetric} 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              )}
              
              {secondaryMetric && (
                <Line 
                  type="monotone" 
                  dataKey={secondaryMetric} 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "hsl(var(--secondary))", strokeWidth: 2, r: 2 }}
                />
              )}
              
              {showBrush && (
                <Brush 
                  dataKey="date" 
                  height={30} 
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--muted))"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Chart Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-sm">{primaryMetric}</span>
          </div>
          {secondaryMetric && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary border-2 border-dashed"></div>
              <span className="text-sm">{secondaryMetric}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};