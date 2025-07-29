import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import AdminRoute from "@/components/AdminRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Search, Download, Calendar, User, Settings } from "lucide-react";

interface AuditLog {
  id: string;
  admin_user_id: string;
  target_user_id?: string;
  action: string;
  details: any;
  created_at: string;
}

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const { toast } = useToast();

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      setLogs(data || []);
      setFilteredLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch audit logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // Filter logs based on search term and action filter
  useEffect(() => {
    let filtered = logs;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.admin_user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.target_user_id && log.target_user_id.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply action filter
    if (actionFilter !== "all") {
      filtered = filtered.filter(log => log.action.startsWith(actionFilter));
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, actionFilter]);

  const getActionVariant = (action: string) => {
    if (action.includes('assign_role') || action.includes('promote')) {
      return 'default' as const;
    }
    if (action.includes('remove_role') || action.includes('delete')) {
      return 'destructive' as const;
    }
    if (action.includes('update') || action.includes('edit')) {
      return 'secondary' as const;
    }
    return 'outline' as const;
  };

  const getActionIcon = (action: string) => {
    if (action.includes('role') || action.includes('promote')) {
      return <User className="h-4 w-4" />;
    }
    if (action.includes('settings') || action.includes('config')) {
      return <Settings className="h-4 w-4" />;
    }
    return <Activity className="h-4 w-4" />;
  };

  const formatAction = (action: string) => {
    return action
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Admin User', 'Target User', 'Action', 'Details'],
      ...filteredLogs.map(log => [
        new Date(log.created_at).toISOString(),
        log.admin_user_id,
        log.target_user_id || '',
        log.action,
        JSON.stringify(log.details)
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Audit logs exported successfully",
    });
  };

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Audit Logs</h2>
              <p className="text-muted-foreground">Track all administrative actions and system events</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="assign_role">Role Changes</SelectItem>
                  <SelectItem value="promote">Promotions</SelectItem>
                  <SelectItem value="update">Updates</SelectItem>
                  <SelectItem value="delete">Deletions</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={exportLogs}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </span>
                <span className="text-sm font-normal text-muted-foreground">
                  {loading ? "Loading..." : `${filteredLogs.length} of ${logs.length} logs`}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredLogs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Admin User</TableHead>
                      <TableHead>Target User</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(log.created_at).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getActionVariant(log.action)}
                            className="flex items-center gap-1 w-fit"
                          >
                            {getActionIcon(log.action)}
                            {formatAction(log.action)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.admin_user_id.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.target_user_id ? `${log.target_user_id.slice(0, 8)}...` : '-'}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="text-sm text-muted-foreground truncate">
                            {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">
                    {logs.length === 0 
                      ? "No audit logs found. Administrative actions will appear here."
                      : "No logs match your current filters."
                    }
                  </p>
                  {logs.length > 0 && filteredLogs.length === 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => {
                        setSearchTerm("");
                        setActionFilter("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
};

export default AuditLogs;