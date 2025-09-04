import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ArrowLeft, Play, Plus, Trash2, Save } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import Editor from '@monaco-editor/react'

interface Cell {
  id: string
  cell_type: 'code' | 'markdown'
  source: string[]
  outputs?: any[]
}

interface NotebookContent {
  cells: Cell[]
}

interface Notebook {
  id: string
  name: string
  description?: string
  content: NotebookContent
  version: number
  is_public: boolean
  tags: string[]
  created_at: string
  updated_at: string
}

interface NotebookEditorProps {
  notebook: Notebook
  onClose: () => void
}

interface ExecutionResult {
  run_id: string
  status: string
  stdout?: string
  stderr?: string
}

export function NotebookEditor({ notebook, onClose }: NotebookEditorProps) {
  const { user } = useAuth()
  const [cells, setCells] = useState<Cell[]>(notebook.content?.cells || [])
  const [currentRunId, setCurrentRunId] = useState<string | null>(null)
  const [executionResults, setExecutionResults] = useState<Record<string, any>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const editorRefs = useRef<Record<string, any>>({})

  useEffect(() => {
    // Poll for execution results if there's a current run
    if (currentRunId) {
      const pollInterval = setInterval(async () => {
        try {
          const { data, error } = await supabase
            .from('quant_runs')
            .select('*')
            .eq('id', currentRunId)
            .single()

          if (error) throw error

          if (data && data.status !== 'running' && data.status !== 'pending') {
            setExecutionResults(prev => ({ ...prev, [currentRunId]: data }))
            setCurrentRunId(null)
            setIsExecuting(false)
            clearInterval(pollInterval)
            
            if (data.status === 'completed') {
              toast.success('Code execution completed')
            } else if (data.status === 'failed') {
              toast.error('Code execution failed')
            }
          }
        } catch (error) {
          console.error('Error polling execution status:', error)
          clearInterval(pollInterval)
          setIsExecuting(false)
        }
      }, 2000)

      return () => clearInterval(pollInterval)
    }
  }, [currentRunId])

  const handleAddCell = (index: number) => {
    const newCell: Cell = {
      id: `cell-${Date.now()}`,
      cell_type: 'code',
      source: ['']
    }
    const newCells = [...cells]
    newCells.splice(index + 1, 0, newCell)
    setCells(newCells)
  }

  const handleDeleteCell = (index: number) => {
    if (cells.length === 1) {
      toast.error('Cannot delete the last cell')
      return
    }
    setCells(cells.filter((_, i) => i !== index))
  }

  const handleCellSourceChange = (index: number, value: string) => {
    const newCells = [...cells]
    newCells[index].source = [value]
    setCells(newCells)
  }

  const handleExecuteCell = async (index: number) => {
    const cell = cells[index]
    if (cell.cell_type !== 'code' || !cell.source[0]?.trim()) {
      toast.error('No code to execute')
      return
    }

    setIsExecuting(true)
    
    try {
      const { data, error } = await supabase.functions.invoke('quant-execute', {
        body: {
          code: cell.source[0],
          notebook_id: notebook.id,
          parameters: {}
        }
      })

      if (error) throw error

      setCurrentRunId(data.run_id)
      toast.success('Code execution started...')
    } catch (error) {
      console.error('Error executing cell:', error)
      toast.error('Failed to execute code')
      setIsExecuting(false)
    }
  }

  const handleExecuteAll = async () => {
    const codeCells = cells.filter(cell => cell.cell_type === 'code' && cell.source[0]?.trim())
    if (codeCells.length === 0) {
      toast.error('No code cells to execute')
      return
    }

    setIsExecuting(true)

    try {
      const allCode = codeCells.map(cell => cell.source[0]).join('\n\n')
      
      const { data, error } = await supabase.functions.invoke('quant-execute', {
        body: {
          code: allCode,
          notebook_id: notebook.id,
          parameters: {}
        }
      })

      if (error) throw error

      setCurrentRunId(data.run_id)
      toast.success('Notebook execution started...')
    } catch (error) {
      console.error('Error executing notebook:', error)
      toast.error('Failed to execute notebook')
      setIsExecuting(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      const { error } = await supabase
        .from('quant_notebooks')
        .update({
          content: { cells } as any,
          version: notebook.version + 1
        })
        .eq('id', notebook.id)

      if (error) throw error
      
      toast.success('Notebook saved successfully')
    } catch (error) {
      console.error('Error saving notebook:', error)
      toast.error('Failed to save notebook')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notebooks
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-lg font-semibold">{notebook.name}</h1>
            <p className="text-sm text-muted-foreground">
              {notebook.description || 'No description'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button 
            size="sm" 
            onClick={handleExecuteAll}
            disabled={isExecuting}
          >
            <Play className="h-4 w-4 mr-2" />
            {isExecuting ? 'Running...' : 'Run All'}
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Notebook Editor */}
        <ResizablePanel defaultSize={60}>
          <div className="h-full overflow-auto p-4 space-y-4">
            {cells.map((cell, index) => (
              <Card key={cell.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-muted-foreground">
                      Cell {index + 1} ({cell.cell_type})
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleExecuteCell(index)}
                        disabled={isExecuting || cell.cell_type !== 'code'}
                        title="Run cell"
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddCell(index)}
                        title="Add cell below"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCell(index)}
                        disabled={cells.length === 1}
                        title="Delete cell"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    <Editor
                      height="200px"
                      defaultLanguage="python"
                      value={cell.source[0] || ''}
                      onChange={(value) => handleCellSourceChange(index, value || '')}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        lineNumbers: 'on',
                        wordWrap: 'on'
                      }}
                      onMount={(editor) => {
                        editorRefs.current[cell.id] = editor
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {cells.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No cells in this notebook</p>
                  <Button onClick={() => handleAddCell(-1)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Cell
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Output Panel */}
        <ResizablePanel defaultSize={40}>
          <div className="h-full border-l bg-muted/20">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Output</h3>
            </div>
            
            <div className="p-4 h-full overflow-auto">
              {currentRunId && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    Executing... Run ID: {currentRunId}
                  </p>
                </div>
              )}
              
              {Object.entries(executionResults).map(([runId, result]) => (
                <div key={runId} className="mb-4">
                  <div className="text-xs text-muted-foreground mb-2">
                    Run {runId.slice(0, 8)}... - {result.status}
                  </div>
                  
                  {result.stdout && (
                    <div className="mb-2">
                      <h4 className="text-sm font-semibold mb-1">Output:</h4>
                      <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
                        {result.stdout}
                      </pre>
                    </div>
                  )}
                  
                  {result.stderr && (
                    <div className="mb-2">
                      <h4 className="text-sm font-semibold mb-1 text-red-600">Error:</h4>
                      <pre className="text-xs bg-red-50 p-2 rounded border overflow-x-auto text-red-800">
                        {result.stderr}
                      </pre>
                    </div>
                  )}
                  
                  <Separator className="my-4" />
                </div>
              ))}
              
              {Object.keys(executionResults).length === 0 && !currentRunId && (
                <div className="text-center text-muted-foreground py-8">
                  <p>No outputs yet</p>
                  <p className="text-xs mt-1">Run some code to see results here</p>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}