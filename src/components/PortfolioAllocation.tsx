import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Asset } from '@/hooks/usePortfolios';

interface PortfolioAllocationProps {
  assets: Asset[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316'];

export const PortfolioAllocation = ({ assets }: PortfolioAllocationProps) => {
  const allocationData = assets.map((asset, index) => ({
    name: asset.symbol || asset.name,
    value: asset.allocation_percentage || 0,
    amount: asset.total_value || 0,
    color: COLORS[index % COLORS.length],
  })).filter(item => item.value > 0);

  const totalAllocation = allocationData.reduce((sum, item) => sum + item.value, 0);
  const unallocated = Math.max(0, 100 - totalAllocation);

  if (unallocated > 0) {
    allocationData.push({
      name: 'Unallocated',
      value: unallocated,
      amount: 0,
      color: '#e5e7eb',
    });
  }

  if (assets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No assets in this portfolio yet.</p>
        <p className="text-sm text-muted-foreground mt-2">Add some assets to see the allocation breakdown.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Allocation Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Asset Allocation</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Allocation']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Value Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={allocationData.filter(item => item.name !== 'Unallocated')}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                  labelFormatter={(label) => `Asset: ${label}`}
                />
                <Bar dataKey="amount" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Allocation Details */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Allocation Breakdown</h3>
          <div className="space-y-4">
            {assets.map((asset, index) => {
              const allocation = asset.allocation_percentage || 0;
              const targetAllocation = asset.target_allocation_percentage || 0;
              const difference = allocation - targetAllocation;
              
              return (
                <div key={asset.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <span className="font-medium">{asset.symbol || asset.name}</span>
                        {asset.symbol && asset.name !== asset.symbol && (
                          <span className="text-sm text-muted-foreground ml-2">({asset.name})</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        ${(asset.total_value || 0).toLocaleString()}
                      </span>
                      <Badge variant={Math.abs(difference) > 5 ? "destructive" : "secondary"}>
                        {allocation.toFixed(1)}%
                      </Badge>
                      {targetAllocation > 0 && (
                        <span className="text-xs text-muted-foreground">
                          Target: {targetAllocation.toFixed(1)}%
                          {difference !== 0 && (
                            <span className={difference > 0 ? "text-success" : "text-destructive"}>
                              {" "}({difference > 0 ? "+" : ""}{difference.toFixed(1)}%)
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <Progress value={allocation} className="h-2" />
                </div>
              );
            })}
            
            {unallocated > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-gray-300" />
                    <span className="font-medium text-muted-foreground">Unallocated</span>
                  </div>
                  <Badge variant="outline">{unallocated.toFixed(1)}%</Badge>
                </div>
                <Progress value={unallocated} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};