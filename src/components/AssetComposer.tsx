import React, { useCallback, useState, useEffect } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
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
import { ExistingAssetsList } from "./ExistingAssetsList"

// Import custom nodes
import EditableInitialAssetNode from './FlowNodes/EditableInitialAssetNode'
import EditableCashflowsNode from './FlowNodes/EditableCashflowsNode'
import EditableMathFormulasNode from './FlowNodes/EditableMathFormulasNode'
import EditableRiskAssessmentNode from './FlowNodes/EditableRiskAssessmentNode'

// Node types configuration
const nodeTypes = {
  initialAsset: EditableInitialAssetNode,
  cashflows: EditableCashflowsNode,
  mathFormulas: EditableMathFormulasNode,
  riskAssessment: EditableRiskAssessmentNode,
}

const initialNodes: Node[] = [
  {
    id: 'demo-asset',
    type: 'initialAsset',
    data: { 
      assetName: 'Apple Inc. (AAPL)',
      assetType: 'Stock',
      costBasis: 15000,
      quantity: 100,
      currentMarketValue: 18500,
      purchaseDate: '2024-01-15'
    },
    position: { x: 100, y: 100 }
  },
  {
    id: 'demo-cashflows',
    type: 'cashflows',
    data: { 
      label: 'AAPL Dividends',
      cashflows: [
        { date: '2024-02-15', amount: 25, type: 'Dividend' },
        { date: '2024-05-15', amount: 25, type: 'Dividend' },
        { date: '2024-08-15', amount: 25, type: 'Dividend' }
      ]
    },
    position: { x: 400, y: 100 }
  },
  {
    id: 'demo-formulas',
    type: 'mathFormulas',
    data: { 
      label: 'Performance Analytics',
      formulas: [
        { name: 'ROI', expression: '(18500 - 15000) / 15000 = 23.33%' },
        { name: 'Dividend Yield', expression: '75 / 15000 = 0.5%' }
      ]
    },
    position: { x: 700, y: 100 }
  },
  {
    id: 'demo-risk',
    type: 'riskAssessment',
    data: { 
      label: 'AAPL Risk Profile',
      riskClassifications: ['Market Risk', 'Liquidity Risk']
    },
    position: { x: 400, y: 300 }
  },
]

const initialEdges: Edge[] = [
  {
    id: 'e-asset-cashflows',
    source: 'demo-asset',
    target: 'demo-cashflows',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'hsl(var(--primary))' }
  },
  {
    id: 'e-cashflows-formulas',
    source: 'demo-cashflows',
    target: 'demo-formulas',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'hsl(var(--primary))' }
  },
  {
    id: 'e-asset-risk',
    source: 'demo-asset',
    target: 'demo-risk',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'hsl(var(--primary))' }
  },
]

