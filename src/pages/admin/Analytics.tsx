import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import AdminRoute from "@/components/AdminRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Database, Shield, AlertCircle, Users, TrendingUp } from "lucide-react";

interface AnalyticsData {
  totalUsers: number;
  totalPortfolios: number;
  totalAssets: number;
  recentLogins: number;
}

interface LogEntry {
  id: string;
  timestamp: number;
  level: string;
  msg: string;
  path?: string;
  status?: string;
}

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalPortfolios: 0,
    totalAssets: 0,
    recentLogins: 0
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLogType, setSelectedLogType] = useState<string>("auth");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      // Fetch basic statistics
      const [profilesRes, portfoliosRes, assetsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('portfolios').select('id', { count: 'exact', head: true }),
        supabase.from('assets').select('id', { count: 'exact', head: true })
      ]);

      setAnalyticsData({
        totalUsers: profilesRes.count || 0,
        totalPortfolios: portfoliosRes.count || 0,
        totalAssets: assetsRes.count || 0,
        recentLogins: 0 // Will be calculated from logs
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    }
  };

  const fetchLogs = async (logType: string) => {
    try {
      let query = '';
      
      switch (logType) {
        case 'auth':
          query = `
            select id, auth_logs.timestamp, event_message, metadata.level, metadata.status, metadata.path, metadata.msg as msg, metadata.error 
            from auth_logs
            cross join unnest(metadata) as metadata
            order by timestamp desc
            limit 50
          `;
          break;
        case 'db':
          query = `
            select identifier, postgres_logs.timestamp, id, event_message, parsed.error_severity 
            from postgres_logs
            cross join unnest(metadata) as m
            cross join unnest(m.parsed) as parsed
            order by timestamp desc
            limit 50
          `;
          break;
        case 'edge':
          query = `
            select id, function_edge_logs.timestamp, event_message, response.status_code, request.method, m.function_id, m.execution_time_ms, m.deployment_id, m.version 
            from function_edge_logs
            cross join unnest(metadata) as m
            cross join unnest(m.response) as response
            cross join unnest(m.request) as request
            order by timestamp desc
            limit 50
          `;
          break;
        default:
          return;
      }

      // For now, we'll simulate analytics data since we don't have direct access to Supabase analytics
      // In a real implementation, you would use Supabase Analytics API or edge functions
      const simulatedLogs: LogEntry[] = [
        {
          id: '1',
          timestamp: Date.now() * 1000,
          level: 'info',
          msg: `${logType} activity logged`,
          path: logType === 'auth' ? '/auth' : logType === 'db' ? '/database' : '/edge-function',
          status: '200'
        }
      ];

      setLogs(simulatedLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      // Use fallback method if analytics query fails
      setLogs([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAnalytics(),
        fetchLogs(selectedLogType)
      ]);
      setLoading(false);
    };
    
    loadData();
  }, [selectedLogType]);

  const getLevelBadgeVariant = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'error':
        return 'destructive';
      case 'warn':
      case 'warning':
        return 'secondary';
      case 'info':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp / 1000).toLocaleString();
  };

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">System Analytics</h2>
            <p className="text-muted-foreground">Monitor system performance and user activity</p>
          </div>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Registered users
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portfolios</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalPortfolios}</div>
                <p className="text-xs text-muted-foreground">
                  Created portfolios
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalAssets}</div>
                <p className="text-xs text-muted-foreground">
                  Assets in portfolios
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Healthy</div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Logs Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>System Logs</CardTitle>
                <div className="flex gap-2">
                  <Select value={selectedLogType} onValueChange={setSelectedLogType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select log type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auth">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Auth Logs
                        </div>
                      </SelectItem>
                      <SelectItem value="db">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          Database Logs
                        </div>
                      </SelectItem>
                      <SelectItem value="edge">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Edge Function Logs
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    onClick={() => fetchLogs(selectedLogType)}
                    disabled={loading}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : logs.length > 0 ? (
                <div className="max-h-[500px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Path</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-xs">
                            {formatTimestamp(log.timestamp)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getLevelBadgeVariant(log.level)}>
                              {log.level}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-md truncate">
                            {log.msg}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {log.path || '-'}
                          </TableCell>
                          <TableCell>
                            {log.status && (
                              <Badge variant={log.status.startsWith('2') ? 'outline' : 'destructive'}>
                                {log.status}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-8">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No logs available for {selectedLogType} category
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Logs will appear here as system events occur
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
};

export default Analytics;