import React, { useCallback, useState, useEffect } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Save, Download, Upload } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useSearchParams } from "react-router-dom"

// Import custom nodes
import AssetSourceNode from './FlowNodes/AssetSourceNode'
import CashflowNode from './FlowNodes/CashflowNode'
import MathFunctionNode from './FlowNodes/MathFunctionNode'
import RiskNode from './FlowNodes/RiskNode'

// Node types configuration
const nodeTypes = {
  assetSource: AssetSourceNode,
  cashflow: CashflowNode,
  mathFunction: MathFunctionNode,
  risk: RiskNode,
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Portfolio Data Source' },
    position: { x: 100, y: 100 },
    style: { 
      backgroundColor: 'hsl(var(--card))',
      color: 'hsl(var(--foreground))',
      border: '1px solid hsl(var(--border))'
    }
  },
  {
    id: '2',
    data: { label: 'Risk Assessment' },
    position: { x: 300, y: 100 },
    style: { 
      backgroundColor: 'hsl(var(--card))',
      color: 'hsl(var(--foreground))',
      border: '1px solid hsl(var(--border))'
    }
  },
  {
    id: '3',
    data: { label: 'Asset Allocation' },
    position: { x: 500, y: 100 },
    style: { 
      backgroundColor: 'hsl(var(--card))',
      color: 'hsl(var(--foreground))',
      border: '1px solid hsl(var(--border))'
    }
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Portfolio Optimization' },
    position: { x: 700, y: 100 },
    style: { 
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      border: '1px solid hsl(var(--primary))'
    }
  },
]

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'hsl(var(--primary))' }
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'hsl(var(--primary))' }
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'hsl(var(--primary))' }
  },
]

