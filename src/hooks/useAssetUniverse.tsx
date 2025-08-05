import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type AssetType = 'stock' | 'crypto' | 'bond' | 'etf' | 'real_estate' | 'commodity' | 'other';

export interface UniverseAsset {
  id: string;
  symbol: string;
  name: string;
  asset_type: AssetType;
  current_price?: number;
  market_cap?: number;
  sector?: string;
  industry?: string;
  country?: string;
  exchange?: string;
  description?: string;
  source: string;
  source_id?: string;
  metadata?: any;
  is_active: boolean;
}

export const useAssetUniverse = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<UniverseAsset[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAssets = async (filters?: {
    search?: string;
    asset_type?: string;
    sector?: string;
    source?: string;
  }) => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('asset_universe')
        .select('*')
        .eq('is_active', true);

      if (filters?.search) {
        query = query.or(`symbol.ilike.%${filters.search}%,name.ilike.%${filters.search}%`);
      }
      
      if (filters?.asset_type) {
        query = query.eq('asset_type', filters.asset_type as AssetType);
      }
      
      if (filters?.sector) {
        query = query.eq('sector', filters.sector);
      }
      
      if (filters?.source) {
        query = query.eq('source', filters.source);
      }

      const { data, error } = await query
        .order('symbol', { ascending: true })
        .limit(1000);

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching asset universe:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAssetToUniverse = async (asset: Omit<UniverseAsset, 'id'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('asset_universe')
        .insert({
          symbol: asset.symbol,
          name: asset.name,
          asset_type: asset.asset_type,
          current_price: asset.current_price,
          market_cap: asset.market_cap,
          sector: asset.sector,
          industry: asset.industry,
          country: asset.country,
          exchange: asset.exchange,
          description: asset.description,
          source: asset.source,
          source_id: asset.source_id,
          metadata: asset.metadata,
          is_active: asset.is_active,
        })
        .select()
        .single();

      if (error) throw error;
      await fetchAssets();
      return data;
    } catch (error) {
      console.error('Error adding asset to universe:', error);
      return null;
    }
  };

  const populateYahooAssets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('populate-yahoo-assets');
      if (error) throw error;
      
      // Refresh the assets list after population
      await fetchAssets();
      return data;
    } catch (error) {
      console.error('Error populating Yahoo Finance assets:', error);
      return null;
    }
  };

  const getSourceDisplayName = (source: string) => {
    const sourceMap: Record<string, string> = {
      'yahoo_finance': 'Yahoo Finance',
      'manual': 'Custom',
      'node_created': 'Node Created',
      'api': 'API Import',
      'default': 'System'
    };
    return sourceMap[source] || source;
  };

  useEffect(() => {
    if (user) {
      fetchAssets();
    }
  }, [user]);

  return {
    assets,
    loading,
    fetchAssets,
    addAssetToUniverse,
    populateYahooAssets,
    getSourceDisplayName,
  };
};