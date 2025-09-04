import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

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
  // Only show composed assets (manual and node_created)
  const composedAssets = assets.filter(asset => 
    !asset.source || asset.source === 'manual' || asset.source === 'node_created'
  );

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
        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
          <span className="text-xs font-semibold text-primary">
            {asset.symbol ? asset.symbol.slice(0, 2) : asset.name.slice(0, 2)}
          </span>
        </div>
        <div>
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
        <div className="text-right text-sm">
          <div className="font-medium">${asset.total_value?.toLocaleString() || '0'}</div>
          <div className="text-xs text-muted-foreground">{asset.quantity} shares</div>
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onLoadAsset(asset.id)}
          title="Load into composer"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  if (composedAssets.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Composed Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No composed assets found.</p>
            <p className="text-sm mt-2">Create composed assets to start building with them.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Composed Assets ({composedAssets.length})</CardTitle>
        <p className="text-sm text-muted-foreground">
          Load your composed assets into the Asset Composer
        </p>
      </CardHeader>
      <CardContent>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {composedAssets.map(renderAssetRow)}
        </div>
      </CardContent>
    </Card>
  );
}