export function FlowDesigner() {
  const [searchParams] = useSearchParams()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [assets, setAssets] = useState<any[]>([])
  const [flows, setFlows] = useState<any[]>([])
  const [selectedAssetId, setSelectedAssetId] = useState<string>('')
  const [selectedNodeType, setSelectedNodeType] = useState<string>('assetSource')
  const [addNodeDialogOpen, setAddNodeDialogOpen] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [flowName, setFlowName] = useState('')
  const [flowDescription, setFlowDescription] = useState('')

  // Load asset from URL parameter
  useEffect(() => {
    const assetId = searchParams.get('asset')
    if (assetId) {
      loadAssetIntoFlow(assetId)
    }
    fetchAssets()
    fetchFlows()
  }, [searchParams])

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAssets(data || [])
    } catch (error) {
      console.error('Failed to fetch assets:', error)
    }
  }

  const fetchFlows = async () => {
    try {
      const { data, error } = await supabase
        .from('flows')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFlows(data || [])
    } catch (error) {
      console.error('Failed to fetch flows:', error)
    }
  }

  const loadAssetIntoFlow = async (assetId: string) => {
    try {
      const { data: asset, error } = await supabase
        .from('assets')
        .select('*')
        .eq('id', assetId)
        .single()

      if (error) throw error

      const assetNode: Node = {
        id: `asset-${asset.id}`,
        type: 'assetSource',
        data: {
          label: asset.name,
          assetId: asset.id,
          assetName: asset.name,
          assetType: asset.asset_type,
          quantity: asset.quantity,
          currentPrice: asset.current_price,
          riskCategory: asset.risk_category
        },
        position: { x: 100, y: 100 }
      }

      setNodes([assetNode])
      setEdges([])
      toast.success(`Loaded asset: ${asset.name}`)
    } catch (error) {
      toast.error('Failed to load asset')
      console.error(error)
    }
  }

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  const addNodeToFlow = () => {
    let newNode: Node

    switch (selectedNodeType) {
      case 'assetSource':
        const selectedAsset = assets.find(a => a.id === selectedAssetId)
        newNode = {
          id: `asset-${Date.now()}`,
          type: 'assetSource',
          data: selectedAsset ? {
            label: selectedAsset.name,
            assetId: selectedAsset.id,
            assetName: selectedAsset.name,
            assetType: selectedAsset.asset_type,
            quantity: selectedAsset.quantity,
            currentPrice: selectedAsset.current_price,
            riskCategory: selectedAsset.risk_category
          } : { label: 'New Asset Source' },
          position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 }
        }
        break

      case 'cashflow':
        newNode = {
          id: `cashflow-${Date.now()}`,
          type: 'cashflow',
          data: {
            label: 'New Cashflow',
            cashflowType: 'income',
            amount: 1000,
            frequency: 'monthly'
          },
          position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 }
        }
        break

      case 'mathFunction':
        newNode = {
          id: `math-${Date.now()}`,
          type: 'mathFunction',
          data: {
            label: 'Math Function',
            functionType: 'add',
            formula: 'A + B'
          },
          position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 }
        }
        break

      case 'risk':
        newNode = {
          id: `risk-${Date.now()}`,
          type: 'risk',
          data: {
            label: 'Risk Assessment',
            riskCategory: 'medium',
            riskScore: 50,
            exposure: 25
          },
          position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 }
        }
        break

      default:
        newNode = {
          id: `default-${Date.now()}`,
          data: { label: 'New Node' },
          position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 }
        }
    }

    setNodes((nds) => [...nds, newNode])
    setAddNodeDialogOpen(false)
  }

  const saveFlow = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('Not authenticated')

      const flowData = JSON.parse(JSON.stringify({
        nodes: nodes,
        edges: edges,
        viewport: { x: 0, y: 0, zoom: 1 }
      }))

      const { error } = await supabase
        .from('flows')
        .insert([{
          name: flowName || 'Untitled Flow',
          description: flowDescription,
          flow_data: flowData,
          user_id: userData.user.id
        }])

      if (error) throw error

      toast.success('Flow saved successfully')
      setSaveDialogOpen(false)
      setFlowName('')
      setFlowDescription('')
      fetchFlows()
    } catch (error) {
      toast.error('Failed to save flow')
      console.error(error)
    }
  }

  const exportFlow = () => {
    const exportData = {
      flow: {
        name: flowName || 'Exported Flow',
        description: flowDescription,
        nodes: nodes,
        edges: edges
      },
      exported_at: new Date().toISOString(),
      version: "1.0"
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flow-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Flow exported successfully')
  }

  const importFlow = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const importData = JSON.parse(text)
      
      if (!importData.flow || !importData.flow.nodes || !importData.flow.edges) {
        throw new Error('Invalid flow format')
      }

      setNodes(importData.flow.nodes)
      setEdges(importData.flow.edges)
      setFlowName(importData.flow.name || 'Imported Flow')
      setFlowDescription(importData.flow.description || '')

      toast.success('Flow imported successfully')
      setImportDialogOpen(false)
    } catch (error) {
      toast.error('Failed to import flow')
      console.error(error)
    }
  }

  return (
    <Card className="bg-card border-border h-[600px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Investment Flow Designer</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Design your investment portfolio flow and asset relationships
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={addNodeDialogOpen} onOpenChange={setAddNodeDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Node
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Node</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="node-type">Node Type</Label>
                    <Select value={selectedNodeType} onValueChange={setSelectedNodeType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assetSource">Asset Source</SelectItem>
                        <SelectItem value="cashflow">Cashflow</SelectItem>
                        <SelectItem value="mathFunction">Math Function</SelectItem>
                        <SelectItem value="risk">Risk Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedNodeType === 'assetSource' && (
                    <div>
                      <Label htmlFor="asset-select">Select Asset</Label>
                      <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an asset" />
                        </SelectTrigger>
                        <SelectContent>
                          {assets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id}>
                              {asset.name} ({asset.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button onClick={addNodeToFlow} className="w-full">
                    Add Node
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Flow</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="import-file">Select JSON file</Label>
                    <Input
                      id="import-file"
                      type="file"
                      accept=".json"
                      onChange={importFlow}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Flow</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="flow-name">Flow Name</Label>
                    <Input
                      id="flow-name"
                      value={flowName}
                      onChange={(e) => setFlowName(e.target.value)}
                      placeholder="Enter flow name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="flow-description">Description</Label>
                    <Input
                      id="flow-description"
                      value={flowDescription}
                      onChange={(e) => setFlowDescription(e.target.value)}
                      placeholder="Enter description"
                    />
                  </div>
                  <Button onClick={saveFlow} className="w-full">
                    Save Flow
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={exportFlow} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[500px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          style={{ backgroundColor: 'hsl(var(--background))' }}
        >
          <Controls />
          <MiniMap 
            style={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))'
            }}
          />
          <Background 
            color="hsl(var(--border))" 
            gap={16} 
          />
        </ReactFlow>
      </CardContent>
    </Card>
  )
}