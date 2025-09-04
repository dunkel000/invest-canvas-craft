import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Play, Edit, Trash2, FileCode, Clock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { NotebookEditor } from '@/components/quant/NotebookEditor'

interface Notebook {
  id: string
  name: string
  description?: string
  content: any
  version: number
  is_public: boolean
  tags: string[]
  created_at: string
  updated_at: string
}

export default function QuantNotebooks() {
  const { user } = useAuth()
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [newNotebook, setNewNotebook] = useState({
    name: '',
    description: '',
    tags: ''
  })

  useEffect(() => {
    if (user) {
      fetchNotebooks()
    }
  }, [user])

  const fetchNotebooks = async () => {
    try {
      const { data, error } = await supabase
        .from('quant_notebooks')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setNotebooks(data || [])
    } catch (error) {
      console.error('Error fetching notebooks:', error)
      toast.error('Failed to fetch notebooks')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNotebook = async () => {
    if (!newNotebook.name.trim()) {
      toast.error('Notebook name is required')
      return
    }

    try {
      const tags = newNotebook.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      
      const { data, error } = await supabase
        .from('quant_notebooks')
        .insert({
          user_id: user!.id,
          name: newNotebook.name,
          description: newNotebook.description || null,
          tags,
          content: {
            cells: [
              {
                id: 'cell-1',
                cell_type: 'code',
                source: ['# Welcome to your new notebook!\n', '# Start writing Python code here\n', '\n', 'import pandas as pd\n', 'import numpy as np\n', '\n', '# Get your portfolio data\n', 'portfolio_data = get_portfolio_data()\n', 'print(portfolio_data.head())']
              }
            ]
          } as any
        })
        .select()
        .single()

      if (error) throw error

      setNotebooks([data, ...notebooks])
      setIsCreateDialogOpen(false)
      setNewNotebook({ name: '', description: '', tags: '' })
      toast.success('Notebook created successfully')
    } catch (error) {
      console.error('Error creating notebook:', error)
      toast.error('Failed to create notebook')
    }
  }

  const handleDeleteNotebook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notebook?')) return

    try {
      const { error } = await supabase
        .from('quant_notebooks')
        .delete()
        .eq('id', id)

      if (error) throw error

      setNotebooks(notebooks.filter(n => n.id !== id))
      toast.success('Notebook deleted successfully')
    } catch (error) {
      console.error('Error deleting notebook:', error)
      toast.error('Failed to delete notebook')
    }
  }

  const handleOpenEditor = (notebook: Notebook) => {
    setSelectedNotebook(notebook)
    setIsEditorOpen(true)
  }

  const handleRunNotebook = async (notebook: Notebook) => {
    try {
      // Extract code from notebook cells
      const cells = notebook.content?.cells || []
      const codeCells = cells.filter((cell: any) => cell.cell_type === 'code')
      const code = codeCells.map((cell: any) => cell.source.join('')).join('\n\n')

      if (!code.trim()) {
        toast.error('No executable code found in notebook')
        return
      }

      const { data, error } = await supabase.functions.invoke('quant-execute', {
        body: {
          code,
          notebook_id: notebook.id,
          parameters: {}
        }
      })

      if (error) throw error

      toast.success(`Execution started. Run ID: ${data.run_id}`)
    } catch (error) {
      console.error('Error running notebook:', error)
      toast.error('Failed to execute notebook')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading notebooks...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (isEditorOpen && selectedNotebook) {
    return (
      <NotebookEditor
        notebook={selectedNotebook}
        onClose={() => {
          setIsEditorOpen(false)
          setSelectedNotebook(null)
          fetchNotebooks() // Refresh notebooks after editing
        }}
      />
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Quantitative Notebooks</h1>
            <p className="text-muted-foreground">
              Create and run Python notebooks for quantitative analysis
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Notebook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Notebook</DialogTitle>
                <DialogDescription>
                  Create a new Python notebook for quantitative analysis.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newNotebook.name}
                    onChange={(e) => setNewNotebook({ ...newNotebook, name: e.target.value })}
                    className="col-span-3"
                    placeholder="My Analysis Notebook"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newNotebook.description}
                    onChange={(e) => setNewNotebook({ ...newNotebook, description: e.target.value })}
                    className="col-span-3"
                    placeholder="Optional description..."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tags" className="text-right">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    value={newNotebook.tags}
                    onChange={(e) => setNewNotebook({ ...newNotebook, tags: e.target.value })}
                    className="col-span-3"
                    placeholder="analysis, portfolio, risk (comma-separated)"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNotebook}>
                  Create Notebook
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {notebooks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileCode className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notebooks yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first Python notebook to start quantitative analysis
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Notebook
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notebooks.map((notebook) => (
              <Card key={notebook.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{notebook.name}</CardTitle>
                      {notebook.description && (
                        <CardDescription className="mt-1">
                          {notebook.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRunNotebook(notebook)}
                        title="Run notebook"
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEditor(notebook)}
                        title="Edit notebook"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteNotebook(notebook.id)}
                        title="Delete notebook"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {notebook.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    Updated {new Date(notebook.updated_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Version {notebook.version}
                    {notebook.is_public && (
                      <Badge variant="outline" className="ml-2">Public</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}