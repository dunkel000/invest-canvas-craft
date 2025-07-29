import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Trash2 } from 'lucide-react';
import { useAssetUniverse } from '@/hooks/useAssetUniverse';
import { usePortfolios } from '@/hooks/usePortfolios';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AssetPickerProps {
  portfolioId: string;
}

export const AssetPicker = ({ portfolioId }: AssetPickerProps) => {
  const { user } = useAuth();
  const { assets: universeAssets, loading, fetchAssets } = useAssetUniverse();
  const { portfolioAssets, refreshAssets } = usePortfolios();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [allocationInputs, setAllocationInputs] = useState<{ [key: string]: string }>({});

  const filteredAssets = universeAssets.filter(asset => {
    const matchesSearch = asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedAssetType || asset.asset_type === selectedAssetType;
    const matchesSector = !selectedSector || asset.sector === selectedSector;
    const matchesSource = !selectedSource || asset.source === selectedSource;
    
    return matchesSearch && matchesType && matchesSector && matchesSource;
  });

  const uniqueSectors = [...new Set(universeAssets.map(a => a.sector).filter(Boolean))];
  const uniqueAssetTypes = [...new Set(universeAssets.map(a => a.asset_type))];
  const uniqueSources = [...new Set(universeAssets.map(a => a.source))];

  const addAssetToPortfolio = async (universeAsset: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('assets')
        .insert({
          portfolio_id: portfolioId,
          user_id: user.id,
          universe_asset_id: universeAsset.id,
          name: universeAsset.name,
          symbol: universeAsset.symbol,
          asset_type: universeAsset.asset_type,
          quantity: 0,
          current_price: universeAsset.current_price,
          allocation_percentage: 0,
          target_allocation_percentage: 0,
        });

      if (error) throw error;
      
      await refreshAssets();
      toast.success(`${universeAsset.symbol} added to portfolio`);
    } catch (error) {
      console.error('Error adding asset to portfolio:', error);
      toast.error('Failed to add asset to portfolio');
    }
  };

  const removeAssetFromPortfolio = async (assetId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', assetId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await refreshAssets();
      toast.success('Asset removed from portfolio');
    } catch (error) {
      console.error('Error removing asset from portfolio:', error);
      toast.error('Failed to remove asset');
    }
  };

  const updateAssetAllocation = async (assetId: string, allocationPercentage: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('assets')
        .update({ allocation_percentage: allocationPercentage })
        .eq('id', assetId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await refreshAssets();
    } catch (error) {
      console.error('Error updating allocation:', error);
      toast.error('Failed to update allocation');
    }
  };

  const handleAllocationChange = (assetId: string, value: string) => {
    setAllocationInputs({ ...allocationInputs, [assetId]: value });
  };

  const handleAllocationSubmit = (assetId: string) => {
    const value = parseFloat(allocationInputs[assetId] || '0');
    if (!isNaN(value) && value >= 0 && value <= 100) {
      updateAssetAllocation(assetId, value);
      setAllocationInputs({ ...allocationInputs, [assetId]: '' });
    }
  };

  const totalCurrentAllocation = portfolioAssets.reduce(
    (sum, asset) => sum + (asset.allocation_percentage || 0), 
    0
  );

  return (
    <div className="space-y-6">
      {/* Current Portfolio Assets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Portfolio Assets</CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant={totalCurrentAllocation > 100 ? "destructive" : "secondary"}>
                Total: {totalCurrentAllocation.toFixed(1)}%
              </Badge>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Assets
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Assets from Universe</DialogTitle>
                  </DialogHeader>
                  
                  {/* Search and Filters */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search assets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Asset Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        {uniqueAssetTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedSector} onValueChange={setSelectedSector}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Sectors</SelectItem>
                        {uniqueSectors.map(sector => (
                          <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedSource} onValueChange={setSelectedSource}>
                      <SelectTrigger>
                        <SelectValue placeholder="Source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Sources</SelectItem>
                        {uniqueSources.map(source => (
                          <SelectItem key={source} value={source}>{source}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedAssetType('');
                        setSelectedSector('');
                        setSelectedSource('');
                      }}
                    >
                      Clear
                    </Button>
                  </div>

                  {/* Asset Grid */}
                  <div className="grid gap-2 max-h-96 overflow-y-auto">
                    {loading ? (
                      <div className="text-center py-8">Loading assets...</div>
                    ) : (
                      filteredAssets.map((asset) => {
                        const isInPortfolio = portfolioAssets.some(
                          pa => pa.universe_asset_id === asset.id
                        );
                        
                        return (
                          <div 
                            key={asset.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{asset.symbol}</span>
                                <span className="text-sm text-muted-foreground">{asset.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {asset.source}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{asset.asset_type}</span>
                                {asset.sector && <span>{asset.sector}</span>}
                                {asset.current_price && (
                                  <span>${asset.current_price.toFixed(2)}</span>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant={isInPortfolio ? "outline" : "default"}
                              disabled={isInPortfolio}
                              onClick={() => addAssetToPortfolio(asset)}
                            >
                              {isInPortfolio ? 'Added' : 'Add'}
                            </Button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {portfolioAssets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No assets in this portfolio yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Click "Add Assets" to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {portfolioAssets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{asset.symbol || asset.name}</span>
                      <Badge variant="outline">{asset.asset_type}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {asset.symbol && asset.name !== asset.symbol && asset.name}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        ${(asset.total_value || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {asset.allocation_percentage?.toFixed(1) || 0}%
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="0"
                        value={allocationInputs[asset.id] || ''}
                        onChange={(e) => handleAllocationChange(asset.id, e.target.value)}
                        className="w-20 text-center"
                        max="100"
                        min="0"
                        step="0.1"
                      />
                      <span className="text-xs text-muted-foreground">%</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAllocationSubmit(asset.id)}
                        disabled={!allocationInputs[asset.id]}
                      >
                        Set
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAssetFromPortfolio(asset.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};