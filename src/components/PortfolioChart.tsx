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
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#10b981" opacity={0.2} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
          <YAxis axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: '1px solid #10b981',
              borderRadius: '8px',
              color: '#10b981'
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorValue)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="growth"
            stroke="#059669"
            fillOpacity={1}
            fill="url(#colorGrowth)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};