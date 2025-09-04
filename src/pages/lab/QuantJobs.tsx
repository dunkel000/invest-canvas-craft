import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Clock, Play, Pause, Trash2, Calendar, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface Job {
  id: string
  name: string
  description?: string
  notebook_id?: string
  cron_expression: string
  parameters?: any
  status: 'active' | 'paused' | 'disabled' | 'completed' | 'failed'
  last_run_id?: string
  next_run_at?: string
  created_at: string
  updated_at: string
}

interface Notebook {
  id: string
  name: string
}

export default function QuantJobs() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [newJob, setNewJob] = useState({
    name: '',
    description: '',
    notebook_id: '',
    cron_expression: '0 9 * * 1-5', // 9 AM on weekdays
    parameters: '{}'
  })

  const cronPresets = [
    { label: 'Every day at 9 AM', value: '0 9 * * *' },
    { label: 'Weekdays at 9 AM', value: '0 9 * * 1-5' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Every 30 minutes', value: '*/30 * * * *' },
    { label: 'Weekly on Monday at 9 AM', value: '0 9 * * 1' },
    { label: 'Monthly on 1st at 9 AM', value: '0 9 1 * *' }
  ]

  useEffect(() => {
    if (user) {
      fetchJobs()
      fetchNotebooks()
    }
  }, [user])

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('quant_jobs')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setJobs(data || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  const fetchNotebooks = async () => {
    try {
      const { data, error } = await supabase
        .from('quant_notebooks')
        .select('id, name')
        .order('name')

      if (error) throw error
      setNotebooks(data || [])
    } catch (error) {
      console.error('Error fetching notebooks:', error)
    }
  }

  const validateCronExpression = (cron: string): boolean => {
    // Basic cron validation - should have 5 parts
    const parts = cron.trim().split(/\s+/)
    return parts.length === 5
  }

  const handleCreateJob = async () => {
    if (!newJob.name.trim() || !newJob.cron_expression.trim()) {
      toast.error('Job name and schedule are required')
      return
    }

    if (!validateCronExpression(newJob.cron_expression)) {
      toast.error('Invalid cron expression. Use format: minute hour day month day-of-week')
      return
    }

    try {
      const parameters = newJob.parameters.trim() ? JSON.parse(newJob.parameters) : {}
      
      const { data, error } = await supabase
        .from('quant_jobs')
        .insert({
          user_id: user!.id,
          name: newJob.name,
          description: newJob.description || null,
          notebook_id: newJob.notebook_id || null,
          cron_expression: newJob.cron_expression,
          parameters
        })
        .select()
        .single()

      if (error) throw error

      setJobs([data, ...jobs])
      setIsCreateDialogOpen(false)
      setNewJob({
        name: '',
        description: '',
        notebook_id: '',
        cron_expression: '0 9 * * 1-5',
        parameters: '{}'
      })
      toast.success('Job created successfully')
    } catch (error) {
      console.error('Error creating job:', error)
      if (error instanceof SyntaxError) {
        toast.error('Invalid JSON in parameters')
      } else {
        toast.error('Failed to create job')
      }
    }
  }

  const handleToggleJob = async (job: Job) => {
    const newStatus = job.status === 'active' ? 'paused' : 'active'
    
    try {
      const { error } = await supabase
        .from('quant_jobs')
        .update({ status: newStatus })
        .eq('id', job.id)

      if (error) throw error

      setJobs(jobs.map(j => j.id === job.id ? { ...j, status: newStatus } : j))
      toast.success(`Job ${newStatus === 'active' ? 'activated' : 'paused'}`)
    } catch (error) {
      console.error('Error updating job:', error)
      toast.error('Failed to update job')
    }
  }

  const handleRunJob = async (job: Job) => {
    try {
      const { data, error } = await supabase.functions.invoke('quant-jobs', {
        body: {
          action: 'run',
          job_id: job.id
        }
      })

      if (error) throw error

      toast.success('Job execution started')
      fetchJobs() // Refresh to show updated status
    } catch (error) {
      console.error('Error running job:', error)
      toast.error('Failed to run job')
    }
  }

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return

    try {
      const { error } = await supabase
        .from('quant_jobs')
        .delete()
        .eq('id', id)

      if (error) throw error

      setJobs(jobs.filter(j => j.id !== id))
      toast.success('Job deleted successfully')
    } catch (error) {
      console.error('Error deleting job:', error)
      toast.error('Failed to delete job')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>
      case 'disabled':
        return <Badge variant="destructive">Disabled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatNextRun = (nextRun?: string) => {
    if (!nextRun) return 'Not scheduled'
    
    const date = new Date(nextRun)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    
    if (diffMs < 0) return 'Overdue'
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffDays > 0) {
      return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`
    } else if (diffHours > 0) {
      return `In ${diffHours} hour${diffHours > 1 ? 's' : ''}`
    } else {
      return 'Soon'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading jobs...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Scheduled Jobs</h1>
            <p className="text-muted-foreground">
              Automate your quantitative analysis with scheduled notebook runs
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Job
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Scheduled Job</DialogTitle>
                <DialogDescription>
                  Schedule a notebook to run automatically on a recurring basis.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newJob.name}
                    onChange={(e) => setNewJob({ ...newJob, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Daily Portfolio Analysis"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notebook" className="text-right">
                    Notebook
                  </Label>
                  <Select 
                    value={newJob.notebook_id} 
                    onValueChange={(value) => setNewJob({ ...newJob, notebook_id: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a notebook..." />
                    </SelectTrigger>
                    <SelectContent>
                      {notebooks.map((notebook) => (
                        <SelectItem key={notebook.id} value={notebook.id}>
                          {notebook.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="schedule" className="text-right">
                    Schedule
                  </Label>
                  <Select 
                    value={newJob.cron_expression} 
                    onValueChange={(value) => setNewJob({ ...newJob, cron_expression: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cronPresets.map((preset) => (
                        <SelectItem key={preset.value} value={preset.value}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cron" className="text-right">
                    Custom Cron
                  </Label>
                  <Input
                    id="cron"
                    value={newJob.cron_expression}
                    onChange={(e) => setNewJob({ ...newJob, cron_expression: e.target.value })}
                    className="col-span-3"
                    placeholder="0 9 * * 1-5"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    className="col-span-3"
                    placeholder="Optional description..."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="parameters" className="text-right">
                    Parameters
                  </Label>
                  <Textarea
                    id="parameters"
                    value={newJob.parameters}
                    onChange={(e) => setNewJob({ ...newJob, parameters: e.target.value })}
                    className="col-span-3"
                    placeholder="{}"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateJob}>
                  Create Job
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {jobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No scheduled jobs</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first scheduled job to automate your analysis
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Job
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Jobs</CardTitle>
              <CardDescription>
                Manage your automated analysis workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{job.name}</p>
                          {job.description && (
                            <p className="text-sm text-muted-foreground">{job.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {job.cron_expression}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formatNextRun(job.next_run_at)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(job.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRunJob(job)}
                            title="Run now"
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleJob(job)}
                            title={job.status === 'active' ? 'Pause job' : 'Activate job'}
                          >
                            {job.status === 'active' ? (
                              <Pause className="h-3 w-3" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteJob(job.id)}
                            title="Delete job"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Cron Help */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Cron Expression Help
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p><strong>Format:</strong> minute hour day month day-of-week</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Examples:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><code>0 9 * * *</code> - Every day at 9:00 AM</li>
                    <li><code>0 9 * * 1-5</code> - Weekdays at 9:00 AM</li>
                    <li><code>*/30 * * * *</code> - Every 30 minutes</li>
                    <li><code>0 9 1 * *</code> - Monthly on 1st at 9:00 AM</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Special characters:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><code>*</code> - Any value</li>
                    <li><code>,</code> - List separator</li>
                    <li><code>-</code> - Range</li>
                    <li><code>/</code> - Step values</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}