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
import { Plus, Database, RefreshCw, Eye, Trash2, ExternalLink } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface Dataset {
  id: string
  name: string
  description?: string
  source_type: string
  source_config: any
  schema_info?: any
  row_count?: number
  last_synced?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function QuantDatasets() {
  const { user } = useAuth()
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [newDataset, setNewDataset] = useState({
    name: '',
    description: '',
    source_type: 'portfolio',
    config: {}
  })

  useEffect(() => {
    if (user) {
      fetchDatasets()
    }
  }, [user])

  const fetchDatasets = async () => {
    try {
      const { data, error } = await supabase
        .from('quant_datasets')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setDatasets(data || [])
    } catch (error) {
      console.error('Error fetching datasets:', error)
      toast.error('Failed to fetch datasets')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDataset = async () => {
    if (!newDataset.name.trim()) {
      toast.error('Dataset name is required')
      return
    }

    try {
      const { data, error } = await supabase
        .from('quant_datasets')
        .insert({
          user_id: user!.id,
          name: newDataset.name,
          description: newDataset.description || null,
          source_type: newDataset.source_type,
          source_config: newDataset.config,
        })
        .select()
        .single()

      if (error) throw error

      setDatasets([data, ...datasets])
      setIsCreateDialogOpen(false)
      setNewDataset({ name: '', description: '', source_type: 'portfolio', config: {} })
      toast.success('Dataset created successfully')
    } catch (error) {
      console.error('Error creating dataset:', error)
      toast.error('Failed to create dataset')
    }
  }

  const handleSyncDataset = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('quant-datasets', {
        body: { action: 'sync', dataset_id: id }
      })

      if (error) throw error
      
      toast.success('Dataset sync started')
      fetchDatasets() // Refresh to show updated sync status
    } catch (error) {
      console.error('Error syncing dataset:', error)
      toast.error('Failed to sync dataset')
    }
  }

  const handlePreviewDataset = async (dataset: Dataset) => {
    try {
      setIsPreviewOpen(true)
      setSelectedDataset(dataset)
      
      const { data, error } = await supabase.functions.invoke('quant-datasets', {
        body: { 
          action: 'preview', 
          dataset_id: dataset.id,
          limit: 100 
        }
      })

      if (error) throw error
      setPreviewData(data?.rows || [])
    } catch (error) {
      console.error('Error previewing dataset:', error)
      toast.error('Failed to preview dataset')
      setPreviewData([])
    }
  }

  const handleDeleteDataset = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dataset?')) return

    try {
      const { error } = await supabase
        .from('quant_datasets')
        .delete()
        .eq('id', id)

      if (error) throw error

      setDatasets(datasets.filter(d => d.id !== id))
      toast.success('Dataset deleted successfully')
    } catch (error) {
      console.error('Error deleting dataset:', error)
      toast.error('Failed to delete dataset')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading datasets...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Data Sources</h1>
            <p className="text-muted-foreground">
              Manage your data connections for quantitative analysis
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Dataset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Dataset</DialogTitle>
                <DialogDescription>
                  Connect to a data source for your quantitative analysis.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newDataset.name}
                    onChange={(e) => setNewDataset({ ...newDataset, name: e.target.value })}
                    className="col-span-3"
                    placeholder="My Portfolio Data"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="source_type" className="text-right">
                    Source Type
                  </Label>
                  <Select 
                    value={newDataset.source_type} 
                    onValueChange={(value) => setNewDataset({ ...newDataset, source_type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portfolio">Portfolio Data</SelectItem>
                      <SelectItem value="market">Market Data</SelectItem>
                      <SelectItem value="external">External API</SelectItem>
                      <SelectItem value="csv">CSV Upload</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newDataset.description}
                    onChange={(e) => setNewDataset({ ...newDataset, description: e.target.value })}
                    className="col-span-3"
                    placeholder="Optional description..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateDataset}>
                  Create Dataset
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {datasets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Database className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No datasets yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Connect your first data source to start quantitative analysis
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Dataset
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {datasets.map((dataset) => (
              <Card key={dataset.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {dataset.name}
                        <Badge variant={dataset.is_active ? "default" : "secondary"}>
                          {dataset.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </CardTitle>
                      {dataset.description && (
                        <CardDescription className="mt-1">
                          {dataset.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreviewDataset(dataset)}
                        title="Preview data"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSyncDataset(dataset.id)}
                        title="Sync data"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteDataset(dataset.id)}
                        title="Delete dataset"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Source:</span>
                      <p className="font-medium capitalize">{dataset.source_type}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rows:</span>
                      <p className="font-medium">{dataset.row_count?.toLocaleString() || 'Unknown'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Synced:</span>
                      <p className="font-medium">
                        {dataset.last_synced 
                          ? new Date(dataset.last_synced).toLocaleDateString() 
                          : 'Never'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <p className="font-medium">{new Date(dataset.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Dataset Preview: {selectedDataset?.name}</DialogTitle>
              <DialogDescription>
                Showing first 100 rows of data
              </DialogDescription>
            </DialogHeader>
            
            <div className="max-h-96 overflow-auto border rounded-md">
              {previewData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(previewData[0] || {}).map((column) => (
                        <TableHead key={column}>{column}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.slice(0, 20).map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value: any, cellIndex) => (
                          <TableCell key={cellIndex} className="text-xs">
                            {typeof value === 'object' 
                              ? JSON.stringify(value) 
                              : String(value || '—')
                            }
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}