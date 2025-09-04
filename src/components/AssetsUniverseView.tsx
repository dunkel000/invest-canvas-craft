import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, Copy, Edit2, Trash2, Layers, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Asset {
  id: string;
  name: string;
  symbol?: string;
  asset_type: "stock" | "crypto" | "bond" | "etf" | "real_estate" | "commodity" | "other";
  quantity: number;
  purchase_price?: number;
  current_price?: number;
  total_value?: number;
  created_at: string;
  source?: string;
  portfolio_id?: string;
}

interface AssetsUniverseViewProps {
  assets: Asset[];
  onAssetUpdate: () => void;
}

export function AssetsUniverseView({ assets, onAssetUpdate }: AssetsUniverseViewProps) {
  const navigate = useNavigate();
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    asset_type: 'stock' as "stock" | "crypto" | "bond" | "etf" | "real_estate" | "commodity" | "other",
    quantity: 0,
    purchase_price: 0,
    current_price: 0,
  });

  // Separate assets by source
  const composedAssets = assets.filter(asset => 
    !asset.source || asset.source === 'manual' || asset.source === 'node_created'
  );
  
  const apiAssets = assets.filter(asset => 
    asset.source && !['manual', 'node_created'].includes(asset.source)
  );

  const openEditDialog = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      symbol: asset.symbol || '',
      asset_type: asset.asset_type,
      quantity: asset.quantity,
      purchase_price: asset.purchase_price || 0,
      current_price: asset.current_price || 0,
    });
    setEditDialogOpen(true);
  };

  const handleSaveAsset = async () => {
    if (!editingAsset) return;

    try {
      const { error } = await supabase
        .from('assets')
        .update({
          name: formData.name,
          symbol: formData.symbol,
          asset_type: formData.asset_type,
          quantity: formData.quantity,
          purchase_price: formData.purchase_price,
          current_price: formData.current_price,
          total_value: formData.quantity * formData.current_price,
        })
        .eq('id', editingAsset.id);

      if (error) throw error;

      toast.success('Asset updated successfully');
      setEditDialogOpen(false);
      setEditingAsset(null);
      onAssetUpdate();
    } catch (error) {
      console.error('Error updating asset:', error);
      toast.error('Failed to update asset');
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', assetId);

      if (error) throw error;

      toast.success('Asset deleted successfully');
      onAssetUpdate();
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('Failed to delete asset');
    }
  };

  const handleDuplicateAsset = async (asset: Asset) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      let portfolioId = asset.portfolio_id;

      // If no portfolio_id, get or create default portfolio
      if (!portfolioId) {
        const { data: portfolios } = await supabase
          .from('portfolios')
          .select('id')
          .eq('user_id', userData.user.id)
          .limit(1);

        if (portfolios && portfolios.length > 0) {
          portfolioId = portfolios[0].id;
        } else {
          const { data: newPortfolio } = await supabase
            .from('portfolios')
            .insert([{
              name: 'Default Portfolio',
              user_id: userData.user.id
            }])
            .select('id')
            .single();

          portfolioId = newPortfolio?.id;
        }
      }

      const duplicatedAsset = {
        name: `${asset.name} (Copy)`,
        symbol: asset.symbol,
        asset_type: asset.asset_type,
        quantity: asset.quantity,
        purchase_price: asset.purchase_price,
        current_price: asset.current_price,
        total_value: asset.total_value,
        portfolio_id: portfolioId,
        user_id: userData.user.id,
        source: 'manual' // Mark duplicated assets as manual
      };

      const { error } = await supabase
        .from('assets')
        .insert([duplicatedAsset]);

      if (error) throw error;

      toast.success('Asset duplicated successfully');
      onAssetUpdate();
    } catch (error) {
      console.error('Error duplicating asset:', error);
      toast.error('Failed to duplicate asset');
    }
  };

  const editInAssetComposer = (assetId: string) => {
    navigate(`/asset-composer?asset=${assetId}`);
  };

  const getAssetTypeColor = (type: string) => {
    const colors = {
      'stock': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      'crypto': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      'bond': 'bg-green-500/10 text-green-600 border-green-500/20',
      'etf': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      'real_estate': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      'commodity': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      'other': 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const renderAssetRow = (asset: Asset) => (
    <div key={asset.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="text-sm font-semibold text-primary">
            {asset.symbol ? asset.symbol.slice(0, 2) : asset.name.slice(0, 2)}
          </span>
        </div>
        <div className="space-y-1">
          <div className="font-medium text-sm">{asset.name}</div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs ${getAssetTypeColor(asset.asset_type)}`}>
              {asset.asset_type}
            </Badge>
            {asset.symbol && (
              <span className="text-xs text-muted-foreground">{asset.symbol}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right text-sm space-y-1">
          <div className="font-medium">${asset.total_value?.toLocaleString() || '0'}</div>
          <div className="text-xs text-muted-foreground">
            {asset.quantity} @ ${asset.current_price?.toLocaleString() || '0'}
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editInAssetComposer(asset.id)}
            title="Edit in composer"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDuplicateAsset(asset)}
            title="Duplicate asset"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openEditDialog(asset)}
            title="Edit asset"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteAsset(asset.id)}
            title="Delete asset"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  if (assets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Assets Universe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No assets found.</p>
            <p className="text-sm mt-2">Create assets to start building your investment universe.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Assets Universe</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your existing assets and access the Asset Composer
          </p>
        </CardHeader>
        <CardContent>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4" />
                <span className="font-medium">Composed ({composedAssets.length})</span>
              </div>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {composedAssets.length > 0 ? (
                  composedAssets.map(renderAssetRow)
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No composed assets found.</p>
                    <p className="text-sm mt-2">Create assets manually or through the Asset Composer.</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4" />
                <span className="font-medium">Imported ({apiAssets.length})</span>
              </div>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {apiAssets.length > 0 ? (
                  apiAssets.map(renderAssetRow)
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No imported assets found.</p>
                    <p className="text-sm mt-2">Import assets from APIs or external sources.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Asset Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-symbol">Symbol</Label>
              <Input
                id="edit-symbol"
                value={formData.symbol}
                onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="edit-asset-type">Asset Type</Label>
              <Select
                value={formData.asset_type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, asset_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="bond">Bond</SelectItem>
                  <SelectItem value="etf">ETF</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="commodity">Commodity</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-quantity">Quantity</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-purchase-price">Purchase Price</Label>
                <Input
                  id="edit-purchase-price"
                  type="number"
                  step="0.01"
                  value={formData.purchase_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchase_price: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-current-price">Current Price</Label>
              <Input
                id="edit-current-price"
                type="number"
                step="0.01"
                value={formData.current_price}
                onChange={(e) => setFormData(prev => ({ ...prev, current_price: parseFloat(e.target.value) || 0 }))}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setEditDialogOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveAsset} className="flex-1">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}