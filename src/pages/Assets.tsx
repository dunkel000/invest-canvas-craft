import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { HeroSection } from "@/components/HeroSection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Upload, Download, Edit, Trash2, ExternalLink, GitBranch } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useNavigate } from "react-router-dom"
import { useAssetUniverse } from "@/hooks/useAssetUniverse"
import { AssetsUniverseView } from "@/components/AssetsUniverseView"

type AssetType = "stock" | "crypto" | "bond" | "etf" | "real_estate" | "commodity" | "other"
type RiskCategory = "low" | "medium" | "high" | "very_high"

interface Asset {
  id: string
  name: string
  symbol?: string
  asset_type: AssetType
  quantity: number
  purchase_price?: number
  current_price?: number
  total_value?: number
  risk_category: RiskCategory
  metadata: any
  api_connection_id?: string
  created_at: string
}

interface ApiConnection {
  id: string
  name: string
  provider: string
  is_active: boolean
}

const Assets = () => {
  const { assets: universeAssets, loading: universeLoading, populateYahooAssets, getSourceDisplayName } = useAssetUniverse()
  const [assets, setAssets] = useState<Asset[]>([])
  const [apiConnections, setApiConnections] = useState<ApiConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [sourceFilter, setSourceFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const [newAsset, setNewAsset] = useState({
    name: "",
    symbol: "",
    asset_type: "stock" as AssetType,
    quantity: 0,
    purchase_price: 0,
    current_price: 0,
    risk_category: "medium" as RiskCategory,
    metadata: {}
  })

  useEffect(() => {
    fetchAssets()
    fetchApiConnections()
  }, [])

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAssets(data || [])
    } catch (error) {
      toast.error('Failed to fetch assets')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchApiConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('api_connections')
        .select('id, name, provider, is_active')
        .eq('is_active', true)

      if (error) throw error
      setApiConnections(data || [])
    } catch (error) {
      console.error('Failed to fetch API connections:', error)
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
        total_value: newAsset.quantity * newAsset.current_price
      }

      const { error } = await supabase
        .from('assets')
        .insert([assetData])

      if (error) throw error

      toast.success('Asset created successfully')
      setCreateDialogOpen(false)
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

  const deleteAsset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Asset deleted successfully')
      fetchAssets()
    } catch (error) {
      toast.error('Failed to delete asset')
      console.error(error)
    }
  }

  const exportAssets = () => {
    const exportData = {
      assets,
      exported_at: new Date().toISOString(),
      version: "1.0"
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `assets-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Assets exported successfully')
  }

  const importAssets = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const importData = JSON.parse(text)
      
      if (!importData.assets || !Array.isArray(importData.assets)) {
        throw new Error('Invalid import format')
      }

      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('Not authenticated')

      const assetsToImport = importData.assets.map((asset: any) => ({
        ...asset,
        id: undefined, // Let database generate new IDs
        user_id: userData.user.id,
        created_at: undefined,
        updated_at: undefined
      }))

      const { error } = await supabase
        .from('assets')
        .insert(assetsToImport)

      if (error) throw error

      toast.success(`Imported ${assetsToImport.length} assets successfully`)
      setImportDialogOpen(false)
      fetchAssets()
    } catch (error) {
      toast.error('Failed to import assets')
      console.error(error)
    }
  }

  const createAssetWithComposer = async () => {
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
        total_value: newAsset.quantity * newAsset.current_price
      }

      const { data: createdAsset, error } = await supabase
        .from('assets')
        .insert([assetData])
        .select()
        .single()

      if (error) throw error

      toast.success('Asset created successfully')
      setCreateDialogOpen(false)
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
      
      // Navigate to Asset Composer with the new asset
      navigate(`/asset-composer?asset=${createdAsset.id}`)
    } catch (error) {
      toast.error('Failed to create asset')
      console.error(error)
    }
  }

  const editInAssetComposer = (assetId: string) => {
    navigate(`/asset-composer?asset=${assetId}`)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      case 'high': return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
      case 'very_high': return 'bg-red-500/10 text-red-600 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading assets...</div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <HeroSection 
          title="Your Assets Universe"
          subtitle="Discover, track, and manage your investment portfolio across all asset classes"
        />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Assets Management</h2>
              <p className="text-muted-foreground">Create, import, and manage your investment assets</p>
            </div>
            
            <div className="flex gap-2">
              <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Assets</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="import-file">Select JSON file</Label>
                      <Input
                        id="import-file"
                        type="file"
                        accept=".json"
                        onChange={importAssets}
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button onClick={exportAssets} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Asset
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Asset</DialogTitle>
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
                      <Select value={newAsset.asset_type} onValueChange={(value: AssetType) => setNewAsset({ ...newAsset, asset_type: value })}>
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

                    <div className="grid grid-cols-2 gap-2">
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

                      <div>
                        <Label htmlFor="risk-category">Risk Category</Label>
                        <Select value={newAsset.risk_category} onValueChange={(value: RiskCategory) => setNewAsset({ ...newAsset, risk_category: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low Risk</SelectItem>
                            <SelectItem value="medium">Medium Risk</SelectItem>
                            <SelectItem value="high">High Risk</SelectItem>
                            <SelectItem value="very_high">Very High Risk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={createAsset} variant="outline" className="flex-1">
                        Create Asset
                      </Button>
                      <Button onClick={() => createAssetWithComposer()} className="flex-1">
                        Create & Compose
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Yahoo Finance Integration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Asset Universe
                    <Badge variant="outline">Yahoo Finance Enabled</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Your personal database of all available assets from various sources
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={async () => {
                    toast.promise(populateYahooAssets(), {
                      loading: "Fetching Yahoo Finance data...",
                      success: "Yahoo Finance assets populated!",
                      error: "Failed to populate assets"
                    });
                  }}
                >
                  Populate Yahoo Assets
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Controls */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search assets by symbol or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="yahoo_finance">Yahoo Finance</SelectItem>
                    <SelectItem value="manual">Custom</SelectItem>
                    <SelectItem value="node_created">Node Created</SelectItem>
                    <SelectItem value="api">API Import</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Legal Disclaimer for Yahoo Finance */}
              <div className="mb-4 p-3 bg-accent/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Data Attribution:</strong> Financial data provided by Yahoo Finance. 
                  Data may be delayed and should not be relied upon for real-time trading decisions. 
                  Please verify all data independently before making investment decisions.
                </p>
              </div>

              {/* Asset Universe Grid */}
              <div className="grid gap-2 max-h-96 overflow-y-auto">
                {universeLoading ? (
                  <div className="text-center py-8">Loading asset universe...</div>
                ) : (
                  universeAssets
                    .filter(asset => {
                      const matchesSearch = !searchTerm || 
                        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        asset.name.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesSource = sourceFilter === 'all' || asset.source === sourceFilter;
                      return matchesSearch && matchesSource;
                    })
                    .slice(0, 100) // Limit to first 100 for performance
                    .map((asset) => (
                      <div 
                        key={asset.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{asset.symbol}</span>
                            <span className="text-sm text-muted-foreground truncate">{asset.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {getSourceDisplayName(asset.source)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{asset.asset_type}</span>
                            {asset.sector && <span>{asset.sector}</span>}
                            {asset.exchange && <span>{asset.exchange}</span>}
                            {asset.current_price && (
                              <span>${asset.current_price.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {getSourceDisplayName(asset.source)}
                          </Badge>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Import the new AssetsUniverseView component */}
          <AssetsUniverseView assets={assets} onAssetUpdate={fetchAssets} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default Assets