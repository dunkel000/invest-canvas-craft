import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const mockData = [
  { name: 'Jan', value: 100000, growth: 102000 },
  { name: 'Feb', value: 105000, growth: 108000 },
  { name: 'Mar', value: 103000, growth: 112000 },
  { name: 'Apr', value: 108000, growth: 116000 },
  { name: 'May', value: 112000, growth: 120000 },
  { name: 'Jun', value: 118000, growth: 125000 },
];

export const PortfolioChart = () => {
  return (
    <div className="w-full h-64 bg-card/30 rounded-lg border border-border/50 p-4 backdrop-blur-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Portfolio Performance</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockData}>
          <defs>
            <linearGradient id="portfolioGradientPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--chart-line-primary))" stopOpacity={0.4} />
              <stop offset="70%" stopColor="hsl(var(--chart-line-primary))" stopOpacity={0.1} />
              <stop offset="100%" stopColor="hsl(var(--chart-line-primary))" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="portfolioGradientSecondary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--chart-line-secondary))" stopOpacity={0.3} />
              <stop offset="70%" stopColor="hsl(var(--chart-line-secondary))" stopOpacity={0.08} />
              <stop offset="100%" stopColor="hsl(var(--chart-line-secondary))" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
          <YAxis axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--popover))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--popover-foreground))'
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--chart-line-primary))"
            fillOpacity={1}
            fill="url(#portfolioGradientPrimary)"
            strokeWidth={2.5}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="growth"
            stroke="hsl(var(--chart-line-secondary))"
            fillOpacity={1}
            fill="url(#portfolioGradientSecondary)"
            strokeWidth={2.5}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};