export function AssetComposer() {
  const [searchParams] = useSearchParams()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [assets, setAssets] = useState<any[]>([])
  const [flows, setFlows] = useState<any[]>([])
  const [selectedAssetId, setSelectedAssetId] = useState<string>('')
  const [selectedNodeType, setSelectedNodeType] = useState<string>('initialAsset')
  const [addNodeDialogOpen, setAddNodeDialogOpen] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [createAssetDialogOpen, setCreateAssetDialogOpen] = useState(false)
  const [flowName, setFlowName] = useState('')
  const [flowDescription, setFlowDescription] = useState('')

  const [newAsset, setNewAsset] = useState({
    name: "",
    symbol: "",
    asset_type: "stock" as "stock" | "crypto" | "bond" | "etf" | "real_estate" | "commodity" | "other",
    quantity: 0,
    purchase_price: 0,
    current_price: 0,
    risk_category: "medium" as "low" | "medium" | "high" | "very_high",
    metadata: {}
  })

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
        type: 'initialAsset',
        data: {
          assetId: asset.id,
          assetName: asset.name,
          assetType: asset.asset_type,
          costBasis: asset.purchase_price || 0,
          quantity: asset.quantity,
          currentMarketValue: asset.current_price ? asset.current_price * asset.quantity : 0,
          purchaseDate: asset.created_at ? new Date(asset.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
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
      case 'initialAsset':
        const selectedAsset = assets.find(a => a.id === selectedAssetId)
        newNode = {
          id: `asset-${Date.now()}`,
          type: 'initialAsset',
          data: selectedAsset ? {
            assetId: selectedAsset.id,
            assetName: selectedAsset.name,
            assetType: selectedAsset.asset_type,
            costBasis: selectedAsset.purchase_price || 0,
            quantity: selectedAsset.quantity,
            currentMarketValue: selectedAsset.current_price ? selectedAsset.current_price * selectedAsset.quantity : 0,
            purchaseDate: new Date().toISOString().split('T')[0]
          } : { 
            assetName: 'New Asset',
            assetType: 'stock',
            costBasis: 0,
            quantity: 0,
            currentMarketValue: 0
          },
          position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 }
        }
        break

      case 'cashflows':
        newNode = {
          id: `cashflows-${Date.now()}`,
          type: 'cashflows',
          data: {
            label: 'Asset Cashflows',
            cashflows: [
              { date: new Date().toISOString().split('T')[0], amount: 100, type: 'Dividend' }
            ]
          },
          position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 }
        }
        break

      case 'mathFormulas':
        newNode = {
          id: `formulas-${Date.now()}`,
          type: 'mathFormulas',
          data: {
            label: 'Financial Analytics',
            formulas: [
              { name: 'ROI', expression: '(currentMarketValue - costBasis) / costBasis' }
            ]
          },
          position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 }
        }
        break

      case 'riskAssessment':
        newNode = {
          id: `risk-${Date.now()}`,
          type: 'riskAssessment',
          data: {
            label: 'Risk Analysis',
            riskClassifications: ['Market Risk']
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
    const assetName = nodes.find(n => n.type === 'initialAsset')?.data?.assetName || 'asset'
    const exportData = {
      assetComposition: {
        name: flowName || `${assetName} Composition`,
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
    a.download = `${String(assetName).toLowerCase().replace(/\s+/g, '-')}-asset.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Asset composition exported successfully')
  }

  const importFlow = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const importData = JSON.parse(text)
      
      // Support both old flow format and new asset composition format
      const compositionData = importData.assetComposition || importData.flow
      if (!compositionData || !compositionData.nodes || !compositionData.edges) {
        throw new Error('Invalid asset composition format')
      }

      setNodes(compositionData.nodes)
      setEdges(compositionData.edges)
      setFlowName(compositionData.name || 'Imported Asset Composition')
      setFlowDescription(compositionData.description || '')

      toast.success('Asset composition imported successfully')
      setImportDialogOpen(false)
    } catch (error) {
      toast.error('Failed to import flow')
      console.error(error)
    }
  }

  const createAsset = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('Not authenticated')

      // First, get or create a default portfolio
      let { data: portfolios } = await supabase
        .from('portfolios')
        .select('id')
        .eq('user_id', userData.user.id)
        .limit(1)

      let portfolioId = portfolios?.[0]?.id

      if (!portfolioId) {
        // Create a default portfolio if none exists
        const { data: newPortfolio, error: portfolioError } = await supabase
          .from('portfolios')
          .insert([{
            name: 'Default Portfolio',
            description: 'Automatically created portfolio',
            user_id: userData.user.id
          }])
          .select('id')
          .single()

        if (portfolioError) throw portfolioError
        portfolioId = newPortfolio.id
      }

      const assetData = {
        ...newAsset,
        user_id: userData.user.id,
        portfolio_id: portfolioId,
        total_value: newAsset.quantity * newAsset.current_price,
        source: 'manual' // Mark as composed asset
      }

      const { error } = await supabase
        .from('assets')
        .insert([assetData])

      if (error) throw error

      toast.success('Composed asset created successfully')
      setCreateAssetDialogOpen(false)
      setNewAsset({
        name: "",
        symbol: "",
        asset_type: "stock",
        quantity: 0,
        purchase_price: 0,
        current_price: 0,
        risk_category: "medium",
        metadata: {}
      })
      fetchAssets()
    } catch (error) {
      toast.error('Failed to create asset')
      console.error(error)
    }
  }

  const composedAssets = assets.filter(a => !a.source || a.source === 'manual' || a.source === 'node_created')

  return (
    <div className="space-y-6">
      <ExistingAssetsList 
        assets={assets} 
        onAssetUpdate={fetchAssets}
        onLoadAsset={loadAssetIntoFlow}
        onCreateAsset={() => setCreateAssetDialogOpen(true)}
      />
      
      <Card className="bg-card border-border h-[600px]">
        <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Asset Composer</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Design and analyze your asset compositions with cashflows, formulas, and risk assessments
            </p>
          </div>
          <div className="flex gap-2">
            {/* Assets List for quick access */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Asset List
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Select Asset to Compose</DialogTitle>
                </DialogHeader>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {composedAssets.length > 0 ? composedAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => {
                        loadAssetIntoFlow(asset.id)
                        // Close the dialog after selection
                        const dialog = document.querySelector('[role="dialog"]') as HTMLElement
                        if (dialog) {
                          const closeButton = dialog.querySelector('[aria-label="Close"]') as HTMLElement
                          closeButton?.click()
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {asset.symbol ? asset.symbol.slice(0, 2) : asset.name.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{asset.name}</div>
                          <div className="text-xs text-muted-foreground">{asset.asset_type}</div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">${asset.total_value?.toLocaleString() || '0'}</div>
                        <div className="text-xs text-muted-foreground">{asset.quantity} shares</div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No composed assets found.</p>
                      <p className="text-sm mt-2">Create an asset first or use the sample composition below.</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
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
                          <SelectItem value="initialAsset">Initial Asset</SelectItem>
                          <SelectItem value="cashflows">Cashflows</SelectItem>
                          <SelectItem value="mathFormulas">Math Formulas</SelectItem>
                          <SelectItem value="riskAssessment">Risk Assessment</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>

                  {selectedNodeType === 'initialAsset' && (
                    <div>
                      <Label htmlFor="asset-select">Select Asset</Label>
                      <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an asset" />
                        </SelectTrigger>
                        <SelectContent>
                          {composedAssets.map((asset) => (
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
                  <DialogTitle>Import Asset Composition</DialogTitle>
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
                  <DialogTitle>Save Asset Composition</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="flow-name">Composition Name</Label>
                    <Input
                      id="flow-name"
                      value={flowName}
                      onChange={(e) => setFlowName(e.target.value)}
                      placeholder="Enter composition name"
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
                    Save Composition
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
          <Controls className="[&>button]:bg-background [&>button]:border-border [&>button]:text-foreground [&>button]:hover:bg-muted" />
          <MiniMap 
            style={{ 
              backgroundColor: 'hsl(var(--muted))',
              border: '1px solid hsl(var(--border))',
              width: '80px',
              height: '60px'
            }}
            nodeColor="hsl(var(--primary))"
            nodeStrokeColor="hsl(var(--border))"
            maskColor="hsl(var(--background) / 0.8)"
          />
          <Background 
            color="hsl(var(--border))" 
            gap={20}
            size={2}
            variant={BackgroundVariant.Dots}
          />
        </ReactFlow>
        </CardContent>
      </Card>

      {/* Create Asset Dialog */}
      <Dialog open={createAssetDialogOpen} onOpenChange={setCreateAssetDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Composed Asset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newAsset.name}
                onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                placeholder="Asset name"
              />
            </div>

            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                value={newAsset.symbol}
                onChange={(e) => setNewAsset({ ...newAsset, symbol: e.target.value })}
                placeholder="AAPL, BTC, etc."
              />
            </div>

            <div>
              <Label htmlFor="asset-type">Asset Type</Label>
              <Select value={newAsset.asset_type} onValueChange={(value: any) => setNewAsset({ ...newAsset, asset_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="bond">Bond</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="etf">ETF</SelectItem>
                  <SelectItem value="commodity">Commodity</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newAsset.quantity}
                  onChange={(e) => setNewAsset({ ...newAsset, quantity: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div>
                <Label htmlFor="purchase-price">Purchase Price</Label>
                <Input
                  id="purchase-price"
                  type="number"
                  step="0.01"
                  value={newAsset.purchase_price}
                  onChange={(e) => setNewAsset({ ...newAsset, purchase_price: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="current-price">Current Price</Label>
              <Input
                id="current-price"
                type="number"
                step="0.01"
                value={newAsset.current_price}
                onChange={(e) => setNewAsset({ ...newAsset, current_price: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <Button onClick={createAsset} className="w-full">
              Create Composed Asset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}