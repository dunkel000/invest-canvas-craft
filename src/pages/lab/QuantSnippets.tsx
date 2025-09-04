import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Code, Copy, Edit, Trash2, Heart, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import Editor from '@monaco-editor/react'

interface Snippet {
  id: string
  name: string
  description?: string
  code: string
  parameters?: any
  tags: string[]
  is_public: boolean
  usage_count: number
  created_at: string
  updated_at: string
  user_id: string
}

export default function QuantSnippets() {
  const { user } = useAuth()
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [publicSnippets, setPublicSnippets] = useState<Snippet[]>([])
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('my-snippets')

  const [newSnippet, setNewSnippet] = useState({
    name: '',
    description: '',
    code: '# Python code snippet\nimport pandas as pd\nimport numpy as np\n\ndef analyze_portfolio(data):\n    # Your analysis here\n    return data.describe()',
    tags: '',
    is_public: false
  })

  useEffect(() => {
    if (user) {
      fetchSnippets()
      fetchPublicSnippets()
    }
  }, [user])

  const fetchSnippets = async () => {
    try {
      const { data, error } = await supabase
        .from('quant_snippets')
        .select('*')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setSnippets(data || [])
    } catch (error) {
      console.error('Error fetching snippets:', error)
      toast.error('Failed to fetch snippets')
    }
  }

  const fetchPublicSnippets = async () => {
    try {
      const { data, error } = await supabase
        .from('quant_snippets')
        .select('*')
        .eq('is_public', true)
        .order('usage_count', { ascending: false })
        .limit(50)

      if (error) throw error
      setPublicSnippets(data || [])
    } catch (error) {
      console.error('Error fetching public snippets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSnippet = async () => {
    if (!newSnippet.name.trim() || !newSnippet.code.trim()) {
      toast.error('Snippet name and code are required')
      return
    }

    try {
      const tags = newSnippet.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      
      const { data, error } = await supabase
        .from('quant_snippets')
        .insert({
          user_id: user!.id,
          name: newSnippet.name,
          description: newSnippet.description || null,
          code: newSnippet.code,
          tags,
          is_public: newSnippet.is_public
        })
        .select()
        .single()

      if (error) throw error

      setSnippets([data, ...snippets])
      setIsCreateDialogOpen(false)
      setNewSnippet({
        name: '',
        description: '',
        code: '# Python code snippet\nimport pandas as pd\nimport numpy as np\n\ndef analyze_portfolio(data):\n    # Your analysis here\n    return data.describe()',
        tags: '',
        is_public: false
      })
      toast.success('Snippet created successfully')
    } catch (error) {
      console.error('Error creating snippet:', error)
      toast.error('Failed to create snippet')
    }
  }

  const handleUpdateSnippet = async () => {
    if (!selectedSnippet || !newSnippet.name.trim() || !newSnippet.code.trim()) {
      toast.error('Snippet name and code are required')
      return
    }

    try {
      const tags = newSnippet.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      
      const { error } = await supabase
        .from('quant_snippets')
        .update({
          name: newSnippet.name,
          description: newSnippet.description || null,
          code: newSnippet.code,
          tags,
          is_public: newSnippet.is_public
        })
        .eq('id', selectedSnippet.id)

      if (error) throw error

      await fetchSnippets()
      await fetchPublicSnippets()
      setIsEditDialogOpen(false)
      setSelectedSnippet(null)
      toast.success('Snippet updated successfully')
    } catch (error) {
      console.error('Error updating snippet:', error)
      toast.error('Failed to update snippet')
    }
  }

  const handleCopySnippet = async (snippet: Snippet) => {
    try {
      await navigator.clipboard.writeText(snippet.code)
      
      // Increment usage count
      await supabase
        .from('quant_snippets')
        .update({ usage_count: snippet.usage_count + 1 })
        .eq('id', snippet.id)
      
      toast.success('Code copied to clipboard')
      
      // Refresh data to show updated usage count
      if (snippet.user_id === user!.id) {
        fetchSnippets()
      } else {
        fetchPublicSnippets()
      }
    } catch (error) {
      console.error('Error copying snippet:', error)
      toast.error('Failed to copy code')
    }
  }

  const handleDeleteSnippet = async (id: string) => {
    if (!confirm('Are you sure you want to delete this snippet?')) return

    try {
      const { error } = await supabase
        .from('quant_snippets')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSnippets(snippets.filter(s => s.id !== id))
      toast.success('Snippet deleted successfully')
    } catch (error) {
      console.error('Error deleting snippet:', error)
      toast.error('Failed to delete snippet')
    }
  }

  const handleEditSnippet = (snippet: Snippet) => {
    setSelectedSnippet(snippet)
    setNewSnippet({
      name: snippet.name,
      description: snippet.description || '',
      code: snippet.code,
      tags: snippet.tags.join(', '),
      is_public: snippet.is_public
    })
    setIsEditDialogOpen(true)
  }

  const filteredSnippets = snippets.filter(snippet =>
    snippet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredPublicSnippets = publicSnippets.filter(snippet =>
    snippet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading snippets...</div>
        </div>
      </DashboardLayout>
    )
  }

  const SnippetCard = ({ snippet, showEdit = false }: { snippet: Snippet; showEdit?: boolean }) => (
    <Card key={snippet.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {snippet.name}
              {snippet.is_public && <Badge variant="outline">Public</Badge>}
            </CardTitle>
            {snippet.description && (
              <CardDescription className="mt-1">
                {snippet.description}
              </CardDescription>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopySnippet(snippet)}
              title="Copy code"
            >
              <Copy className="h-3 w-3" />
            </Button>
            {showEdit && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditSnippet(snippet)}
                  title="Edit snippet"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteSnippet(snippet.id)}
                  title="Delete snippet"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {snippet.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="bg-muted rounded-md p-3">
            <pre className="text-xs overflow-x-auto">
              <code>{snippet.code.slice(0, 200)}{snippet.code.length > 200 ? '...' : ''}</code>
            </pre>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {snippet.usage_count} uses
              </span>
              <span>
                Updated {new Date(snippet.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Code Snippets</h1>
            <p className="text-muted-foreground">
              Reusable code fragments for quantitative analysis
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Snippet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Snippet</DialogTitle>
                <DialogDescription>
                  Create a reusable code snippet for your analysis workflows.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newSnippet.name}
                    onChange={(e) => setNewSnippet({ ...newSnippet, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Portfolio Analysis"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newSnippet.description}
                    onChange={(e) => setNewSnippet({ ...newSnippet, description: e.target.value })}
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
                    value={newSnippet.tags}
                    onChange={(e) => setNewSnippet({ ...newSnippet, tags: e.target.value })}
                    className="col-span-3"
                    placeholder="portfolio, risk, analysis (comma-separated)"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="public" className="text-right">
                    Make Public
                  </Label>
                  <div className="col-span-3">
                    <Switch
                      id="public"
                      checked={newSnippet.is_public}
                      onCheckedChange={(checked) => setNewSnippet({ ...newSnippet, is_public: checked })}
                    />
                  </div>
                </div>
                <div className="col-span-4">
                  <Label>Code</Label>
                  <div className="mt-2 border rounded-md">
                    <Editor
                      height="300px"
                      defaultLanguage="python"
                      value={newSnippet.code}
                      onChange={(value) => setNewSnippet({ ...newSnippet, code: value || '' })}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSnippet}>
                  Create Snippet
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search snippets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="my-snippets">My Snippets ({snippets.length})</TabsTrigger>
            <TabsTrigger value="public-snippets">Public Library ({publicSnippets.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-snippets" className="space-y-4">
            {filteredSnippets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Code className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No snippets yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Create your first code snippet to build your analysis library
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Snippet
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredSnippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} showEdit={true} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="public-snippets" className="space-y-4">
            {filteredPublicSnippets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Code className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No public snippets found</h3>
                  <p className="text-muted-foreground text-center">
                    Try adjusting your search terms
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredPublicSnippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} showEdit={false} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Snippet</DialogTitle>
              <DialogDescription>
                Update your code snippet.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={newSnippet.name}
                  onChange={(e) => setNewSnippet({ ...newSnippet, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={newSnippet.description}
                  onChange={(e) => setNewSnippet({ ...newSnippet, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="edit-tags"
                  value={newSnippet.tags}
                  onChange={(e) => setNewSnippet({ ...newSnippet, tags: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-public" className="text-right">
                  Make Public
                </Label>
                <div className="col-span-3">
                  <Switch
                    id="edit-public"
                    checked={newSnippet.is_public}
                    onCheckedChange={(checked) => setNewSnippet({ ...newSnippet, is_public: checked })}
                  />
                </div>
              </div>
              <div className="col-span-4">
                <Label>Code</Label>
                <div className="mt-2 border rounded-md">
                  <Editor
                    height="300px"
                    defaultLanguage="python"
                    value={newSnippet.code}
                    onChange={(value) => setNewSnippet({ ...newSnippet, code: value || '' })}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateSnippet}>
                Update Snippet
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}