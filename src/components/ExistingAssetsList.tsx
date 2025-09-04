import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit2, Trash2, Eye, Copy, Layers, Database } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

interface ExistingAssetsListProps {
  assets: Asset[];
  onAssetUpdate: () => void;
  onLoadAsset: (assetId: string) => void;
}

export function ExistingAssetsList({ assets, onAssetUpdate, onLoadAsset }: ExistingAssetsListProps) {
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
          total_value: formData.current_price * formData.quantity,
        })
        .eq('id', editingAsset.id);

      if (error) throw error;

      toast.success('Asset updated successfully');
      setEditDialogOpen(false);
      setEditingAsset(null);
      onAssetUpdate();
    } catch (error) {
      toast.error('Failed to update asset');
      console.error(error);
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
      toast.error('Failed to delete asset');
      console.error(error);
    }
  };

  const handleDuplicateAsset = async (asset: Asset) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error('User not authenticated');
        return;
      }

      // Create a default portfolio if asset doesn't have one
      let portfolioId = asset.portfolio_id;
      if (!portfolioId) {
        // Try to get user's first portfolio or create one
        const { data: portfolios } = await supabase
          .from('portfolios')
          .select('id')
          .eq('user_id', userData.user.id)
          .limit(1);

        if (portfolios && portfolios.length > 0) {
          portfolioId = portfolios[0].id;
        } else {
          // Create a default portfolio
          const { data: newPortfolio, error: portfolioError } = await supabase
            .from('portfolios')
            .insert({
              user_id: userData.user.id,
              name: 'Default Portfolio',
              description: 'Auto-created for asset composition'
            })
            .select('id')
            .single();

          if (portfolioError) throw portfolioError;
          portfolioId = newPortfolio.id;
        }
      }

      const { error } = await supabase
        .from('assets')
        .insert({
          user_id: userData.user.id,
          portfolio_id: portfolioId,
          name: `${asset.name} (Copy)`,
          symbol: asset.symbol,
          asset_type: asset.asset_type,
          quantity: asset.quantity,
          purchase_price: asset.purchase_price,
          current_price: asset.current_price,
          total_value: asset.total_value,
          source: 'manual'
        });

      if (error) throw error;

      toast.success('Asset duplicated successfully');
      onAssetUpdate();
    } catch (error) {
      toast.error('Failed to duplicate asset');
      console.error(error);
    }
  };

  const getAssetTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      stock: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      crypto: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      bond: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      etf: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      real_estate: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      commodity: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const composedAssets = assets.filter(asset => asset.source === 'manual' || !asset.source);
  const apiAssets = assets.filter(asset => asset.source === 'api' || asset.source === 'universe');

  const renderAssetRow = (asset: Asset) => (
    <div
      key={asset.id}
      className="flex items-center justify-between p-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-sm truncate">{asset.name}</h4>
          {asset.symbol && (
            <span className="text-xs text-muted-foreground">({asset.symbol})</span>
          )}
          <Badge className={`text-xs ${getAssetTypeColor(asset.asset_type)}`}>
            {asset.asset_type}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Qty: {asset.quantity}</span>
          <span>Value: ${asset.total_value?.toLocaleString() || '0'}</span>
          <span>Price: ${asset.current_price?.toLocaleString() || '0'}</span>
        </div>
      </div>
      
      <div className="flex gap-1 ml-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onLoadAsset(asset.id)}
          title="Load into composer"
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
  );

  if (assets.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Your Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No assets found.</p>
            <p className="text-sm mt-2">Create an asset first to start building compositions.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Your Assets</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your existing assets and load them into the composer
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="composed" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="composed" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Composed ({composedAssets.length})
              </TabsTrigger>
              <TabsTrigger value="imported" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Imported ({apiAssets.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="composed" className="mt-4">
              <ScrollArea className="h-[400px] w-full border rounded-md">
                <div className="p-1">
                  {composedAssets.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No composed assets yet.</p>
                      <p className="text-sm mt-2">Create assets manually to start building compositions.</p>
                    </div>
                  ) : (
                    composedAssets.map(renderAssetRow)
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="imported" className="mt-4">
              <ScrollArea className="h-[400px] w-full border rounded-md">
                <div className="p-1">
                  {apiAssets.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No imported assets yet.</p>
                      <p className="text-sm mt-2">Import assets from APIs to manage them here.</p>
                    </div>
                  ) : (
                    apiAssets.map(renderAssetRow)
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Asset Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                placeholder="e.g., AAPL"
              />
            </div>

            <div>
              <Label htmlFor="asset_type">Asset Type</Label>
              <Select value={formData.asset_type} onValueChange={(value: "stock" | "crypto" | "bond" | "etf" | "real_estate" | "commodity" | "other") => setFormData({ ...formData, asset_type: value })}>
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

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="purchase_price">Purchase Price</Label>
              <Input
                id="purchase_price"
                type="number"
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => setFormData({ ...formData, purchase_price: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="current_price">Current Price</Label>
              <Input
                id="current_price"
                type="number"
                step="0.01"
                value={formData.current_price}
                onChange={(e) => setFormData({ ...formData, current_price: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveAsset} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}